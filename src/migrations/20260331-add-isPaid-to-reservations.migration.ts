// 20260331-add-isPaid-to-reservations.migration.ts

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import Reservation from "../domains/reservation/model/reservation/Reservation.model.js";

/**
 * Execution block for the Reservation data migration.
 */
connect().then(async () => {
    await Reservation.syncIndexes();

    const cursor = Reservation
        .find()
        .setOptions({getSoftDeleted: true})
        .cursor();

    for (
        let reservation = await cursor.next();
        reservation !== null;
        reservation = await cursor.next()
    ) {
        reservation.isPaid = reservation.status === "PAID" && reservation.datePaid !== undefined;
        await reservation.save();
    }

    console.log("Done updating reservations.");
}).catch((err) => {
    console.error("Migration Error: ", err);
}).finally(async () => {
    await mongoose.disconnect();
});