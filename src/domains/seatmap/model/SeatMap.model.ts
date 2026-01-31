/**
 * @file SeatMap.model.ts
 * @description
 * Defines the Mongoose model for {@link SeatMapSchemaFields}, representing
 * a mapping of seats to showings with pricing and status.
 *
 * The model uses the {@link SeatMapSchemaFields} schema definition
 * and provides standard Mongoose model methods for CRUD operations.
 *
 * @example
 * ```ts
 * import SeatMap from "@/modules/seat-map/model/SeatMap.model.ts";
 *
 * // Create a new seat map entry
 * const newSeatMap = await SeatMap.create({
 *   price: 100,
 *   showing: showingId,
 *   seat: seatId,
 *   status: "AVAILABLE"
 * });
 * ```
 */

import {Model, model} from "mongoose";
import {SeatMapSchema} from "./SeatMap.schema.js";
import type {SeatMapSchemaFields} from "./SeatMap.types.js";

import "./SeatMap.virtuals.js";
import "./SeatMap.hooks.js";

/**
 * Mongoose model for seat mappings (`SeatMapSchemaFields`).
 *
 * Provides methods such as `create`, `find`, `findById`, `update`, and `delete`
 * for managing seat assignments within showings.
 */
const SeatMap: Model<SeatMapSchemaFields> = model<SeatMapSchemaFields>("SeatMap", SeatMapSchema);

export default SeatMap;
