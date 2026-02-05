/**
 * @file 20260205-update-reservation-indexes.migration.ts
 *
 * One-off migration to synchronize reservation indexes.
 *
 * Ensures MongoDB indexes defined on the `Reservation` schema
 * are created or updated to match the current index definitions.
 *
 * @remarks
 * This migration is intended to be run:
 * - after modifying reservation schema indexes
 * - during controlled deployments or maintenance windows
 *
 * It is safe to re-run, as `syncIndexes()` is idempotent
 * and only applies necessary changes.
 */

import "dotenv/config";
import connect from "@config/database.js";
import mongoose from "mongoose";
import Reservation from "../domains/reservation/model/reservation/Reservation.model.js";

connect()
    .then(async () => {
        await Reservation.syncIndexes();
    })
    .catch((error: unknown) => {
        console.error(error);
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
