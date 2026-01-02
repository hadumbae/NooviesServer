/**
 * @file 20260102-add-slug-to-seats.migration.ts
 * @summary Backfills missing `slug` values for Seat documents.
 *
 * @description
 * Connects to MongoDB, iterates through all Seat records using a cursor,
 * generates slugs for documents missing them, persists the updates, and
 * ensures all Seat indexes are created before disconnecting.
 *
 * Intended for one-off maintenance or migration usage.
 */

import 'dotenv/config';

import mongoose from "mongoose";
import connect from "@config/database.js";
import Seat from "../domains/seat/model/Seat.model.js";
import generateSlug from "../shared/utility/generateSlug.js";

connect().then(async () => {
    const cursor = Seat.find().cursor();

    for (let seat = await cursor.next(); seat !== null; seat = await cursor.next()) {
        if (!seat.slug) {
            seat.slug = generateSlug(seat.layoutType);
            await seat.save();
        }
    }

    await Seat.createIndexes();
    console.log("Done updating seats.");
}).catch((err) => {
    console.log(err);
}).finally(async () => {
    await mongoose.disconnect();
});
