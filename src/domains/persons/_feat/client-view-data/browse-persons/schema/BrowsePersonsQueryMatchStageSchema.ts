/**
 * @fileoverview Zod schema for validating the match stage parameters when browsing persons.
 */

import {z} from "zod";
import {URLParamRegexPatternSchema} from "@/shared/_feat/parse-query-string";
import {normaliseQueryMatchValues} from "@/shared/_feat/pipeline-schema-transformers";

/** Zod schema for the browse persons query match stage. */
export const BrowsePersonsQueryMatchStageSchema = z.object({
    name: URLParamRegexPatternSchema,
}).transform(normaliseQueryMatchValues);

/** Type definition for the browse persons query match stage. */
export type BrowsePersonsQueryMatchStage = z.infer<typeof BrowsePersonsQueryMatchStageSchema>;