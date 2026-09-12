/**
 * @fileoverview Zod schema and TypeScript type definition for validating runtime environment variables.
 */

import {z} from "zod";
import {IANATimezoneSchema} from "@/shared/schema/date-time/IANATimezoneSchema";
import {CoercedNumberValueSchema} from "@/shared/_schema/numbers/coerced-number/CoercedNumberValueSchema";
import {StringValueSchema} from "@/shared/schema/strings/StringValueSchema";
import {CoercedPositiveNumberSchema} from "@/shared/_schema/numbers/coerced-number/CoercedPositiveNumberSchema";
import {IpSchema} from "@/shared/schema/strings/IPSchema";
import {CoercedNonNegativeNumberSchema} from "@/shared/_schema/numbers/coerced-number/CoercedNonNegativeNumberSchema";
import {CoercedBooleanValueSchema} from "@/shared/_schema/booleans/CoercedBooleanValueSchema";

/** Zod validation schema for application environment variables. */
export const EnvironmentVariablesSchema = z.object({
    PORT: CoercedNumberValueSchema,
    TZ: z.union([IANATimezoneSchema, z.literal("UTC")]),
    MONGO_DB_STRING: StringValueSchema,
    CORS_ALLOWED_ORIGINS: StringValueSchema.transform(value => value.split(",").map(origin => origin.trim())),
    CLOUDINARY_CLOUD_NAME: StringValueSchema,
    CLOUDINARY_API_KEY: StringValueSchema,
    CLOUDINARY_API_SECRET: StringValueSchema,
    USE_MOCKED_IP: CoercedBooleanValueSchema,
    MOCKED_CLIENT_IP: IpSchema,
    IPIFY_KEY: StringValueSchema,
    JWT_SECRET: StringValueSchema,
    REQUIRE_SECURE_COOKIES: CoercedBooleanValueSchema,
    PAGINATION_PAGE_DEFAULT: CoercedPositiveNumberSchema.catch(1),
    PAGINATION_PER_PAGE_DEFAULT: CoercedPositiveNumberSchema.catch(10),
    CREDENTIALS_EXPIRY_DURATION: CoercedPositiveNumberSchema.catch(15),
    REFRESH_EXPIRY_DURATION: CoercedNonNegativeNumberSchema.catch(12),
    REFRESH_TOKEN_LIFETIME: CoercedNonNegativeNumberSchema.catch(30),
});

/** Represents validated application environment variables derived from EnvironmentVariablesSchema. */
export type EnvironmentVariables = z.infer<typeof EnvironmentVariablesSchema>;