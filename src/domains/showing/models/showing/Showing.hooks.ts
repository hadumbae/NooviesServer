/**
 * @file Mongoose middleware for the Showing model.
 * @filename Showing.hooks.ts
 */

import {ShowingSchema} from "./Showing.schema.js";
import {type HydratedDocument, Types} from "mongoose";
import type {ShowingSchemaFields} from "./Showing.types.js";
import {fetchRequiredModelDocument} from "../../../../shared/utility/fetch/fetchRequiredModelDocument.js";
import Theatre from "../../../theatre/model/Theatre.model.js";

/**
 * Synchronizes `location` from the associated theatre before validation.
 *
 * Resolves the theatre when referenced by ID, otherwise uses the populated value.
 * Throws if the referenced theatre cannot be found.
 */
ShowingSchema.pre("validate", {document: true}, async function (this: HydratedDocument<ShowingSchemaFields>) {
    if (this.theatre instanceof Types.ObjectId) {
        const theatre = await fetchRequiredModelDocument({
            model: Theatre,
            _id: this.theatre,
            notFoundMessage: "Theatre Not Found.",
        });

        this.location = theatre.location;
    } else {
        this.location = this.theatre.location
    }
});