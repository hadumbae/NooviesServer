import {Types} from "mongoose";
import Reservation from "../model/reservation/Reservation.model.js";

/**
 * Counts the total number of tickets sold for a given showing.
 *
 * Aggregates reservation documents filtered by:
 * - the provided showing ID
 * - `PAID` reservation status
 *
 * @remarks
 * The returned value represents the sum of `ticketCount`
 * across all paid reservations, not the number of
 * reservation documents.
 *
 * Used for determining remaining seating capacity
 * in general admission workflows.
 *
 * @param showingID - MongoDB ObjectId of the showing
 * @returns Total number of paid tickets for the showing
 */
export async function countPaidReservationsByShowing(showingID: Types.ObjectId): Promise<number> {
    const reservationCountValues = await Reservation.aggregate([
        {$match: {showing: showingID, status: "PAID"}},
        {$group: {_id: null, totalAmount: {$sum: "$ticketCount"}}},
    ]);

    return reservationCountValues[0]?.totalAmount ?? 0;
}