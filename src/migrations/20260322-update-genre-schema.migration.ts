/**
 * @file Migration script to update existing Genre documents with default schema fields.
 * @filename 20260322-update-genre-schema.migration.ts
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import Genre from "../domains/genre/model/Genre.model.js";
import MovieModel from "../domains/movie/model/Movie.model.js";

/**
 * Executes a manual migration to ensure all Genre documents comply with the updated schema.
 * @remarks Connects to the database, iterates through all genres via a cursor to manage memory,
 * and initializes the `movieCount` field if it is currently undefined or null.
 */
connect().then(async () => {
    const cursor = Genre.find().cursor();

    for (
        let genre = await cursor.next();
        genre !== null;
        genre = await cursor.next()
    ) {
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