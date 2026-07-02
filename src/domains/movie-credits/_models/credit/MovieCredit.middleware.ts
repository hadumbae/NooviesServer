/**
 * @fileoverview Middleware for the MovieCredit model that handles automatic slug generation based on the associated person.
 *
 */

import {MovieCreditSchema} from "@/domains/movie-credits/_models/credit/MovieCredit.schema.js";
import type {HydratedDocument} from "mongoose";
import type {MovieCreditSchemaFields} from "@/domains/movie-credits/_models/credit/MovieCredit.types";
import generateSlug from "@/shared/utility/generateSlug.js";
import type {PersonSchemaFields} from "@/domains/persons/_models/person";

MovieCreditSchema.pre(
    "validate",
    {document: true},
    async function (this: HydratedDocument<MovieCreditSchemaFields>, next: () => void) {
        if (this.isModified("person")) {
            await this.populate("person");
            this.slug = generateSlug((this.person as unknown as PersonSchemaFields).name);
        }

        next();
    }
);
