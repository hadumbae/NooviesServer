/**
 * @file Maintenance script for migrating and normalizing existing Reservation records.
 * @filename updateReservations.ts
 */

import "dotenv/config";
import connect from "@/shared/config/database.js";
import mongoose from "mongoose";
import {Reservation} from "src/domains/reservations/_model/reservation";
import {generateReservationUniqueCode} from "src/domains/reservations/_feat/generate-reservation-code";

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
        reservation.isDeleted = false;
        reservation.deletedAt = null;

        const now = new Date();

        reservation.createdAt = now;
        reservation.updatedAt = now;

        reservation.uniqueCode = generateReservationUniqueCode();

        await reservation.save();
    }

    console.log("Done updating reservations.");
}).catch((err) => {
    console.error("Migration Error: ", err);
}).finally(async () => {
    await mongoose.disconnect();
});