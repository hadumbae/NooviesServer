/**
 * @file Theatre.middleware.ts
 *
 * @summary
 * Mongoose middleware for the Theatre model.
 *
 * @description
 * Handles:
 * - Automatic slug generation
 * - Conditional virtual population for lean queries
 * - Cascading deletion of all dependent domain entities
 */

import { TheatreSchema } from "./Theatre.schema.js";
import type { HydratedDocument, Query } from "mongoose";
import Screen from "../../screen/model/Screen.model.js";
import Seat from "../../seat/model/Seat.model.js";
import Showing from "../../showing/model/Showing.model.js";
import type { TheatreSchemaFields } from "./Theatre.types.js";
import generateSlug from "../../../shared/utility/generateSlug.js";

/**
 * Document-level validation hook.
 *
 * @description
 * Automatically regenerates the theatre slug when the name changes.
 */
TheatreSchema.pre(
    "validate",
    { document: true, query: false },
    function (this: HydratedDocument<TheatreSchemaFields>, next: () => void): void {
        if (this.isModified("name")) {
            this.slug = generateSlug(this.name);
        }

        next();
    },
);

/**
 * Query middleware for conditional virtual population.
 *
 * @description
 * Populates aggregate virtual fields only when:
 * - `lean()` is enabled
 * - `lean({ virtuals: true })` is explicitly requested
 */
TheatreSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    { query: true, document: false },
    function (this: Query<any, TheatreSchemaFields>, next: () => void): void {
        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            const currentDate = new Date();

            this.populate([
                { path: "screenCount" },
                { path: "seatCount" },
                {
                    path: "futureShowingCount",
                    match: { startTime: { $gte: currentDate } },
                },
            ]);
        }

        next();
    },
);

/**
 * Document-level delete hook.
 *
 * @description
 * Cascades deletion to all dependent entities when a theatre
 * document is deleted.
 */
TheatreSchema.post(
    "deleteOne",
    { query: false, document: true },
    async function (this: TheatreSchemaFields) {
        await Promise.all([
            Screen.deleteMany({ theatre: this._id }),
            Seat.deleteMany({ theatre: this._id }),
            Showing.deleteMany({ theatre: this._id }),
        ]);
    },
);

/**
 * Query-level delete hook.
 *
 * @description
 * Mirrors document deletion cleanup for query-based delete operations.
 * Safely exits when no `_id` filter is present.
 */
TheatreSchema.post(
    ["deleteOne", "deleteMany"],
    { query: true, document: false },
    async function (this: Query<any, TheatreSchemaFields>) {
        const { _id } = this.getFilter();
        if (!_id) return;

        await Promise.all([
            Screen.deleteMany({ theatre: _id }),
            Seat.deleteMany({ theatre: _id }),
            Showing.deleteMany({ theatre: _id }),
        ]);
    },
);
