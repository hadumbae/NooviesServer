/**
 * @fileoverview Zod schema and TypeScript type definition for authenticated user entities.
 */

import {z} from "zod";
import generateArraySchema from "@/shared/utility/schema/generateArraySchema";
import {UserUniqueCodeSchema} from "@/domains/users/_feat/manage-user-unique-code";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";
import {
    UserEmailSchema,
    UserPersonalNameSchema,
    UserRoleSchema,
    UserStatusSchema,
} from "@/domains/users/validation/fields";

/** Zod validation schema for authenticated user objects. */
export const AuthUserSchema = z.object({
    _id: ObjectIdSchema,
    name: UserPersonalNameSchema,
    email: UserEmailSchema,
    uniqueCode: UserUniqueCodeSchema,
    roles: generateArraySchema(UserRoleSchema),
    status: UserStatusSchema,
});

/** Represents an authenticated user entity derived from AuthUserSchema. */
export type AuthUser = z.infer<typeof AuthUserSchema>;