import { ZodError } from "zod";
import ZodParseError from "../../../errors/ZodParseError.js";

/**
 * Handles errors thrown during Zod schema validation.
 *
 * If the provided error is an instance of `ZodError`, it augments
 * each issue with a `pathString` property (a dot-joined string of
 * the path array) and throws a `ZodParseError` containing all issues
 * and a custom message.
 *
 * If the error is not a `ZodError`, it is re-thrown unchanged.
 *
 * This function **never returns**; it always throws.
 *
 * @param error - The error to handle, typically caught from `ZodSchema.parse`.
 * @param message - Optional custom message for the thrown `ZodParseError`.
 *                  Defaults to `"Validation Failed."`.
 *
 * @throws {ZodParseError} When `error` is a `ZodError`.
 * @throws {Error} Re-throws the original error if it is not a `ZodError`.
 *
 * @example
 * ```ts
 * try {
 *   MySchema.parse(data);
 * } catch (e) {
 *   handleZodError(e, "Failed to validate input");
 * }
 * ```
 */
export default (error: unknown, message: string = "Validation Failed."): never => {
    if (error instanceof ZodError) {
        const errors = error.issues.map(issue => {
            // Add a `pathString` property for easier reference
            (issue as any).pathString = issue.path.join(".");
            return issue;
        });

        throw new ZodParseError({ message, errors });
    }

    throw error;
};
