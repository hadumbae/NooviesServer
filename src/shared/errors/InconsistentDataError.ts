/**
 * @file InconsistentDataError.ts
 *
 * Domain error thrown when persisted or derived data violates
 * expected invariants or internal consistency rules.
 *
 * @remarks
 * This error indicates a system or logic failure rather than
 * invalid user input. It is commonly raised when database state,
 * snapshots, or derived schemas fail internal validation.
 *
 * Optional metadata (model name, identifier, validation issues)
 * may be included to assist debugging, logging, and observability.
 */

import type { ZodIssue } from "zod";

/**
 * Constructor parameters for {@link InconsistentDataError}.
 */
type ErrorConstructor = {
    /** Human-readable error message. */
    message: string;

    /** Optional model or domain name associated with the error. */
    modelName?: string;

    /** Optional identifier related to the inconsistent record. */
    identifier?: string;

    /** Optional validation issues describing the inconsistency. */
    errors?: ZodIssue[];
};

/**
 * Error representing an inconsistent or invalid internal data state.
 *
 * @remarks
 * Intended for use when application-level invariants are violated,
 * such as corrupted records, invalid snapshots, or unexpected
 * schema mismatches.
 */
export class InconsistentDataError extends Error {
    /** Optional model or domain name associated with the error. */
    readonly modelName?: string;

    /** Optional identifier related to the inconsistent record. */
    readonly identifier?: string;

    /** Optional validation issues describing the inconsistency. */
    readonly errors?: ZodIssue[];

    constructor({ message, identifier, modelName, errors }: ErrorConstructor) {
        super(message);

        this.name = "InconsistentDataError";
        this.modelName = modelName;
        this.identifier = identifier;
        this.errors = errors;
    }

    /**
     * String representation suitable for logs.
     */
    toString(): string {
        return `[${this.modelName ?? "GENERAL"}] Inconsistent Data Error: ${this.message}`;
    }

    /**
     * JSON representation for structured logging or API responses.
     */
    toJSON(): Record<string, unknown> {
        return {
            message: this.message,
            modelName: this.modelName,
            identifier: this.identifier,
            errors: this.errors,
        };
    }
}
