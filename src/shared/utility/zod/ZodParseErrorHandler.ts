import {ZodError} from "zod";
import ZodParseError from "../../errors/ZodParseError.js";

/**
 * Handles errors thrown during Zod validation.
 *
 * - If the provided `error` is a {@link ZodError}, it converts the error into a
 *   {@link ZodParseError}, including a formatted list of validation issues.
 * - Otherwise, it rethrows the original error.
 *
 * @param error - The error object thrown during validation or elsewhere.
 * @param message - Optional custom message for the {@link ZodParseError}. Defaults to `"Validation Failed."`.
 *
 * @throws {ZodParseError} When `error` is an instance of {@link ZodError}.
 * @throws {Error} Rethrows the original error if it is not a {@link ZodError}.
 *
 * @example
 * ```ts
 * try {
 *   schema.parse(data);
 * } catch (err) {
 *   handleZodError(err, "Failed to validate input");
 * }
 * ```
 */
export default (error: Error, message: string = "Validation Failed."): never => {
    if (error instanceof ZodError) {
        const errors = error.issues.map(issue => {
            // Add a `pathString` property for easier reference
            (issue as any).pathString = issue.path.join(".");
            return issue;
        });

        throw new ZodParseError({message: message, errors});
    }

    throw error;
}
