/**
 * @file Compiled Mongoose model for the Reservation entity.
 * @filename Reservation.model.ts
 */

import {model} from "mongoose";
import ReservationSchema, {type ReservationModel} from "./Reservation.schema.js";
import type {ReservationSchemaFields} from "./Reservation.types.js";

/**
 * Import side-effects to ensure indexes, middleware hooks, and instance methods
 * are attached to the schema before the model is compiled.
 */
import "./Reservation.indexes.js";
import "./Reservation.hooks.js";
import "./Reservation.methods.js";

/**
 * The definitive Mongoose model for interacting with the `Reservation` collection.
 */
const Reservation: ReservationModel = model<ReservationSchemaFields, ReservationModel>(
    "Reservation",
    ReservationSchema,
);

export default Reservation;