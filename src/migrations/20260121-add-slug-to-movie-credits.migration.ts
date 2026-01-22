/**
 * @file 20260121-add-slug-to-persons.migration.ts
 *
 * One-off maintenance script to backfill missing `slug` fields
 * on existing Person documents.
 *
 * - Iterates over all persons using a cursor
 * - Generates slugs from the `name` field when missing
 * - Persists updates safely per document
 * - Rebuilds indexes after completion
 *
 * Intended to be run manually in a controlled environment.
 */

import 'dotenv/config';

import mongoose from "mongoose";
import connect from "@config/database.js";
import generateSlug from "../shared/utility/generateSlug.js";
import MovieCredit from "../domains/movieCredit/models/MovieCredit.model.js";
import PersonModel from "../domains/person/model/Person.model.js";

/**
 * Connect to the database and update missing person slugs.
 */
connect().then(async () => {
    const cursor = MovieCredit.find().cursor();

    for (let credit = await cursor.next(); credit !== null; credit = await cursor.next()) {
        const person = await PersonModel.findById(credit.person);

        if (!credit.slug && person) {
            credit.slug = generateSlug(person.name);
            await credit.save();
        }
    }

    await MovieCredit.createIndexes();
    console.log("Done updating movie credits.");
}).catch((err) => {
    console.log(err);
}).finally(async () => {
    await mongoose.disconnect();
});
