/**
 * @file Data migration to initialize soft-delete fields for existing Showing documents.
 * @filename 20260319-add-soft-delete-to-showings.migration.ts
 *
 * @description
 * This migration iterates through all documents in the 'showings' collection and
 * sets default values for the newly introduced {@link ModelSoftDelete} fields.
 * * Fields initialized:
 * - `isDeleted`: set to `false`
 * - `deletedAt`: set to `null`
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import Showing from "../domains/showing/models/showing/Showing.model.js";

/**
 * Executes the migration logic.
 * * Uses a Mongoose cursor to handle large datasets efficiently.
 * Explicitly sets `getSoftDeleted: true` to bypass the `pre-find` hook filter,
 * ensuring all records (even those already marked) are correctly initialized.
 */
connect().then(async () => {
    const cursor = Showing
        .find()
        .setOptions({getSoftDeleted: true}) // Bypasses the auto-filter in Showing.hooks.ts
        .cursor();

    for (
        let showing = await cursor.next();
        showing !== null;
        showing = await cursor.next()
    ) {
        // Initialize ModelSoftDelete properties to ensure schema consistency
        showing.isDeleted = false;
        showing.deletedAt = null;

        await showing.save();
    }

    console.log("Done updating showings.");
}).catch((err) => {
    console.error("Error: ", err);
}).finally(async () => {
    /** Terminate the database connection after processing. */
    await mongoose.disconnect();
});