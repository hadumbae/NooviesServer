/**
 * @fileoverview Utility for preprocessing optional Zod fields by converting empty strings to undefined.
 */

import type {ZodTypeAny} from "zod";
import preprocessEmptyToUndefined from "@/shared/utility/schema/preprocessors/preprocessEmptyToUndefined";

/** Wraps a Zod schema to treat empty strings as undefined and marks the field as optional. */
export function preprocessOptionalField<TSchema extends ZodTypeAny = ZodTypeAny>(schema: TSchema) {
    return preprocessEmptyToUndefined(schema.optional()).optional();
}