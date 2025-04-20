import type {ZodIssue} from "zod";

/**
 * Represents a custom error thrown when Zod schema validation fails.
 *
 * This error encapsulates the array of {@link ZodIssue} objects returned by Zod,
 * providing detailed information about each validation issue encountered.
 *
 * @example
 * ```ts
 * import { ZodParseError } from './ZodParseError';
 * import { z } from 'zod';
 *
 * const schema = z.object({ email: z.string().email() });
 * const result = schema.safeParse({ email: "invalid-email" });
 *
 * if (!result.success) {
 *   throw new ZodParseError({
 *     message: "Validation failed",
 *     errors: result.error.issues,
 *   });
 * }
 * ```
 *
 * @public
 */
export default class ZodParseError extends Error {
    /**
     * An array of validation issues returned by Zod.
     */
    public readonly errors: ZodIssue[];

    /**
     * Constructs a new {@link ZodParseError} instance.
     *
     * @param params - An object containing the error message and the array of Zod issues.
     * @param params.message - A descriptive error message.
     * @param params.errors - An array of {@link ZodIssue} objects detailing validation failures.
     */
    constructor(params: {message?: string, errors: ZodIssue[] }) {
        const {message, errors} = params;

        super(message);
        this.errors = errors;
    }
}