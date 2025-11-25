/**
 * @file SeatMap.model.ts
 * @description
 * Defines the Mongoose model for {@link ISeatMap}, representing
 * a mapping of seats to showings with pricing and status.
 *
 * The model uses the {@link SeatMapSchema} schema definition
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
import type ISeatMap from "./SeatMap.interface.js";
import {SeatMapSchema} from "./SeatMap.schema.js";

/**
 * Mongoose model for seat mappings (`ISeatMap`).
 *
 * Provides methods such as `create`, `find`, `findById`, `update`, and `delete`
 * for managing seat assignments within showings.
 */
const SeatMap: Model<ISeatMap> = model<ISeatMap>("SeatMap", SeatMapSchema);

export default SeatMap;
