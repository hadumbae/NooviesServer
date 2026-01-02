/**
 * @file 20260102-add-slug-to-theatres.migration.ts
 * @summary Backfills missing `slug` values for Theatre documents.
 *
 * @description
 * Connects to MongoDB, iterates through all Theatre records using a cursor,
 * generates slugs for documents missing them, persists the updates, and
 * ensures all Theatre indexes are created before disconnecting.
 *
 * Intended for one-off maintenance or migration usage.
 */

import 'dotenv/config';

import mongoose from "mongoose";
import connect from "@config/database.js";
import Theatre from "../domains/theatre/model/Theatre.model.js";
import generateSlug from "../shared/utility/generateSlug.js";

connect().then(async () => {
    const cursor = Theatre.find().cursor();

    for (let theatre = await cursor.next(); theatre !== null; theatre = await cursor.next()) {
        if (!theatre.slug) {
            theatre.slug = generateSlug(theatre.name);
            await theatre.save();
        }
    }

    await Theatre.createIndexes();
    console.log("Done updating theatres.");
}).catch((err) => {
    console.log(err);
}).finally(async () => {
    await mongoose.disconnect();
});
