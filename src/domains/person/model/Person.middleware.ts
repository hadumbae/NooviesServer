import { PersonSchema } from "./Person.schema.js";
import type { HydratedDocument, Query } from "mongoose";
import type { IPerson } from "../interfaces/IPerson.js";
import MovieCredit from "../../movieCredit/models/MovieCredit.model.js";

/**
 * Pre-query middleware to automatically populate virtuals when using lean queries.
 *
 * @remarks
 * Applies to `find`, `findOne`, and `findOneAndUpdate` queries.
 * Checks if the query has `{ lean: { virtuals: true } }` and populates:
 * - `movieCount`
 * - `creditCount`
 *
 * @param this - The Mongoose Query object.
 * @param next - Callback to continue the middleware chain.
 *
 * @example
 * // Person.find().lean({ virtuals: true }) will automatically populate counts
 */
PersonSchema.pre(["find", "findOne", "findOneAndUpdate"], { query: true }, function (
    this: Query<any, IPerson>, next: () => void
) {
    const hasVirtuals = typeof this._mongooseOptions.lean === "object" && this._mongooseOptions.lean.virtuals === true;

    if (hasVirtuals) {
        console.log("Populating...");

        this.populate([
            { path: "movieCount" },
            { path: "creditCount" },
        ]);
    }

    next();
});

/**
 * Pre-document deletion middleware.
 *
 * @remarks
 * Automatically deletes all `MovieCredit` documents associated with
 * the person being deleted.
 *
 * @param this - The hydrated `IPerson` document being deleted.
 *
 * @example
 * // person.deleteOne() will remove all related MovieCredit documents
 */
PersonSchema.pre("deleteOne", { query: false, document: true }, async function (
    this: HydratedDocument<IPerson>
) {
    const { _id } = this;
    if (!_id) return;

    await MovieCredit.deleteMany({ person: _id });
});

/**
 * Pre-query deletion middleware.
 *
 * @remarks
 * Applies to `deleteOne` and `deleteMany` queries.
 * Automatically deletes all `MovieCredit` documents related to the filtered person or movie.
 *
 * @param this - The Mongoose Query object.
 *
 * @example
 * // Person.deleteMany({ _id: someId }) will remove related MovieCredit documents
 */
PersonSchema.pre(["deleteOne", "deleteMany"], { query: true, document: false }, async function (
    this: Query<any, IPerson>
) {
    const { _id } = this.getFilter();
    if (!_id) return;

    await MovieCredit.deleteMany({ movie: _id });
});
