import { model, type Model } from "mongoose";
import type { PersonSchemaFields } from "../interfaces/PersonSchemaFields.js";
import { PersonSchema } from "./Person.schema.js";

import "./Person.virtuals.js";
import "./Person.middleware.js";

/**
 * Mongoose model for the `Person` collection.
 *
 * @remarks
 * - Uses {@link PersonSchema} for schema definition.
 * - Automatically includes virtuals and middleware from
 * - Provides full CRUD operations and query helpers for `IPerson` documents.
 *
 * @example
 * ```ts
 * import PersonModel from './models/Person.model.js';
 *
 * // Creating a new person
 * const person = await PersonModel.create({
 *   name: "John Doe",
 *   biography: "An actor and director",
 *   dob: new Date("1980-05-12"),
 *   nationality: "US"
 * });
 *
 * // Finding a person by ID
 * const foundPerson = await PersonModel.findById(person._id).lean({ virtuals: true });
 *
 * // Accessing virtuals
 * console.log(foundPerson.creditCount);
 * console.log(foundPerson.movieCount);
 * ```
 */
const PersonModel: Model<PersonSchemaFields> = model<PersonSchemaFields>("Person", PersonSchema);

export default PersonModel;
