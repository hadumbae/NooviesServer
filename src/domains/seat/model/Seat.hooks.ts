/**
 * @file Seat.middleware.ts
 *
 * @summary
 * Mongoose middleware for the Seat schema.
 *
 * @description
 * Handles automatic slug generation when seat layout data changes.
 * Ensures slug consistency for both document saves and query-based updates.
 */

import type {HydratedDocument} from "mongoose";
import generateSlug from "../../../shared/utility/generateSlug.js";
import {SeatSchema} from "./Seat.schema.js";
import type {SeatSchemaFields} from "./Seat.types.js";

/**
 * Document-level validation hook.
 *
 * @description
 * Automatically regenerates the seat slug when the `layoutType` changes.
 * Runs only on document validation (not query updates).
 */
SeatSchema.pre(
    "validate",
    {document: true, query: false},
    function (this: HydratedDocument<SeatSchemaFields>, next: () => void): void {
        if (this.isModified("layoutType")) {
            this.slug = generateSlug(this.layoutType);
        }

        next();
    },
);