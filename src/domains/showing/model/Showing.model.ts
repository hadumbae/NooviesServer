import { Model, model } from "mongoose";
import { ShowingSchema } from "./Showing.schema.js";
import ShowingServiceProvider from "../provider/ShowingServiceProvider.js";

/**
 * @file Showing.model.ts
 * @summary Mongoose model definition for `Showing`.
 *
 * @description
 * Represents an individual movie showing within a theatre, including
 * scheduling, pricing, language, and related metadata.
 *
 * This model composes multiple concerns:
 * - **Schema** — structural definition and validation (`Showing.schema.js`)
 * - **Virtuals** — derived and aggregated fields (`Showing.virtuals.js`)
 * - **Indexes** — query and performance optimization (`Showing.indexes.js`)
 * - **Lifecycle Hooks** — side effects and cascading behavior (registered via `ShowingServiceProvider`)
 *
 * Together, these components ensure data integrity, relational consistency,
 * and predictable lifecycle behavior.
 */

import "./Showing.virtuals.js";
import "./Showing.indexes.js";
import type {ShowingSchemaFields} from "./Showing.types.js";

/**
 * Registers all Showing-related middleware and lifecycle hooks.
 *
 * This call is intentionally colocated with the model definition to ensure
 * hooks are registered exactly once during model initialization.
 */
ShowingServiceProvider.registerMiddleware();

/**
 * @summary Mongoose model for `Showing` documents.
 *
 * @type {Model<ShowingSchemaFields>}
 *
 * @see ShowingSchemaFields - TypeScript interface for Showing documents.
 * @see ShowingSchema - Underlying schema definition.
 */
const Showing: Model<ShowingSchemaFields> = model<ShowingSchemaFields>("Showing", ShowingSchema);

export default Showing;
