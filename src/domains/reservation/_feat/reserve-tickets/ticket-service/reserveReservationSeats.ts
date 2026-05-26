import type {
    ReservationSchemaFields
} from "@domains/reservation/model/reservation/Reservation.types";
import SeatMap from "@domains/seatmap/model/SeatMap.model";
import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import {BookingError} from "@shared/errors/reservations/BookingError";
import type {DocumentType} from "@shared/types/mongoose/DocumentType";

/** Finalizes seat status from pending to reserved for a specific reservation. */
export async function reserveReservationSeats(
    reservation: DocumentType<ReservationSchemaFields>
): Promise<void> {
    const {_id, selectedSeating, reservationType} = reservation;

    if (reservationType === "GENERAL_ADMISSION") return;

    const seatsToReserve = selectedSeating!.map(({_id}) => _id);

    const {modifiedCount: reservedCount} = await SeatMap.updateMany(
        {_id: {$in: seatsToReserve}, status: "PENDING"},
        {reservation: _id, status: "RESERVED"},
    );

    if (seatsToReserve.length !== reservedCount) {
        await SeatMap.updateMany(
            {reservation: _id},
            {reservation: null, status: "AVAILABLE"}
        );

        await Reservation.findByIdAndUpdate(_id, {
            status: "INVALID",
            notes: "Seat(s) already reserved.",
        });

        throw new BookingError({
            statusCode: 409,
            errorCode: "ERR_SEAT_RESERVED",
            message: "Seat(s) already reserved.",
        });
    }
}