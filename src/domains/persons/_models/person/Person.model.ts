/**
 * @fileoverview Compiles and exports the Person Mongoose model.
 * Integrates schema, middleware, and TypeScript fields for the Person domain.
 */

import {model, type Model} from "mongoose";
import {PersonSchema} from "@/domains/persons/_models/person/Person.schema.js";
import "src/domains/persons/_models/person/Person.middleware.js";
import "src/domains/persons/_models/person/Person.indexes.js";
import type {PersonSchemaFields} from "@/domains/persons/_models/person/Person.types";

/**
 * Mongoose model for the Person collection.
 * Provides CRUD operations and identity tracking for actor/director documents.
 */
export const Person: Model<PersonSchemaFields> = model<PersonSchemaFields>("Person", PersonSchema);