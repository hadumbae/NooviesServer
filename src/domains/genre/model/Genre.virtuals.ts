import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import GenreSchema from "./Genre.schema.js";

/**
 * Adds a virtual property `movieCount` to the Genre schema.
 *
 * This virtual counts the number of Movie documents where the Genre's `_id`
 * exists in the Movie's `genres` array field.
 *
 * @virtual movieCount
 * @type {number}
 * @example
 * // Example Movie:
 * // { title: "Inception", genres: [ObjectId("genreId1"), ObjectId("genreId2")] }
 *
 * // When populating `movieCount`:
 * // Genre.find().populate('movieCount')
 * // -> Each Genre will have movieCount equal to number of Movies containing its _id.
 */
GenreSchema.virtual("movieCount", {
    ref: "Movie",
    localField: "_id",
    foreignField: "genres",
    count: true,
});

/**
 * Applies the `mongooseLeanVirtuals` plugin to the Genre schema.
 *
 * This plugin ensures that virtual fields (like `movieCount`) are
 * included when using `.lean()` queries, which normally strip out
 * virtuals by default.
 *
 * @plugin mongooseLeanVirtuals
 * @see https://github.com/vkarpov15/mongoose-lean-virtuals
 */
GenreSchema.plugin(mongooseLeanVirtuals);