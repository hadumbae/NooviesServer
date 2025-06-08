import type {ZodIssue} from "zod";

/**
 * A specialized `Error` class for reporting validation failures from Zod schemas.
 *
 * This error wraps the validation issues (`ZodIssue[]`) returned when a call to `safeParse`
 * or `.parse()` fails. It is designed to make both developer debugging and user-facing
 * error handling cleaner and more structured.
 *
 * @remarks
 * - Use this error type when you want to preserve rich validation details,
 *   including field-level messages and error paths.
 * - Optionally, you can include the raw (parsed but invalid) input in the
 *   `raw` field for logging, response formatting, or debugging.
 *
 * @example
 * ```ts
 * const result = schema.safeParse(input);
 * if (!result.success) {
 *   throw new ZodParseError({
 *     message: "Validation failed",
 *     errors: result.error.issues,
 *     raw: result.data, // optional: include the invalid input
 *   });
 * }
 * ```
 *
 * @public
 */
export default class ZodParseError extends Error {
    /**
     * An array of Zod issues describing each validation error.
     * Includes information like `path`, `message`, and `code`.
     */
    public readonly errors: ZodIssue[];

    /**
     * The original parsed value that failed validation, if provided.
     * Useful for debugging or constructing error responses.
     */
    public readonly raw?: unknown;

    /**
     * Constructs a new {@link ZodParseError}.
     *
     * @param params - Object with error details.
     * @param params.message - Optional high-level message describing the problem.
     * @param params.errors - Array of `ZodIssue` objects detailing each validation failure.
     * @param params.raw - Optional raw input value that failed validation.
     */
    constructor(params: {message?: string, errors: ZodIssue[], raw?: unknown }) {
        const {message, errors, raw} = params;

        super(message);

        this.errors = errors;
        this.raw = raw;
    }
}