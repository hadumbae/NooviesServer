/**
 * @file 20260102-add-slug-to-screens.migration.ts
 * @summary Backfills missing `slug` values for Screen documents.
 *
 * @description
 * Connects to MongoDB, iterates through all Screen records using a cursor,
 * generates slugs for documents missing them, persists the updates, and
 * ensures relevant indexes exist before disconnecting.
 *
 * Intended as a one-off maintenance or migration script.
 */

import 'dotenv/config';

import mongoose from "mongoose";
import connect from "@config/database.js";
import Screen from "../domains/screen/model/Screen.model.js";
import generateSlug from "../shared/utility/generateSlug.js";

connect().then(async () => {
    const cursor = Screen.find().cursor();

    for (let screen = await cursor.next(); screen != null; screen = await cursor.next()) {
        if (!screen.slug) {
            screen.slug = generateSlug(screen.name);
            await screen.save();
        }
    }

    await Screen.createIndexes();
    console.log("Done updating seats.");
}).catch((err) => {
    console.error(err);
}).finally(async () => {
    await mongoose.disconnect();
});
