/**
 * @file Migration script to backfill SEO slugs and unique tracking codes for MovieReview documents.
 * @filename 20260405-add-more-fields-to-movie-reviews.migration.ts
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import {MovieReview} from "@domains/movieReview/model/MovieReview.model";
import generateSlug from "@shared/utility/generateSlug";
import {generateMovieReviewUniqueCode} from "@domains/movieReview/utilities/generateMovieReviewUniqueCode";

/**
 * Migration: Updates all existing MovieReview documents to include 'slug' and 'uniqueCode'.
 * ---
 */
connect().then(async () => {
    console.log("Starting MovieReview identity backfill migration...");

    const cursor = MovieReview.find().cursor();

    for (let review = await cursor.next(); review !== null; review = await cursor.next()) {
        review.slug = generateSlug("review");
        review.uniqueCode = generateMovieReviewUniqueCode();

        await review.save();
    }

    await MovieReview.syncIndexes();
    console.log(`--- Migration Completed Successfully ---`);
}).catch((err) => {
    console.error("Migration Failed: ", err);
}).finally(async () => {
    await mongoose.disconnect();
    console.log("Mongoose connection closed.");
});