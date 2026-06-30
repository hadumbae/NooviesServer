/**
 * @fileoverview Mongoose lifecycle middleware and query hooks for the User model.
 */
import {UserSchema} from "@/domains/users/model/user/User.schema";
import type {HydratedDocument} from "mongoose";
import type {UserSchemaFields} from "@/domains/users/model/user/User.types";
import {generateUserUniqueCode} from "@/domains/users/_feat/manage-user-unique-code/generators";

/**
 * Pre-validation middleware: Initialises core identity fields for new user documents.
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