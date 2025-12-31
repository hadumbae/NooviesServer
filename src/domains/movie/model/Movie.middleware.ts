import {MovieSchema} from "./Movie.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import Showing from "../../showing/model/Showing.model.js";
import type {MovieSchemaFields} from "./Movie.types.js";
import generateSlug from "../../../shared/utility/generateSlug.js";
import getUpdateData from "../../../shared/utility/mongoose/getUpdateData.js";
import MovieCredit from "../../movieCredit/models/MovieCredit.model.js";

/**
 * Pre-validation middleware for Movie documents.
 *
 * Automatically regenerates the movie slug when the title is modified
 * during document creation or validation.
 *
 * @param this - The hydrated Movie document being validated
 * @param next - Callback to continue validation
 */
MovieSchema.pre(
    "validate",
    {document: true, query: false},
    function (this: HydratedDocument<MovieSchemaFields>, next: () => void): void {
        if (this.isModified("title")) {
            this.slug = generateSlug(this.title);
        }

        next();
    }
);

/**
 * Pre-update middleware for `findOneAndUpdate`.
 *
 * Ensures the slug is regenerated when the movie title is updated
 * via a query-based update operation.
 *
 * @param this - The update query being executed
 * @param next - Callback to continue query execution
 */
MovieSchema.pre(
    "findOneAndUpdate",
    {query: true},
    function (this: Query<any, MovieSchemaFields>, next: () => void): void {
        const update = getUpdateData(this.getUpdate());

        if (update.title) {
            update.slug = generateSlug(update.title);
        }

        next();
    }
);

/**
 * Pre-query middleware for movie retrieval operations.
 *
 * Automatically populates the `showingCount` virtual when queries are executed
 * with `lean({ virtuals: true })`, ensuring derived data is included in lean
 * query results.
 *
 * @param this - The query being executed (`find`, `findOne`, or `findOneAndUpdate`)
 * @param next - Callback to continue query execution
 */
MovieSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    {query: true},
    async function (this: Query<unknown, MovieSchemaFields>, next: () => void): Promise<void> {
        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            this.populate([{path: "showingCount"}]);
        }

        next();
    }
);

/**
 * Pre-deletion middleware for Movie documents.
 *
 * Triggered when deleting a movie via `document.deleteOne()`.
 * Cleans up all showings associated with the deleted movie.
 *
 * @param this - The hydrated Movie document being deleted
 */
MovieSchema.pre(
    "deleteOne",
    {document: true, query: false},
    async function (this: HydratedDocument<MovieSchemaFields>): Promise<void> {
        const {_id} = this;
        (this as any)._wasUpdated = true;

        await Promise.all([
            Showing.deleteMany({movie: _id}),
            MovieCredit.deleteMany({movie: _id}),
        ]);
    }
);

/**
 * Pre-deletion middleware for Movie query operations.
 *
 * Triggered when deleting movies via `Movie.deleteOne()` or `Movie.deleteMany()`.
 * Ensures referential integrity by:
 * - Removing the movie from users’ favourites
 * - Deleting all associated showings
 *
 * @param this - The deletion query being executed
 */
MovieSchema.pre(
    ["deleteOne", "deleteMany"],
    {document: false, query: true},
    async function (this: Query<unknown, MovieSchemaFields>): Promise<void> {
        const {_id} = this.getFilter();
        if (!_id) return;

        await Promise.all([
            Showing.deleteMany({movie: _id}),
            MovieCredit.deleteMany({movie: _id}),
        ]);
    }
);
