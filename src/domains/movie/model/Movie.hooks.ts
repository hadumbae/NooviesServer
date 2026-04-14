/**
 * @fileoverview Mongoose middleware for the Movie model.
 * Handles slug generation, genre count synchronization, and cascade deletions.
 */

import {MovieSchema} from "./Movie.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import Showing from "@domains/showing/models/showing/Showing.model.js";
import type {MovieSchemaFields} from "./Movie.types.js";
import generateSlug from "@shared/utility/generateSlug.js";
import MovieCredit from "@domains/movieCredit/models/MovieCredit.model.js";
import MovieModel from "./Movie.model.js";
import {Genre} from "@domains/genre/models/genre";

/**
 * Synchronizes the URL slug whenever the title is modified.
 */
MovieSchema.pre(
    "validate",
    {document: true},
    function (this: HydratedDocument<MovieSchemaFields>, next) {
        if (this.isModified("title")) {
            this.slug = generateSlug(this.title);
        }
        next();
    }
);

/**
 * Captures previous genre state to facilitate movie count synchronization.
 */
MovieSchema.pre(
    "save",
    {document: true},
    async function (this: HydratedDocument<MovieSchemaFields>) {
        if (!this.isNew || this.isModified("genres")) {
            const oldDoc = await MovieModel.findById(this._id).select("genres");
            (this as any)._genresToRemove = oldDoc?.genres ?? [];
        }
    }
);

/**
 * Atomic update of Genre movie counts after saving a movie.
 */
MovieSchema.post(
    "save",
    {document: true},
    async function (this: HydratedDocument<MovieSchemaFields>) {
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
 * Cascade deletes associated data (Showings, Credits) when a movie document is deleted.
 */
MovieSchema.pre(
    "deleteOne",
    {document: true},
    async function (this: HydratedDocument<MovieSchemaFields>) {
        await Promise.all([
            Showing.deleteMany({movie: this._id}),
            MovieCredit.deleteMany({movie: this._id}),
        ]);
    }
);

/**
 * Cascade deletes associated data for query-based bulk deletions.
 */
MovieSchema.pre(
    ["deleteOne", "deleteMany"],
    {document: false, query: true},
    async function (this: Query<any, MovieSchemaFields>) {
        const {_id} = this.getFilter();
        if (_id) {
            await Promise.all([
                Showing.deleteMany({movie: _id}),
                MovieCredit.deleteMany({movie: _id}),
            ]);
        }
    }
);