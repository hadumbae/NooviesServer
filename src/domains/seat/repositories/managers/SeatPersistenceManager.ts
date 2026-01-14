import {PersistenceManager} from "../../../../shared/repository/managers/PersistenceManager.js";
import SeatModel from "../../model/Seat.model.js";
import type {ZodIssue} from "zod";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import DuplicateIndexError from "../../../../shared/errors/DuplicateIndexError.js";

export class SeatPersistenceManager extends PersistenceManager {
    constructor() {
        super({modelName: SeatModel.modelName});
    }

    checkDuplicateIndexError(error: unknown) {

        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            const indexName = (error as any).errmsg.match(/index: (\S+)/)?.[1];

            if (indexName === "theatre_1_screen_1_row_1_seatNumber_1") {
                console.log("Same Row And Number");

                const errors: ZodIssue[] = [
                    {path: ["theatre"], code: "custom", message: "Seat in this theatre already exists."},
                    {path: ["screen"], code: "custom", message: "Seat on this screen already exists."},
                    {path: ["row"], code: "custom", message: "Row already has this seat number."},
                    {path: ["seatNumber"], code: "custom", message: "Seat number already taken in this row."},
                ];

                return new ZodParseError({
                    errors,
                    message: "Duplicate seat: row + seat number must be unique.",
                });
            } else if (indexName === "theatre_1_screen_1_x_1_y_1") {
                console.log("Same X And Y");

                const errors: ZodIssue[] = [
                    {path: ["theatre"], code: "custom", message: "Seat in this theatre already exists."},
                    {path: ["screen"], code: "custom", message: "Seat on this screen already exists."},
                    {path: ["x"], code: "custom", message: "X coordinate already used."},
                    {path: ["y"], code: "custom", message: "Y coordinate already used."},
                ];

                return new ZodParseError({
                    errors,
                    message: "Duplicate seat: coordinates (x, y) must be unique.",
                });
            }

            throw new DuplicateIndexError({
                message: `Duplicate Error: ${indexName}`,
                index: indexName,
                model: this.modelName,
            });
        }
    }
}