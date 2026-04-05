/**
 * @file Migration script to initialize new fields on existing MovieReview documents.
 * @filename 20260405-add-fields-to-movie-reviews.migration.ts
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import {MovieReview} from "@domains/movieReview/model/MovieReview.model";

/**
 * Migration: Updates all existing MovieReview documents to include 'isPublic' and 'moderationLogs'.
 * ---
 */
connect().then(async () => {
    console.log("Starting MovieReview migration...");

    const cursor = MovieReview.find().cursor();

    for (let review = await cursor.next(); review !== null; review = await cursor.next()) {
        /** Initialize new schema fields */
        review.isPublic = true;
        review.moderationLogs = [];

        await review.save();
        console.log(`Updated review ID: ${review._id}`);
    }

    await MovieReview.syncIndexes();
    console.log("--- Migration Completed Successfully ---");
}).catch((err) => {
    console.error("Migration Failed: ", err);
}).finally(async () => {
    await mongoose.disconnect();
    console.log("Mongoose connection closed.");
});