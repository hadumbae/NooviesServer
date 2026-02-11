/**
 * @file TicketReservationUtils.ts
 *
 * Checkout orchestration for creating `RESERVED` reservations.
 *
 * This module coordinates validation, availability checks, pricing,
 * and persistence for both general admission and reserved seating
 * reservations during checkout.
 *
 * Responsibilities:
 * - Validate and normalize checkout input
 * - Resolve showing and screen context
 * - Enforce capacity constraints (general admission)
 * - Validate and price selected seats (reserved seating)
 * - Create a `RESERVED` reservation with expiration metadata
 *
 * @remarks
 * - Does not perform payment capture
 * - Reservation lifecycle stops at `RESERVED`
 * - Seat locks created here are temporary
 * - Finalization or release is handled by downstream workflows
 */

import type {ReservationSchemaFields} from "../model/reservation/Reservation.types.js";
import {calculateDateNow, calculateFutureDate} from "../../../shared/utility/date/LuxonDateUtils.js";
import {fetchPopulatedShowing} from "../../showing/utilities/fetchPopulatedShowing.js";
import type {ReserveTicketInputData} from "../schemas/reserve-ticket/ReserveTicket.input.schema.js";
import {validateTicketReservationInput} from "../utilities/validation/validateTicketReservationInput.js";
import Reservation from "../model/reservation/Reservation.model.js";
import {BookingError} from "../../../shared/errors/reservations/BookingError.js";
import {calculateTotalSeatingCost} from "../../seatmap/utilities/calculateTotalSeatingCost.js";
import {
    checkSeatAvailabilityForReservation,
    fetchAvailableSeatingForReservation,
} from "./ReservationSeatingUtils.js";
import type {
    ReserveGeneralTicketData,
    ReserveSeatTicketData,
    ReserveTicketsParams,
} from "./TicketReservationUtils.types.js";
import {ReservationPopulateRefs} from "../constants/ReservationPopulateRefs.js";

/**
 * Persists a validated `RESERVED` reservation.
 *
 * @param data - Fully validated checkout input
 * @returns The saved reservation document
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
 * Reservation handlers by reservation type.
 *
 * Each handler is responsible for:
 * - Availability validation
 * - Price calculation
 * - Delegating persistence
 */
const ReserveHandlers = {
    /**
     * Handles general admission reservations.
     *
     * Performs capacity validation against the screen before
     * creating the reservation.
     */
    GENERAL_ADMISSION: async (
        data: ReserveGeneralTicketData
    ): Promise<ReservationSchemaFields> => {
        const {showing: showingID, ticketCount} = data;
        const {ticketPrice, screen: {_id: screenID}} = await fetchPopulatedShowing(showingID);

        const hasSeats = await checkSeatAvailabilityForReservation({screenID, showingID, ticketCount});

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
     * Handles reserved seating reservations.
     *
     * Validates seat availability and calculates the total
     * price based on the selected seating.
     */
    RESERVED_SEATS: async (
        data: ReserveSeatTicketData
    ): Promise<ReservationSchemaFields> => {
        const {selectedSeating} = data;

        const seating = await fetchAvailableSeatingForReservation(selectedSeating);
        data.pricePaid = calculateTotalSeatingCost(seating);

        return saveReservation(data);
    },
};

/**
 * Creates a `RESERVED` reservation during checkout.
 *
 * Applies common reservation metadata and delegates
 * processing based on reservation type.
 *
 * @param params - Reservation checkout parameters
 * @returns The created reservation
 *
 * @throws BookingError
 * - If the reservation type is invalid
 * - If availability constraints fail
 */
export async function reserveTickets(
    {userID, data}: ReserveTicketsParams
): Promise<ReservationSchemaFields> {
    const baseData: ReserveTicketInputData = {
        ...data,
        user: userID,
        status: "RESERVED",
        dateReserved: calculateDateNow(),
        expiresAt: calculateFutureDate({minute: 30}),
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
        message: `Invalid Reservation Type. Received: ${baseData["reservationType"]}`,
    });
}
