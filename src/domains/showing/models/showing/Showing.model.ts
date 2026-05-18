/**
 * @fileoverview Mongoose model definition for the Showing entity.
 */

import {model} from "mongoose";
import {type ShowingModel, ShowingSchema} from "./Showing.schema.js";


import type {ShowingSchemaFields} from "./Showing.types.js";
import "./Showing.virtuals.js";
import "./Showing.indexes.js";
import "./Showing.hooks.js";
import "./Showing.methods.js";

/** Mongoose model for Showing documents. */
const Showing: ShowingModel = model<ShowingSchemaFields, ShowingModel>("Showing", ShowingSchema);

export default Showing;
