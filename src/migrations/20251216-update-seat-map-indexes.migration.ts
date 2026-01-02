/**
 * @file 20251216-update-seat-map-indexes.migration.ts
 * @summary Initializes MongoDB indexes for the SeatMap collection.
 *
 * @description
 * Establishes a database connection, ensures all declared SeatMap indexes
 * are created, and then gracefully disconnects from MongoDB.
 *
 * This script is intended to be run as a one-off or during deployment
 * to guarantee index consistency.
 */

import mongoose from "mongoose";
import connect from "@config/database.js";
import SeatMap from "../domains/seatmap/model/SeatMap.model.js";

connect()
    .then(async () => await SeatMap.createIndexes())
    .catch((err) => console.error(err))
    .finally(async () => await mongoose.disconnect());
