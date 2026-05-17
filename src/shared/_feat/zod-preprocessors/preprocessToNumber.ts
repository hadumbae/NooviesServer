/**
 * @fileoverview Zod preprocessor utility to convert input values to numbers.
 */

import {z, type ZodType, type ZodTypeDef} from "zod";

/** Wraps a Zod schema with a preprocessor that converts strings or numbers to a number type. */
export function preprocessToNumber<TData>(
    schema: ZodType<TData, ZodTypeDef, unknown>
): z.ZodEffects<ZodType<TData, ZodTypeDef, unknown>, TData, unknown> {
    return z.preprocess(
        (val) => {
            if (val === undefined || val === null) return undefined;
            if (typeof val !== "string" && typeof val !== "number") return undefined;
            if ((typeof val === "string" && val.trim() === "")) return undefined;

            return Number(val);
        },
        schema
    );
}