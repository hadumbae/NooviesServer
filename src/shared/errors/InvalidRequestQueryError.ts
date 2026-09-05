/**
 * @fileoverview Custom error class representing validation failures in query options.
 */

import type {ZodIssue} from "zod";

type ErrorConstructor = {
    message?: string;
    modelName?: string;
    errors: ZodIssue[];
}

type JSONReturns = {
    errorType: "ERR_INVALID_QUERY_OPTIONS"
    message?: string;
    model?: string;
    errors: ZodIssue[];
}

/**
 * Custom error thrown when query option parameters fail runtime schema validation.
 */
export class InvalidRequestQueryError extends Error {
    public readonly errorType = "ERR_INVALID_QUERY_OPTIONS" as const;
    public readonly modelName?: string;
    public readonly errors: ZodIssue[];

    constructor({message, errors, modelName}: ErrorConstructor) {
        super(message);

        this.errors = errors;
        this.modelName = modelName;

        Object.setPrototypeOf(this, InvalidRequestQueryError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }

    toString(): string {
        return `[INVALID] Invalid Query Options (Error Count : ${this.errors.length})`;
    }

    toJSON(): JSONReturns {
        return {
            errorType: this.errorType,
            message: this.message,
            model: this.modelName,
            errors: this.errors,
        }
    }
}