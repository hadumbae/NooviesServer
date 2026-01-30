/**
 * @file ReservedShowingSnapshot.hooks.ts
 *
 * Mongoose validation hooks for reserved showing snapshots.
 *
 * Enforces invariants between `reservationType` and `selectedSeats`
 * to ensure consistency for general admission vs. reserved seating
 * showings at persistence time.
 */

import {ReservedShowingSnapshotSchema} from "./ReservedShowingSnapshot.schema.js";
import type {HydratedDocument} from "mongoose";
import type {ReservedShowingSnapshotSchemaFields} from "./ReservedShowingSnapshot.types.js";

/**
 * Pre-validation hook enforcing seat selection rules.
 *
 * @remarks
 * - `RESERVED_SEATS` requires a non-empty `selectedSeats` array
 * - `GENERAL_ADMISSION` must not include `selectedSeats`
 *
 * Violations invalidate the document before persistence.
 */
ReservedShowingSnapshotSchema.pre(
    "validate",
    {document: true},
    function (this: HydratedDocument<ReservedShowingSnapshotSchemaFields>, next: () => void) {
        if (this.reservationType === "RESERVED_SEATS") {
            if (!Array.isArray(this.selectedSeats)) {
                this.invalidate("selectedSeats", "Required for reserved seating.");
            } else if (this.selectedSeats.length === 0) {
                this.invalidate("selectedSeats", "Must be a non-empty array.");
            }
        }

        if (this.reservationType === "GENERAL_ADMISSION" && Array.isArray(this.selectedSeats)) {
            this.invalidate("selectedSeats", "Must not be present for general admission.");
        }

        next();
    }
);
