import {z, ZodArray} from "zod";
import type {ZodTypeAny} from "zod";

/**
 * Utility function that generates a Zod array schema from a given item schema.
 *
 * This function wraps the provided schema in a `z.array(...)` with consistent
 * error messages for required fields and invalid types.
 *
 * @template TSchema - A Zod schema type for the array elements.
 * @param schema - The Zod schema that defines the shape of each array item.
 * @returns A Zod array schema validating an array of the given schema type.
 */
export default function generateArraySchema<TSchema extends ZodTypeAny>(schema: TSchema): ZodArray<TSchema> {
    return z.array(schema, {required_error: "Required.", invalid_type_error: "Must be an array."});
}