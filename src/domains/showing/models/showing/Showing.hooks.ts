/**
 * @fileoverview Mongoose middleware for the Showing model lifecycle.
 * Handles data synchronization, soft-delete filtering, and conditional population.
 */

import {ShowingSchema} from "./Showing.schema.js";
import {type HydratedDocument, type Query} from "mongoose";
import type {ShowingSchemaFields} from "./Showing.types.js";
import {fetchRequiredModelDocument} from "@shared/utility/fetch/fetchRequiredModelDocument";
import {Theatre} from "@domains/theatre/model/theatre";
import type {ScreenSchemaFields} from "@domains/screen/models/screen";
import {ShowingVirtualPopulationPaths} from "@domains/showing/_feat/query-population";

/**
 * Pre-validation hook to synchronize theatre location.
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
 * Global query middleware for soft-delete enforcement.
 */
ShowingSchema.pre("find", {query: true}, async function (next: () => void) {
    if (this.getOptions().getSoftDeleted) {
        return next();
    }

    this.where({isDeleted: false, deletedAt: null});
    return next();
});

/**
 * Conditional virtual population middleware.
 */
ShowingSchema.pre(
    ["find", "findOne", "findOneAndUpdate"],
    {document: false, query: true},
    function (this: Query<any, ScreenSchemaFields>, next: () => void) {
        const leanOption = this._mongooseOptions.lean;
        const hasVirtuals = (typeof leanOption === "object" && leanOption.virtuals === true) || leanOption === true;

        if (hasVirtuals) this.populate(ShowingVirtualPopulationPaths);

        next();
    },
);