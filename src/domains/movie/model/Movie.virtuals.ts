import {MovieSchema} from "./Movie.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * Virtual property `cast` for the Movie schema.
 *
 * @remarks
 * Populates the cast members (actors) associated with this movie.
 * Uses the `MovieCredit` collection where `roleType` is `"CAST"`.
 * This virtual returns an array of all matching credits.
 */
MovieSchema.virtual("cast", {
    ref: "MovieCredit",
    localField: "_id",
    foreignField: "movie",
    justOne: false,
    match: { roleType: "CAST" },
});

/**
 * Virtual property `crew` for the Movie schema.
 *
 * @remarks
 * Populates the crew members (directors, producers, etc.) associated with this movie.
 * Uses the `MovieCredit` collection where `roleType` is `"CREW"`.
 * This virtual returns an array of all matching credits.
 */
MovieSchema.virtual("crew", {
    ref: "MovieCredit",
    localField: "_id",
    foreignField: "movie",
    justOne: false,
    match: { roleType: "CREW" },
});

/**
 * Mongoose plugin to enable lean queries to populate virtuals.
 *
 * @remarks
 * Applying `mongoose-lean-virtuals` ensures that `lean()` queries
 * include virtual fields like `cast` and `crew`.
 */
MovieSchema.plugin(mongooseLeanVirtuals);