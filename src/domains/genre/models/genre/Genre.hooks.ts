/**
 * @fileoverview Mongoose middleware for the Genre model.
 * Handles automatic slug generation and referential integrity for movies.
 */

import {GenreSchema} from "./Genre.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import MovieModel from "../../../movie/model/Movie.model.js";
import type {GenreSchemaFields} from "./Genre.types.js";
import generateSlug from "../../../../shared/utility/generateSlug.js";

/**
 * Synchronizes the URL slug whenever the genre name is modified.
 */
GenreSchema.pre(
    "validate",
    {document: true},
    function (this: HydratedDocument<GenreSchemaFields>, next) {
        if (this.isModified("name")) {
            this.slug = generateSlug(this.name);
        }

        next();
    },
);

/**
 * Removes genre references from associated movies when a document is deleted.
 */
GenreSchema.pre(
    "deleteOne",
    {document: true, query: false},
    async function (this: HydratedDocument<GenreSchemaFields>) {
        await MovieModel.updateMany({$pull: {genres: this._id}}).exec();
    }
);

/**
 * Cascade deletes associated movies when genres are removed via query.
 */
GenreSchema.pre(
    ["deleteOne", "deleteMany"],
    {document: false, query: true},
    async function (this: Query<any, GenreSchemaFields>) {
        const {_id} = this.getFilter();
        if (_id) await MovieModel.deleteMany({genre: _id}).exec();
    }
);