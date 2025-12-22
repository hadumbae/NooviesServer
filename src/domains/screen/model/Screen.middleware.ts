/**
 * @file Screen.middleware.ts
 *
 * @summary
 * Mongoose middleware for the Screen model.
 *
 * @description
 * Registers query and document middleware to:
 * - Auto-populate virtuals when using lean queries with virtuals enabled
 * - Cascade cleanup of related theatre, seat, and showing data on deletion
 */

import { ScreenSchema } from "./Screen.schema.js";
import type { HydratedDocument, Query } from "mongoose";
import type { ScreenSchemaFields } from "./Screen.types.js";

import Theatre from "../../theatre/model/Theatre.model.js";
import Seat from "../../seat/model/Seat.model.js";
import Showing from "../../showing/model/Showing.model.js";

/**
 * @summary
 * Query middleware for auto-populating screen virtuals.
 *
 * @description
 * When using `.lean({ virtuals: true })`, automatically populates
 * computed virtual fields such as seat count and future showings.
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
 * @summary
 * Document-level cleanup after single screen deletion.
 *
 * @description
 * Removes references to the deleted screen and cascades deletion
 * to dependent seat and showing documents.
 */
ScreenSchema.post(
    "deleteOne",
    { document: true, query: false },
    async function (this: HydratedDocument<ScreenSchemaFields>) {
        (this as any)._wasUpdated = true;

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
 * @summary
 * Query-level cleanup after bulk screen deletion.
 *
 * @description
 * Ensures referential integrity when screens are deleted via
 * query-based operations.
 */
ScreenSchema.post(
    ["deleteOne", "deleteMany"],
    { document: false, query: true },
    async function (this: Query<any, ScreenSchemaFields>) {
        const { _id } = this.getFilter();
        (this as any)._wasUpdated = true;

        await Theatre.updateMany(
            { screens: _id },
            { $pull: { screens: _id } },
        );
        await Seat.deleteMany({ screen: _id });
        await Showing.deleteMany({ screen: _id });
    },
);
