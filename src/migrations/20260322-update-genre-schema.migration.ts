/**
 * @fileoverview Data migration script to synchronize genre movie counts.
 * Iterates through all genres and recalculates movie associations for accuracy.
 */

import "dotenv/config";
import connect from "@/shared/config/database.js";
import mongoose from "mongoose";
import {Movie} from "@/domains/movie/model/movie/Movie.model";
import {Genre} from "@/domains/genre/models/genre";

/**
 * Executes the synchronization process.
 */
connect().then(async () => {
    const cursor = Genre.find().cursor();

    for (
        let genre = await cursor.next();
        genre !== null;
        genre = await cursor.next()
    ) {
        /** Recalculate actual count from the Movie collection. */
        const count = await Movie.countDocuments({genres: genre._id});

        console.log(`Updating: ${genre.name} | Found: ${count} movies`);

        genre.movieCount = count ?? 0;
        await genre.save();
    }

    console.log("Migration completed successfully.");
}).catch((error: unknown) => {
    console.error("[MIGRATION ERROR] ", error);
}).finally(async () => {
    console.log("Closing database connection...");
    await mongoose.disconnect();
});