/**
 * @file Migration script to synchronize genre movie counts with the current database state.
 * @filename 20260322-update-genre-schema.migration.ts
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import Genre from "../domains/genre/model/Genre.model.js";
import MovieModel from "../domains/movie/model/Movie.model.js";

/**
 * Performs a deep synchronization of the `movieCount` field for all existing genres.
 * @remarks
 * - Uses a cursor to iterate through genres to avoid memory overhead on large datasets.
 * - Queries {@link MovieModel} to calculate the true document count per genre.
 * - Updates each genre document with the accurate count, ensuring UI consistency.
 */
connect().then(async () => {
    const cursor = Genre.find().cursor();

    for (
        let genre = await cursor.next();
        genre !== null;
        genre = await cursor.next()
    ) {
        /** Calculate actual movie associations for the current genre. */
        const count = await MovieModel.countDocuments({genres: genre._id});

        console.log(`Updating: ${genre.name} / ${count} movies`);

        genre.movieCount = count ?? 0;
        await genre.save();
    }

    console.log("Done updating genres.");
}).catch((error: unknown) => {
    console.error("[ERROR] ", error);
}).finally(async () => {
    console.log("Disconnecting...");
    await mongoose.disconnect();
})