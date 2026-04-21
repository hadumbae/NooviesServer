/**
 * @file Mongoose middleware for the Showing model.
 * @filename Showing.hooks.ts
 */

import {ShowingSchema} from "./Showing.schema.js";
import {type HydratedDocument} from "mongoose";
import type {ShowingSchemaFields} from "./Showing.types.js";
import {fetchRequiredModelDocument} from "@shared/utility/fetch/fetchRequiredModelDocument";
import {Theatre} from "@domains/theatre/model/theatre";

/**
 * Syncs `location` from {@link Theatre} before validation.
 * Ensures the document contains a snapshot of the theatre's physical location.
 * @throws {HttpResponseError} If the referenced theatre is missing.
 */
ShowingSchema.pre("validate", {document: true}, async function (this: HydratedDocument<ShowingSchemaFields>) {
    const theatre = await fetchRequiredModelDocument({
        model: Theatre,
        _id: this.theatre,
        notFoundMessage: "Theatre Not Found.",
    });

    this.location = theatre.location;
});

/**
 * Automatically filters out records where {@link ModelSoftDelete} fields are active.
 * * @remarks
 * This filter can be bypassed by passing `{ getSoftDeleted: true }` in the query options.
 * Useful for administrative views or restoration logic.
 */
ShowingSchema.pre("find", {query: true}, async function (next: () => void) {
    if (this.getOptions().getSoftDeleted) {
        return next();
    }

    this.where({isDeleted: false, deletedAt: null});
    return next();
});