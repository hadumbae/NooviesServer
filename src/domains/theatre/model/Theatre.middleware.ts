import {TheatreSchema} from "./Theatre.schema.js";
import type {Query} from "mongoose";
import Screen from "../../screen/model/Screen.model.js";
import Seat from "../../seat/model/Seat.model.js";
import Showing from "../../showing/model/Showing.model.js";
import type {TheatreSchemaFields} from "./Theatre.types.js";

/**
 * @file Theatre.middleware.ts
 *
 * Mongoose middleware for the Theatre schema.
 *
 * Responsibilities:
 * - Conditional population of virtual fields on lean queries
 * - Cascading cleanup of related domain entities on deletion
 */

// --- Find middleware ---

/**
 * Pre-find query hook.
 *
 * Automatically populates virtual count fields only when:
 * - `lean()` is enabled
 * - `lean({ virtuals: true })` is explicitly requested
 *
 * Prevents unnecessary population work for non-lean queries.
 */
TheatreSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    {query: true, document: false},
    function FindQueryPre(this: Query<any, TheatreSchemaFields>, next: () => void): void {
        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            const currentDate = new Date();

            this.populate([
                {path: "screenCount"},
                {path: "seatCount"},
                {
                    path: "futureShowingCount",
                    match: {startTime: {$gte: currentDate}},
                },
            ]);
        }

        next();
    },
);

// --- Delete middleware ---

/**
 * Post-delete document hook.
 *
 * Performs cascading deletion of all entities owned by the theatre:
 * - Screens
 * - Seats
 * - Showings
 *
 * Triggered when deleting via a document instance.
 */
TheatreSchema.post(
    "deleteOne",
    {query: false, document: true},
    async function DeleteDocumentPost(this: TheatreSchemaFields) {
        await Promise.all([
            Screen.deleteMany({theatre: this._id}),
            Seat.deleteMany({theatre: this._id}),
            Showing.deleteMany({theatre: this._id}),
        ]);
    },
);

/**
 * Post-delete query hook.
 *
 * Mirrors document deletion cleanup when deleting via query methods
 * such as `deleteOne()` or `deleteMany()`.
 *
 * Safely exits if no `_id` filter is present.
 */
TheatreSchema.post(
    ["deleteOne", "deleteMany"],
    {query: true, document: false},
    async function DeleteQueryPost(this: Query<any, TheatreSchemaFields>) {
        const {_id} = this.getFilter();
        if (!_id) return;

        await Promise.all([
            Screen.deleteMany({theatre: _id}),
            Seat.deleteMany({theatre: _id}),
            Showing.deleteMany({theatre: _id}),
        ]);
    },
);
