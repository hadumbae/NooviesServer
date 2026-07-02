/**
 * @fileoverview Defines the schema for movie information view route configuration.
 */

import {z} from "zod";
import {SlugStringSchema} from "@/shared/schema/strings/SlugStringSchema";
import {preprocessToNumber} from "@/shared/_feat/zod-preprocessors";
import {PositiveIntegerSchema} from "@/shared/schema/numbers/PositiveIntegerSchema";

/** Zod schema for validating movie information route parameters. */
export const MovieInfoOverviewViewRouteConfigSchema = z.object({
    slug: SlugStringSchema,
    reviewPage: preprocessToNumber(PositiveIntegerSchema).optional(),
    reviewPerPage: preprocessToNumber(PositiveIntegerSchema).optional(),
});

/** Configuration object for the movie information view route. */
export type MovieInfoOverviewViewRouteConfig = z.infer<typeof MovieInfoOverviewViewRouteConfigSchema>;