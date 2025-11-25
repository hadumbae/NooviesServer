import {z, type ZodTypeAny} from "zod";

/**
 * Generates a reusable Zod schema for validating array-type URL query parameters.
 *
 * This schema supports two formats:
 * - A JSON string representing an array, e.g. `["a", "b", "c"]`
 * - An already-parsed JavaScript array (which may happen depending on your framework)
 *
 * If the input is not a valid array (e.g., malformed JSON, or an object), it returns `undefined`,
 * which allows it to pass validation if the schema is marked as optional.
 *
 * @template TSchema The Zod schema for validating individual elements of the array.
 * @param schema - A Zod schema describing the shape of each array item.
 * @returns A Zod schema that parses and validates an array of the given item schema.
 *
 * @example
 * ```ts
 * const TagsSchema = generateURLParamArraySchema(z.string());
 * // Handles: ?tags=["one","two"] or ?tags=some-parsed-array
 * ```
 */
export default function generateURLParamArraySchema<TSchema extends ZodTypeAny>(schema: TSchema) {
    /**
     * Preprocess to an array. Return `undefined` for any failure.
     * The resulting value will be parsed by the schema.
     * @param value Value to preprocess.
     */
    const preprocessToArray = (value: any) => {
        if (Array.isArray(value)) return value;

        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : undefined;
            } catch (e: any) {
                return undefined;
            }
        }

        return undefined;
    };

    return z
        .preprocess(preprocessToArray, z.array(schema, {invalid_type_error: "Must be an array."}))
        .optional();
}