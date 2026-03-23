/**
 * @file Mongoose middleware hooks for the Movie model.
 * @filename Movie.hooks.ts
 */

import {MovieSchema} from "./Movie.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import Showing from "../../showing/models/showing/Showing.model.js";
import type {MovieSchemaFields} from "./Movie.types.js";
import generateSlug from "../../../shared/utility/generateSlug.js";
import MovieCredit from "../../movieCredit/models/MovieCredit.model.js";
import MovieModel from "./Movie.model.js";
import Genre from "../../genre/models/genre/Genre.model.js";

/**
 * Middleware to synchronize the URL slug with the movie title.
 * @remarks Triggers during validation when the 'title' field is modified.
 */
MovieSchema.pre(
    "validate",
    {document: true},
    function (this: HydratedDocument<MovieSchemaFields>, next: () => void): void {
        if (this.isModified("title")) {
            this.slug = generateSlug(this.title);
        }

        next();
    }
);

/**
 * Capture previous genre state before saving to handle movie count synchronization.
 * @remarks Identifies genres that need to be decremented by storing them in a temporary `_genresToRemove` property.
 */
MovieSchema.pre(
    "save",
    {document: true},
    async function (this: HydratedDocument<MovieSchemaFields>): Promise<void> {
        if (!this.isNew || this.isModified("genres")) {
            const oldDoc = await MovieModel.findById(this._id).select("genres");
            (this as any)._genresToRemove = oldDoc?.genres ?? [];
        }
    }
);

/**
 * Synchronizes genre movie counts after a movie is saved or updated.
 * @remarks Performs atomical `$inc` operations to keep {@link Genre} movie counts in sync with current associations.
 */
MovieSchema.post(
    "save",
    {document: true},
    async function (this: HydratedDocument<MovieSchemaFields>): Promise<void> {
        if ((this as any)._genresToRemove) {
            await Genre.updateMany(
                {_id: {$in: (this as any)._genresToRemove}},
                {$inc: {movieCount: -1}}
            );
        }

        await Genre.updateMany(
            {_id: {$in: this.genres}},
            {$inc: {movieCount: 1}},
        );
    }
);

/**
 * Document-level cleanup middleware to remove associated data upon movie deletion.
 * @remarks Cascade deletes {@link Showing} and {@link MovieCredit} records linked to the specific document.
 */
MovieSchema.pre(
    "deleteOne",
    {document: true},
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
 * Query-level cleanup middleware for bulk or static movie deletions.
 * @remarks Ensures data integrity by removing associated records when movies are deleted via query filters.
 */
MovieSchema.pre(
    ["deleteOne", "deleteMany"],
    {document: false, query: true}, async function (this: Query<any, MovieSchemaFields>): Promise<void> {
        const {_id} = this.getFilter();
        if (!_id) return;

        await Promise.all([
            Showing.deleteMany({movie: _id}),
            MovieCredit.deleteMany({movie: _id}),
        ]);
    }
);