/**
 * @file Person.schema.middleware.ts
 *
 * Mongoose middleware for the Person schema.
 * Handles slug generation, virtual population,
 * and cascading deletes.
 */

import {PersonSchema} from "./Person.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import type {PersonSchemaFields} from "../interfaces/PersonSchemaFields.js";
import MovieCredit from "../../movieCredit/models/MovieCredit.model.js";
import generateSlug from "../../../shared/utility/generateSlug.js";

/**
 * Pre-validation middleware.
 *
 * Regenerates the slug when the person's name changes.
 */
PersonSchema.pre(
    "validate",
    {document: true},
    async function (
        this: HydratedDocument<PersonSchemaFields>,
        next: () => void,
    ): Promise<void> {
        if (this.isModified("name")) {
            this.slug = generateSlug(this.name);
        }

        next();
    },
);

/**
 * Pre-query middleware for lean queries with virtuals.
 *
 * Automatically populates:
 * - `movieCount`
 * - `creditCount`
 *
 * @remarks
 * Applies to `find`, `findOne`, and `findOneAndUpdate`
 * when `{ lean: { virtuals: true } }` is enabled.
 */
PersonSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    {query: true},
    async function (this: Query<any, PersonSchemaFields>) {
        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            this.populate([
                {path: "movieCount"},
                {path: "creditCount"},
            ]);
        }
    },
);

/**
 * Pre-document deletion middleware.
 *
 * Cascades deletion to all MovieCredit documents
 * associated with the person.
 */
PersonSchema.pre(
    "deleteOne",
    {query: false, document: true},
    async function (this: HydratedDocument<PersonSchemaFields>) {
        const {_id} = this;
        if (!_id) return;

        await MovieCredit.deleteMany({person: _id});
    },
);

/**
 * Pre-query deletion middleware.
 *
 * Cascades deletion to MovieCredit documents
 * matching the deletion filter.
 *
 * @remarks
 * Applies to `deleteOne` and `deleteMany` queries.
 */
PersonSchema.pre(
    ["deleteOne", "deleteMany"],
    {query: true, document: false},
    async function (this: Query<any, PersonSchemaFields>) {
        const {_id} = this.getFilter();
        if (!_id) return;

        await MovieCredit.deleteMany({movie: _id});
    },
);
