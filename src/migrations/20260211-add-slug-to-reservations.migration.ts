/**
 * @file Migration script for backfilling SEO-friendly slugs on Reservation documents.
 * @filename migrateReservationSlugs.ts
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import Reservation from "../domains/reservation/model/reservation/Reservation.model.js";
import Showing from "../domains/showing/models/showing/Showing.model.js";
import createHttpError from "http-errors";
import generateSlug from "../shared/utility/generateSlug.js";
import type {PopulatedShowing} from "@domains/showing/models/showing/Showing.types";

/**
 * Execution block for the Reservation slug migration.
 */
connect().then(async () => {
    await Reservation.syncIndexes();

    const cursor = Reservation.find().cursor();

    for (
        let reservation = await cursor.next();
        reservation !== null;
        reservation = await cursor.next()
    ) {
        if (!reservation.slug) {
            const showing = await Showing
                .findById(reservation.showing)
                .select("movie")
                .populate("movie")
                .lean<PopulatedShowing>();

            if (!showing) {
                throw createHttpError(
                    500,
                    `Reservation ${reservation._id} references an invalid or missing showing.`
                );
            }

            reservation.slug = generateSlug(showing.movie.title);
            await reservation.save();
        }
    }

    console.log("Migration completed successfully.");
}).catch(
    err => console.error("Migration Error:", err)
).finally(async () => {
    /** Ensure the process exits cleanly. */
    await mongoose.disconnect();
    console.log("Mongoose Disconnected.");
});