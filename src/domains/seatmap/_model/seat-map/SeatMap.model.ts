/**
 * @fileoverview Defines the Mongoose model for seat map documents.
 */

import {model, Model} from "mongoose";
import {SeatMapSchema} from "@/domains/seatmap/_model/seat-map/SeatMap.schema.js";
import type {SeatMapSchemaFields} from "@/domains/seatmap/_model/seat-map/SeatMap.types.js";

import "src/domains/seatmap/_model/seat-map/SeatMap.virtuals.js";
import "src/domains/seatmap/_model/seat-map/SeatMap.hooks.js";

/** Mongoose model for interacting with the SeatMap collection. */
export const SeatMap: Model<SeatMapSchemaFields> = model<SeatMapSchemaFields>("SeatMap", SeatMapSchema);
