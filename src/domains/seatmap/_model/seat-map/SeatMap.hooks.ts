/**
 * @fileoverview Mongoose middleware hooks for the SeatMap schema to enforce data integrity.
 */

import {SeatMapSchema} from "@/domains/seatmap/_model/seat-map/SeatMap.schema.js";
import type {HydratedDocument} from "mongoose";
import type {SeatMapSchemaFields} from "@/domains/seatmap/_model/seat-map/SeatMap.types.js";

SeatMapSchema.pre("validate", function (this: HydratedDocument<SeatMapSchemaFields>, next: () => void) {
    if (
        (this.status === "RESERVED" || this.status === "SOLD") &&
        !this.reservation
    ) {
        this.invalidate(
            "reservation",
            "Reservation is required for seats that are reserved or sold."
        );
    }

    next();
});
