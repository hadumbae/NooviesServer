/**
 * @file Error type for structured data validation failures.
 * Wraps Zod validation issues and optional source metadata.
 * @filename DataValidationError.ts
 */

import type {ZodIssue} from "zod";

/**
 * Parameters used to construct a {@link DataValidationError}.
 */
type ErrorParams = {
    /** Optional high-level error message. */
    message?: string;

    /** Zod validation issues describing each failure. */
    errors: ZodIssue[];

    /** Original input that failed validation. */
    raw?: unknown;

    /** Optional identifier describing where the invalid data originated. */
    source?: string;
};

/**
 * Error representing a failed data validation.
 *
 * Preserves `ZodIssue[]` for structured validation details and optional
 * metadata about the data source.
 */
export class DataValidationError extends Error {
    /** Zod validation issues associated with the failure. */
    public readonly errors: ZodIssue[];

    /** Original input that failed validation, if provided. */
    public readonly raw?: unknown;

    /** Optional identifier for the origin of the invalid data. */
    public readonly source?: string;

    /**
     * @param params - Validation error details.
     */
    constructor(params: ErrorParams) {
        const {message, errors, raw, source} = params;

        super(message);

        this.name = "DataValidationError";

        this.raw = raw;
        this.errors = errors;
        this.source = source;
    }

    /**
     * Returns a concise string representation of the error.
     */
    toString(): string {
        return `[${this.name}] Failed To Validate Data`;
    }

    /**
     * Serializes the error for logging or API responses.
     *
     * @returns JSON-safe representation of the validation error.
     */
    toJSON(): Record<string, any> {
        return {
            raw: this.raw,
            message: this.message,
            errors: this.errors,
            source: this.source,
        };
    }
}