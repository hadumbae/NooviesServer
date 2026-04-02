/**
 * @file Mongoose lifecycle middleware and query hooks for the User model.
 * @filename User.hooks.ts
 */

import {UserSchema} from "@models/User.schema";
import type {HydratedDocument} from "mongoose";
import type {UserSchemaFields} from "@models/User.types";
import {generateUserUniqueCode} from "@domains/users/utilities";

/**
 * Pre-validation middleware: Initializes core identity fields for new user documents.
 */
UserSchema.pre(
    'validate',
    {document: true},
    async function (this: HydratedDocument<UserSchemaFields>, next: () => void) {
        if (this.isNew) {
            this.uniqueCode = generateUserUniqueCode();
        }

        next();
    }
);