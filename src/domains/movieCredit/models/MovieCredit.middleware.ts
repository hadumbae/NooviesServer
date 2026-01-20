/**
 * @file MovieCredit.slug.middleware.ts
 *
 * Automatically generates a slug for MovieCredit documents
 * based on the associated person’s name.
 */

import {MovieCreditSchema} from "./MovieCredit.schema.js";
import type {HydratedDocument} from "mongoose";
import type {IMovieCredit} from "./MovieCredit.interface.js";
import type {PersonSchemaFields} from "../../person/interfaces/PersonSchemaFields.js";
import generateSlug from "../../../shared/utility/generateSlug.js";

/**
 * Pre-validation middleware.
 *
 * - Runs on document validation
 * - Regenerates `slug` when `person` is modified
 * - Uses populated person name as the slug source
 */
MovieCreditSchema.pre(
    "validate",
    {document: true},
    async function (this: HydratedDocument<IMovieCredit>, next: () => void) {
        if (this.isModified("person")) {
            await this.populate("person");
            this.slug = generateSlug(
                (this.person as PersonSchemaFields).name
            );
        }

        next();
    }
);
