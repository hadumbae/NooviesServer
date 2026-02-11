/**
 * @file migrateReservationSlugs.ts
 *
 * One-time migration script that backfills missing `slug` fields
 * on existing Reservation documents.
 *
 * Responsibilities:
 * - Ensure schema indexes are synchronized
 * - Stream all reservations via cursor (memory-safe)
 * - Generate a slug from the associated movie title
 * - Persist updated reservations
 *
 * @remarks
 * - Intended to be executed manually (NOT part of runtime app logic).
 * - Safe for large datasets due to cursor iteration.
 * - Assumes each reservation references a valid Showing.
 * - Throws if a reservation references a missing Showing.
 *
 * @warning
 * This script mutates production data.
 * Always:
 * - Run against a backup or staging environment first
 * - Ensure slug uniqueness constraints are satisfied
 * - Confirm idempotency before re-running
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import Reservation from "../domains/reservation/model/reservation/Reservation.model.js";
import Showing from "../domains/showing/model/showing/Showing.model.js";
import createHttpError from "http-errors";
import generateSlug from "../shared/utility/generateSlug.js";
import type { MovieSchemaFields } from "../domains/movie/model/Movie.types.js";

connect().then(async () => {
    /**
     * Ensure indexes are in sync before migration.
     * Required if slug has uniqueness constraints.
     */
    await Reservation.syncIndexes();

    /**
     * Stream reservations using a cursor
     * to avoid loading entire collection into memory.
     */
    const cursor = Reservation.find().cursor();

    for (
        let reservation = await cursor.next();
        reservation !== null;
        reservation = await cursor.next()
    ) {
        if (!reservation.slug) {
            /**
             * Fetch associated movie title via showing.
             */
            const showing = await Showing
                .findById(reservation.showing)
                .select("movie")
                .populate("movie")
                .lean();

            if (!showing) {
                throw createHttpError(
                    500,
                    "Reservation references invalid showing."
                );
            }

            reservation.slug = generateSlug(
                (showing.movie as MovieSchemaFields).title
            );

            await reservation.save();
        }
    }

    console.log("Done.");
}).catch(
    err => console.error("Migration Error:", err)
).finally(async () => {
    await mongoose.disconnect();
});
