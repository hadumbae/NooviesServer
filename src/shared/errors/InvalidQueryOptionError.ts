/**
 * @file Error for invalid query option parameters.
 * InvalidQueryOptionError.ts
 */

import type {ZodIssue} from "zod";

/**
 * Constructor parameters for InvalidQueryOptionError.
 */
type ErrorConstructor = {
    message?: string;
    modelName?: string;
    errors: ZodIssue[];
}

/**
 * JSON representation returned by InvalidQueryOptionError.
 */
type JSONReturns = {
    errorType: "ERR_INVALID_QUERY_OPTIONS"
    message?: string;
    model?: string;
    errors: ZodIssue[];
}

/**
 * Error representing invalid query option parameters.
 */
export default class InvalidQueryOptionError extends Error {
    public readonly errorType = "ERR_INVALID_QUERY_OPTIONS" as const;
    public readonly modelName?: string;
    public readonly errors: ZodIssue[];

    constructor({message, errors, modelName}: ErrorConstructor) {
        super(message);

        this.errors = errors;
        this.modelName = modelName;

        Object.setPrototypeOf(this, InvalidQueryOptionError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Returns a formatted error summary.
     */
    toString(): string {
        return `[INVALID] Invalid Query Options (Error Count : ${this.errors.length})`;
    }

    /**
     * Serializes the error for HTTP responses.
     */
    toJSON(): JSONReturns {
        return {
            errorType: this.errorType,
            message: this.message,
            model: this.modelName,
            errors: this.errors,
        }
    }
}