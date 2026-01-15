/**
 * @file Screen.middleware.ts
 *
 * @summary
 * Mongoose middleware for the Screen model.
 *
 * @description
 * Responsibilities include:
 * - Automatic slug generation
 * - Conditional population of virtual fields on lean queries
 * - Cascading cleanup of dependent entities on deletion
 */

import { ScreenSchema } from "./Screen.schema.js";
import type { HydratedDocument, Query } from "mongoose";
import type { ScreenSchemaFields } from "./Screen.types.js";

import Theatre from "../../theatre/model/Theatre.model.js";
import Seat from "../../seat/model/Seat.model.js";
import Showing from "../../showing/model/Showing.model.js";
import generateSlug from "../../../shared/utility/generateSlug.js";

/**
 * Document-level validation hook.
 *
 * @description
 * Regenerates the screen slug whenever the screen name changes.
 */
ScreenSchema.pre(
    "validate",
    { document: true, query: false },
    function (this: HydratedDocument<ScreenSchemaFields>, next: () => void): void {
        if (this.isModified("name")) {
            this.slug = generateSlug(this.name);
        }

        next();
    },
);

/**
 * Query middleware for auto-populating screen virtuals.
 *
 * @description
 * Automatically populates computed virtual fields only when:
 * - `lean()` is enabled
 * - `lean({ virtuals: true })` is explicitly requested
 *
 * Prevents unnecessary population overhead for standard queries.
 */
ScreenSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    { document: false, query: true },
    function (this: Query<any, ScreenSchemaFields>, next: () => void) {
        const currentDate = new Date();

        const hasVirtuals =
            typeof this._mongooseOptions.lean === "object" &&
            this._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            this.populate([
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
 * Cascades deletion to all dependent entities when a single
 * screen document is deleted.
 */
ScreenSchema.post(
    "deleteOne",
    { document: true, query: false },
    async function (this: HydratedDocument<ScreenSchemaFields>) {
        await Promise.all([
            Theatre.updateMany(
                { screens: this._id },
                { $pull: { screens: this._id } },
            ),
            Seat.deleteMany({ screen: this._id }),
            Showing.deleteMany({ screen: this._id }),
        ]);
    },
);

/**
 * Query-level delete hook.
 *
 * @description
 * Ensures referential integrity when screens are deleted
 * via query-based operations.
 */
ScreenSchema.post(
    ["deleteOne", "deleteMany"],
    { document: false, query: true },
    async function (this: Query<any, ScreenSchemaFields>) {
        const { _id } = this.getFilter();
        if (!_id) return;

        await Promise.all([
            Theatre.updateMany(
                { screens: _id },
                { $pull: { screens: _id } },
            ),
            Seat.deleteMany({ screen: _id }),
            Showing.deleteMany({ screen: _id }),
        ]);
    },
);
