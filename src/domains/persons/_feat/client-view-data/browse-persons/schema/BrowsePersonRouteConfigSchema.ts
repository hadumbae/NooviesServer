/**
 * @fileoverview Defines the schema for person browsing route configuration.
 */

import {z} from "zod";
import {preprocessToNumber} from "@/shared/_feat/zod-preprocessors";
import {PositiveIntegerSchema} from "@/shared/_schema/numbers/numbers/PositiveIntegerSchema";

/** Zod schema for validating person browsing pagination parameters. */
export const BrowsePersonRouteConfigSchema = z.object({
    page: preprocessToNumber(PositiveIntegerSchema.optional()).optional(),
    perPage: preprocessToNumber(PositiveIntegerSchema.optional()).optional(),
});

/** Configuration object for person browsing pagination. */
export type BrowsePersonRouteConfig = z.infer<typeof BrowsePersonRouteConfigSchema>;