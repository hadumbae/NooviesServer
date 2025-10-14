import { Model, model } from "mongoose";
import type IShowing from "./IShowing.js";
import { ShowingSchema } from "./Showing.schema.js";

import "./Showing.middleware.js";
import "./Showing.virtuals.js";
import "./Showing.indexes.js";

/**
 * @fileoverview
 * Defines and exports the Mongoose `Showing` model.
 *
 * @description
 * The `Showing` model represents individual movie showings within theatres,
 * including scheduling, pricing, language, and related metadata.
 *
 * This model integrates the following:
 * - **Schema Definition** (`Showing.schema.js`)
 * - **Middleware Hooks** (`Showing.middleware.js`)
 * - **Virtual Fields** (`Showing.virtuals.js`)
 * - **Indexes** (`Showing.indexes.js`)
 *
 * Together, these modules ensure validation, relational consistency,
 * and performance optimizations for common queries.
 */

/**
 * The Mongoose model for `Showing` documents.
 *
 * @type {Model<IShowing>}
 * @see IShowing for the TypeScript interface definition.
 * @see ShowingSchema for the underlying schema structure.
 */
const Showing: Model<IShowing> = model<IShowing>("Showing", ShowingSchema);

export default Showing;
