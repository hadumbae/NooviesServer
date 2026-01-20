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
import PersonModel from "../domains/person/model/Person.model.js";
import generateSlug from "../shared/utility/generateSlug.js";

/**
 * Connect to the database and update missing person slugs.
 */
connect().then(async () => {
    const cursor = PersonModel.find().cursor();

    for (
        let person = await cursor.next();
        person !== null;
        person = await cursor.next()
    ) {
        if (!person.slug) {
            person.slug = generateSlug(person.name);
            await person.save();
        }
    }

    await PersonModel.createIndexes();
    console.log("Done updating persons.");
})
    .catch((err) => {
        console.log(err);
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
