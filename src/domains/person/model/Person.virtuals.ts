import { PersonSchema } from "./Person.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * Virtual field for the total number of movie credits associated with this person.
 *
 * @remarks
 * - Uses the `MovieCredit` collection.
 * - Counts documents where `person` matches this person's `_id`.
 * - Does not store the count in the database; computed on the fly.
 *
 * @example
 * // Assuming `person` is a document with lean virtuals applied:
 * const creditCount = person.creditCount;
 */
PersonSchema.virtual("creditCount", {
    ref: "MovieCredit",
    localField: "_id",
    foreignField: "person",
    count: true,
});

/**
 * Virtual field for the total number of distinct movies associated with this person.
 *
 * @remarks
 * - Uses the `Movie` collection.
 * - References `credits.movie` from populated movie credits.
 * - Counts documents without storing the value in the database.
 *
 * @example
 * // Assuming `person` is a document with lean virtuals applied:
 * const movieCount = person.movieCount;
 */
PersonSchema.virtual("movieCount", {
    ref: "Movie",
    localField: "credits.movie",
    foreignField: "_id",
    count: true,
});

/**
 * Plugin to enable virtuals on documents returned via `.lean()`.
 *
 * @remarks
 * - Must be applied after defining virtuals.
 * - Ensures that virtuals like `creditCount` and `movieCount` are included
 *   when using lean queries.
 */
PersonSchema.plugin(mongooseLeanVirtuals);
