/**
 * @file Orchestration service for initiating ticket reservations.
 * @filename service.ts
 */

import type {ReservationDoc, ReservationSchemaFields} from "../../../model/reservation/Reservation.types";
import {calculateFutureDate} from "@shared/utility/date/LuxonDateUtils";
import {fetchPopulatedShowing} from "@domains/showing/utilities/fetchPopulatedShowing";
import {BookingError} from "@shared/errors/reservations/BookingError";
import type {ReserveGeneralTicketData, ReserveSeatTicketData, ReserveTicketsParams} from "./service.types";
import Seat from "@domains/seat/model/Seat.model";
import Reservation from "@domains/reservation/model/reservation/Reservation.model";
import SeatMap from "@domains/seatmap/model/SeatMap.model";
import type {SeatMapSchemaFields} from "@domains/seatmap/model/SeatMap.types";
import {ReservationPopulateRefs} from "@domains/reservation/constants/ReservationPopulateRefs";
import {RequestValidationError} from "@shared/errors/RequestValidationError";
import {
    type ReserveTicketPersistenceData,
    ReserveTicketPersistenceSchema
} from "@domains/reservation/features/reserve-tickets/schemas";

/**
 * Main entry point for initiating a ticket reservation hold.
 * @param params - Identity context and client-provided request data.
 * @returns Fully initialized and saved reservation document.
 * @throws {BookingError} 409 - If the reservation type is invalid or availability checks fail.
 */
export async function reserveTickets(
    {userID, inputData}: ReserveTicketsParams
): Promise<ReservationSchemaFields> {
    const persistenceData: ReserveTicketPersistenceData = {
        ...inputData,
        user: userID,
        status: "RESERVED",
        dateReserved: new Date(),
        /** Default hold period of 1 day. */
        expiresAt: calculateFutureDate({days: 1}),
        pricePaid: 0,
    };

    if (persistenceData.reservationType === "GENERAL_ADMISSION") {
        return ReserveHandlers.GENERAL_ADMISSION(persistenceData);
    }

    if (persistenceData.reservationType === "RESERVED_SEATS") {
        return ReserveHandlers.RESERVED_SEATS(persistenceData);
    }

    throw new BookingError({
        statusCode: 409,
        errorCode: "ERR_INVALID_RESERVATION_TYPE",
        message: `Invalid Reservation Type. Received: ${(persistenceData as any).reservationType}`,
    });
}

/**
 * Internal strategy handlers for specific reservation types.
 */
const ReserveHandlers = {
    /**
     * Logic for General Admission (GA) bookings.
     * @throws {BookingError} 409 - If total requested tickets exceed remaining screen capacity.
     */
    GENERAL_ADMISSION: async (data: ReserveGeneralTicketData): Promise<ReservationSchemaFields> => {
        const {showing: showingID, ticketCount: seatsToReserve} = data;
        const {ticketPrice, screen: {_id: screenID}} = await fetchPopulatedShowing(showingID);

        const totalScreenSeats = await Seat.countDocuments({
            screen: screenID,
            layoutType: "SEAT",
        });

        if (totalScreenSeats === 0) {
            throw new BookingError({
                statusCode: 409,
                errorCode: "ERR_SCREEN_FULL",
                message: "There are no available seats.",
            });
        }

        const reservedCheck = await Reservation.aggregate([
            {$match: {showing: showingID, status: "PAID"}},
            {$group: {_id: null, totalAmount: {$sum: "$ticketCount"}}},
        ]);

        const reservedSeats = reservedCheck[0]?.totalAmount ?? 0;
        const hasSeats = totalScreenSeats >= reservedSeats + seatsToReserve;

        if (!hasSeats) {
            throw new BookingError({
                statusCode: 409,
                errorCode: "ERR_SCREEN_FULL",
                message: "There are no available seats.",
            });
        }

        data.pricePaid = ticketPrice * seatsToReserve;

        return saveValidatedReservation(data);
    },

    /**
     * Logic for Reserved Seating bookings using MongoDB transactions.
     * @throws {BookingError} 409 - If any requested seat is not 'AVAILABLE'.
     */
    RESERVED_SEATS: async (data: ReserveSeatTicketData): Promise<ReservationSchemaFields> => {
        const {selectedSeating} = data;
        const session = await SeatMap.startSession();
        let seating: SeatMapSchemaFields[] = [];

        try {
            seating = await session.withTransaction(async () => {
                const {modifiedCount: heldSeats} = await SeatMap.updateMany(
                    {_id: {$in: selectedSeating}, status: "AVAILABLE"},
                    {status: "PENDING"}
                );

                if (heldSeats !== selectedSeating.length) {
                    await SeatMap.updateMany(
                        {_id: {$in: selectedSeating}, status: "PENDING"},
                        {status: "AVAILABLE"}
                    );

                    throw new BookingError({
                        statusCode: 409,
                        message: "Seat(s) already reserved.",
                        errorCode: "ERR_SEAT_RESERVED",
                    });
                }

                return SeatMap
                    .find({_id: {$in: selectedSeating}, status: "PENDING"})
                    .populate(["seat"])
                    .lean();
            });
        } catch (error: unknown) {
            if (error instanceof BookingError) throw error;
            throw new BookingError({
                statusCode: 500,
                message: "An unknown error occured trying to reserve seats.",
                errorCode: "ERR_UNKNOWN_ERROR",
            });
        } finally {
            await session.endSession();
        }

        data.pricePaid = seating
            .map(({overridePrice, basePrice, priceMultiplier}) => overridePrice ?? basePrice * priceMultiplier)
            .reduce((acc, cur) => acc + cur, 0);

        return saveValidatedReservation(data);
    },
};

/**
 * Final validation and persistence for a reservation.
 * @param data - The complete payload containing both user input and system metadata.
 * @returns The populated Mongoose document.
 * @throws {RequestValidationError} 422 - If data violates the persistence schema.
 */
export const saveValidatedReservation = async (
    data: ReserveTicketPersistenceData
): Promise<ReservationSchemaFields> => {
    const {data: parsedData, success, error} = ReserveTicketPersistenceSchema.safeParse(data);

    if (!success) {
        throw new RequestValidationError({
            message: "Failed to parse ticket checkout input data.",
            errors: error?.errors,
            raw: data,
        });
    }

    const doc = new Reservation(parsedData);
    await doc.save();

    await doc.populate(ReservationPopulateRefs);

    return doc;
};

/**
 * Commits previously locked 'PENDING' seats to a specific reservation ID.
 * @param reservation - The target reservation document.
 * @throws {BookingError} 409 - If the seats cannot be finalized.
 */
export async function reserveReservationSeats(
    reservation: ReservationDoc
): Promise<void> {
    const {_id, selectedSeating, reservationType} = reservation;

    if (reservationType === "GENERAL_ADMISSION") return;

    const seatsToReserve = selectedSeating.map(({_id}) => _id);

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