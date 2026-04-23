/**
 * @fileoverview Mongoose model for the Seat entity.
 */

import { model, Model } from "mongoose";
import { SeatSchema } from "./Seat.schema.js";

import "./Seat.indexes";
import "./Seat.hooks";
import type {SeatSchemaFields} from "@domains/seat/model/Seat.types";

/**
 * Model representing a seat or grid element within a theatre screen.
 */
export const Seat: Model<SeatSchemaFields> = model<SeatSchemaFields>("Seat", SeatSchema);