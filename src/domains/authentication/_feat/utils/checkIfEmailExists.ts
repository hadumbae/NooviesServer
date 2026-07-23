/**
 * @fileoverview Utility function to verify if a user email already exists in the database.
 */

import {User} from "@/domains/users/model/user";
import {z, type ZodIssue} from "zod";
import {RequestValidationError} from "@/shared/errors/RequestValidationError";

/** Checks for email uniqueness and throws a validation error if the email is taken. */
export async function checkIfEmailExists(email: string): Promise<void> {
    const emailCount = await User.countDocuments({email});

    if (emailCount > 0) {
        const errors: ZodIssue[] = [{
            code: z.ZodIssueCode.custom,
            path: ['email'],
            message: "Email is already in use!"
        }];

        throw new RequestValidationError({errors});
    }
}