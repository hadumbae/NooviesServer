import {MovieSchema} from "./Movie.schema.js";
import type {HydratedDocument, Query} from "mongoose";
import type IMovie from "./Movie.interface.js";
import Showing from "../../showing/model/Showing.js";
import User from "@models/User.js";

/**
 * Pre 'deleteOne' middleware for Movie documents.
 *
 * @remarks
 * This hook is triggered when a single movie document is deleted via `document.deleteOne()`.
 * It performs cleanup by removing all associated Showings.
 *
 * @param this - The current hydrated movie document being deleted.
 */
MovieSchema.pre(
    "deleteOne",
    { document: true, query: false },
    async function (this: HydratedDocument<IMovie>) {
        const { _id } = this;
        (this as any)._wasUpdated = true;

        // Remove all showings associated with this movie
        await Showing.deleteMany({ movie: _id });
    }
);

/**
 * Pre 'deleteOne' and 'deleteMany' middleware for Movie queries.
 *
 * @remarks
 * This hook is triggered when a movie is deleted via a query
 * (`Movie.deleteOne(filter)` or `Movie.deleteMany(filter)`).
 * It ensures data integrity by:
 *   1. Removing the movie from users' favourites.
 *   2. Deleting all associated showings.
 *
 * @param this - The query object used to perform the deletion.
 */
MovieSchema.pre(
    ["deleteOne", "deleteMany"],
    { document: false, query: true },
    async function (this: Query<any, IMovie>) {
        const { _id } = this.getFilter();
        if (!_id) return;

        // Remove movie from user favourites and delete related showings
        await Promise.all([
            User.updateMany({ favourites: _id }, { $pull: { favourites: _id } }),
            Showing.deleteMany({ movie: _id }),
        ]);
    }
);