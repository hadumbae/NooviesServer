/**
 * @fileoverview Mongoose middleware for the Seat schema to manage slug lifecycle.
 */

import type { HydratedDocument } from "mongoose";
import generateSlug from "../../../shared/utility/generateSlug.js";
import { SeatSchema } from "./Seat.schema.js";
import type {SeatSchemaFields} from "@domains/seat/model/Seat.types";

/**
 * Pre-validation hook for Seat documents.
 */
SeatSchema.pre(
    "validate",
    { document: true, query: false },
    function (this: HydratedDocument<SeatSchemaFields>, next: () => void): void {
        if (this.isModified("layoutType")) {
            this.slug = generateSlug(this.layoutType);
        }

        next();
    },
);