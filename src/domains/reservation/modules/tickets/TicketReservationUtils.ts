/**
 * @file TicketReservationUtils.ts
 *
 * Reservation checkout service.
 *
 * Creates `RESERVED` reservations for general admission
 * and reserved seating. Does not handle payment capture.
 */

import type {ReservationSchemaFields} from "../../model/reservation/Reservation.types.js";
import {calculateFutureDate} from "../../../../shared/utility/date/LuxonDateUtils.js";
import {fetchPopulatedShowing} from "../../../showing/utilities/fetchPopulatedShowing.js";
import type {ReserveTicketInputData} from "../../schemas/reserve-ticket/ReserveTicket.input.schema.js";
import {validateTicketReservationInput} from "../../utilities/validation/validateTicketReservationInput.js";
import Reservation from "../../model/reservation/Reservation.model.js";
import {BookingError} from "../../../../shared/errors/reservations/BookingError.js";
import {calculateTotalSeatingCost} from "../../../seatmap/utilities/calculateTotalSeatingCost.js";
import {
    checkSeatAvailabilityForReservation,
    fetchAvailableSeatingForReservation,
} from "../ReservationSeatingUtils.js";
import type {
    ReserveGeneralTicketData,
    ReserveSeatTicketData,
    ReserveTicketsParams,
} from "./TicketReservationUtils.types.js";
import {ReservationPopulateRefs} from "../../constants/ReservationPopulateRefs.js";

/**
 * Saves a validated `RESERVED` reservation and populates refs.
 */
const saveReservation = async (
    data: ReserveTicketInputData
): Promise<ReservationSchemaFields> => {
    const inputData = validateTicketReservationInput(data);

    const doc = new Reservation(inputData);
    await doc.save();
    await doc.populate(ReservationPopulateRefs);

    return doc;
};

/**
 * Type-specific checkout handlers.
 *
 * Each handler validates availability, calculates pricing,
 * and persists the reservation.
 */
const ReserveHandlers = {
    /**
     * General admission checkout.
     *
     * Validates capacity and computes total price.
     *
     * @throws BookingError if insufficient seats.
     */
    GENERAL_ADMISSION: async (
        data: ReserveGeneralTicketData
    ): Promise<ReservationSchemaFields> => {
        const {showing: showingID, ticketCount} = data;
        const {ticketPrice, screen: {_id: screenID}} = await fetchPopulatedShowing(showingID);

        const hasSeats = await checkSeatAvailabilityForReservation({
            screenID,
            showingID,
            ticketCount
        });

        if (!hasSeats) {
            throw new BookingError({
                statusCode: 409,
                errorCode: "ERR_SCREEN_FULL",
                message: "There are no available seats.",
            });
        }

        data.pricePaid = ticketPrice * ticketCount;

        return saveReservation(data);
    },

    /**
     * Reserved seating checkout.
     *
     * Validates seat availability and computes total price.
     *
     * @throws BookingError if seats are unavailable.
     */
    RESERVED_SEATS: async (
        data: ReserveSeatTicketData
    ): Promise<ReservationSchemaFields> => {
        const seating = await fetchAvailableSeatingForReservation(data.selectedSeating);

        data.pricePaid = calculateTotalSeatingCost(seating);

        return saveReservation(data);
    },
};

/**
 * Creates a new `RESERVED` reservation.
 *
 * Applies base metadata and delegates to the
 * appropriate handler.
 *
 * @throws BookingError for invalid type or availability failure.
 */
export async function reserveTickets(
    {userID, data}: ReserveTicketsParams
): Promise<ReservationSchemaFields> {
    const baseData: ReserveTicketInputData = {
        ...data,
        user: userID,
        status: "RESERVED",
        dateReserved: new Date(),
        expiresAt: calculateFutureDate({minutes: 30}),
        pricePaid: 0,
    };

    if (baseData.reservationType === "GENERAL_ADMISSION") {
        return ReserveHandlers.GENERAL_ADMISSION(baseData);
    }

    if (baseData.reservationType === "RESERVED_SEATS") {
        return ReserveHandlers.RESERVED_SEATS(baseData);
    }

    throw new BookingError({
        statusCode: 409,
        errorCode: "ERR_INVALID_RESERVATION_TYPE",
        message: `Invalid Reservation Type. Received: ${(baseData as any).reservationType}`,
    });
}
