/**
 * @fileoverview Zod schema for transforming URL string parameters into fuzzy MongoDB regex patterns.
 */

import {z} from "zod";
import {generateFuzzyRegexPattern} from "@shared/utility/regex/generateFuzzyRegexPattern";

/**
 * A transformation schema that converts raw URL string input into a MongoDB-compatible regex object.
 */
export const URLParamRegexPatternSchema = z
    .coerce
    .string({invalid_type_error: "Must be a string."})
    .trim()
    .optional()
    .transform(
        (value) =>
            typeof value === "string" && value !== ""
                ? {$regex: generateFuzzyRegexPattern(value), $options: "i"}
                : undefined
    );

/**
 * TypeScript type inferred from the regex transformation schema.
 */
export type URLParamStringRegex = z.infer<typeof URLParamRegexPatternSchema>;