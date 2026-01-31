import { SeatMapSchema } from "./SeatMap.schema.js";
import type { HydratedDocument } from "mongoose";
import type { SeatMapSchemaFields } from "./SeatMap.types.js";

/**
 * Validation hook enforcing reservation linkage
 * for reserved or sold seats.
 *
 * @remarks
 * Seats marked as `RESERVED` or `SOLD` must be associated
 * with a reservation. This rule is enforced at the schema
 * level to prevent invalid persistence.
 */
SeatMapSchema.pre(
    "validate",
    function (this: HydratedDocument<SeatMapSchemaFields>, next: () => void) {
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
    }
);
