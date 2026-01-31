import Reservation from "../model/reservation/Reservation.model.js";
import {Types} from "mongoose";

/**
 * Counts the total number of tickets sold for a given showing.
 *
 * Aggregates reservations filtered by:
 * - the provided showing ID
 * - `PAID` reservation status
 *
 * The result represents the sum of `ticketCount` across all paid reservations,
 * not the number of reservation documents.
 *
 * @param showingID - MongoDB ObjectId of the showing to count paid tickets for
 * @returns Total number of paid tickets for the showing
 */
export async function countPaidReservationsByShowing(showingID: Types.ObjectId): Promise<number> {
    const reservationCountValues = await Reservation.aggregate([
        {$match: {showing: showingID, status: "PAID"}},
        {$group: {_id: null, totalAmount: {$sum: "$ticketCount"}}},
    ]);

    return reservationCountValues[0]?.totalAmount ?? 0;
}
