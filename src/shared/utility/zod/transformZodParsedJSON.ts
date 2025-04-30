import {ZodError, type ZodTypeAny} from "zod";

/**
 * Creates a transformation function that parses and validates an optional JSON string using a Zod schema.
 *
 * If the input is `undefined`, the function returns `undefined`.
 * If the input is a valid JSON string that matches the schema, the parsed and validated value is returned.
 * If parsing fails or the data doesn't match the schema, an error is thrown.
 *
 * @template TReturn - The expected return type after schema validation.
 * @param schema - A Zod schema to validate the parsed JSON object.
 * @returns A function that transforms an optional JSON string into a validated value of type `TReturn`.
 */
export const transformZodParsedJSON = <TReturn = any>(schema: ZodTypeAny) => (value?: string): TReturn | undefined => {
    if (!value) return undefined;

    try {
        const result = JSON.parse(value);
        return schema.parse(result) as TReturn;
    } catch (e: any) {
        if (e instanceof ZodError) throw e;
        throw new Error("Failed To Parse JSON In URL Query Parameter.");
    }
}

export default transformZodParsedJSON;