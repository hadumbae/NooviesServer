/**
 * @file Migration script to sync MovieCredit model indexes.
 * @filename 20260313-update-movie-credit-indexes.migration.ts
 */

import "dotenv/config";
import connect from "@/shared/config/database.js";
import MovieCredit from "@/domains/movie-credits/_models/credit/MovieCredit.model";
import mongoose from "mongoose";

/**
 * Connects to the database and synchronizes MovieCredit indexes.
 */
connect().then(async () => {
    await MovieCredit.syncIndexes();
}).catch(
    err => console.error("Migration Error:", err)
).finally(async () => {
    await mongoose.disconnect();
});