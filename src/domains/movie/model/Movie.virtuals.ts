import {MovieSchema} from "./Movie.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * Virtual field `showingCount` for the Movie model.
 *
 * @remarks
 * This virtual calculates the number of Showings associated with a movie.
 * It does not store data in the database but can be populated in queries.
 *
 * @example
 * ```ts
 * const movie = await Movie.findById(movieId).lean({ virtuals: true });
 * console.log(movie.showingCount); // Number of showings
 * ```
 */
MovieSchema.virtual("showingCount", {
    ref: "Showing",
    localField: "_id",
    foreignField: "movie",
    count: true,
});

/**
 * Mongoose plugin to enable lean queries to populate virtuals.
 *
 * @remarks
 * Applying `mongoose-lean-virtuals` ensures that calling `lean({ virtuals: true })`
 * on queries includes virtual fields like `showingCount` in the result.
 *
 * @example
 * ```ts
 * const movies = await Movie.find().lean({ virtuals: true });
 * console.log(movies[0].showingCount);
 * ```
 */
MovieSchema.plugin(mongooseLeanVirtuals);