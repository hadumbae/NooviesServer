/**
 * @fileoverview Zod schema and type definitions for the person information route configuration.
 *
 */

import {z} from "zod";
import {SlugStringSchema} from "@/shared/schema/strings/SlugStringSchema";
import {preprocessToNumber} from "@/shared/_feat/zod-preprocessors";
import {PositiveNumberSchema} from "@/shared/_schema/numbers/numbers/PositiveNumberSchema";

/** Zod validation schema for the person information route configuration. */
export const PersonInfoViewRouteConfigSchema = z.object({
    slug: SlugStringSchema,
    limit: preprocessToNumber(PositiveNumberSchema.optional()).optional(),
});

/** Configuration type for the person information view route. */
export type PersonInfoViewRouteConfig = z.infer<typeof PersonInfoViewRouteConfigSchema>;