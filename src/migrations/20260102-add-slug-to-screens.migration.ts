/**
 * @fileoverview Data migration script to backfill slugs for the Screen collection.
 * Ensures all existing Screen documents have a unique, URL-safe identifier for routing.
 * * @migration 20260102-add-slug-to-screens
 */

import 'dotenv/config';

import mongoose from "mongoose";
import connect from "@config/database.js";
import {Screen} from "@domains/screen/models/screen";
import generateSlug from "../shared/utility/generateSlug.js";

/**
 * Migration Execution Logic:
 */
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
