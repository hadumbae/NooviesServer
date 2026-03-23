/**
 * @file Mongoose middleware hooks for the Genre model.
 * @filename Genre.hooks.ts
 */

import GenreSchema from "./Genre.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import MovieModel from "../../../movie/model/Movie.model.js";
import type {GenreSchemaFields} from "./Genre.types.js";
import generateSlug from "../../../../shared/utility/generateSlug.js";

/**
 * Middleware to synchronize the URL slug with the genre name.
 * @remarks Triggers during validation if the 'name' field has been modified.
 */
GenreSchema.pre(
    "validate",
    {document: true},
    function (this: HydratedDocument<GenreSchemaFields>, next: () => void) {
        if (this.isModified("name")) {
            this.slug = generateSlug(this.name);
        }

        next();
    },
);

/**
 * Cleanup middleware to remove genre references from movies upon document deletion.
 * @remarks Specifically handles the `$pull` operation for the movies' 'genres' array.
 */
GenreSchema.pre(
    "deleteOne",
    {document: true, query: false},
    async function (this: HydratedDocument<GenreSchemaFields>) {
        const {_id} = this;
        await MovieModel.updateMany({$pull: {genres: _id}}).exec();
    }
);

/**
 * Cascade deletion middleware for query-based genre removals.
 * @remarks Deletes all associated movies when a genre is removed via static query methods.
 */
GenreSchema.pre(
    ["deleteOne", "deleteMany"],
    {document: false, query: true},
    async function (this: Query<any, GenreSchemaFields>) {
        const {_id} = this.getFilter();
        if (!_id) return;

        await MovieModel.deleteMany({genre: _id}).exec();
    }
);