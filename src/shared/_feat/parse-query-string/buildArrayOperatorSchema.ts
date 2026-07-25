/**
 * @fileoverview Utility for building Zod schemas that transform arrays into MongoDB-style operator objects.
 */

import {z, type ZodArray, type ZodEffects, type ZodType, type ZodTypeDef} from "zod";

type ArrayOperator = "$in" | "$all" | "$nin";

/** Configuration for the array operator schema factory. */
type FactoryConfig<TData = unknown> = {
    operator?: ArrayOperator;
    schema: ZodType<TData, ZodTypeDef, unknown>;
};

/** A Zod schema that validates an array and transforms it into a keyed operator object. */
type ArrayOperatorSchema<TData = unknown> = ZodEffects<
    ZodArray<ZodType<TData, ZodTypeDef, unknown>>,
    Record<ArrayOperator, TData[]>,
    unknown[]
>;

/** Creates a Zod schema that wraps an array of values in a MongoDB query operator. */
export function buildArrayOperatorSchema<TData>(
    {operator = "$in", schema}: FactoryConfig<TData>
): ArrayOperatorSchema<TData> {
    return z
        .array(schema, {required_error: "Required.", invalid_type_error: "Must be an array."})
        .transform(values => ({[operator]: values}) as Record<ArrayOperator, TData[]>);
}