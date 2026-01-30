/**
 * @file InconsistentDataError.ts
 *
 * Domain error thrown when persisted data violates expected
 * invariants or internal consistency rules.
 *
 * @remarks
 * Typically indicates a logic or state corruption issue rather than
 * a user input error. May include optional model and identifier
 * metadata to aid debugging and logging.
 */

type ErrorConstructor = {
    /** Human-readable error message. */
    message: string;

    /** Optional model or domain name associated with the error. */
    modelName?: string;

    /** Optional identifier related to the inconsistent record. */
    identifier?: string;
};

/**
 * Error representing inconsistent or invalid internal data state.
 */
export class InconsistentDataError extends Error {
    /** Optional model or domain name associated with the error. */
    readonly modelName?: string;

    /** Optional identifier related to the inconsistent record. */
    readonly identifier?: string;

    constructor({ message, identifier, modelName }: ErrorConstructor) {
        super(message);

        this.name = "InconsistentDataError";
        this.modelName = modelName;
        this.identifier = identifier;
    }

    /** String representation suitable for logs. */
    toString(): string {
        return `[${this.modelName ?? "GENERAL"}] Inconsistent Data Error : ${this.message}`;
    }

    /** JSON representation for structured logging or API responses. */
    toJSON(): Record<string, unknown> {
        return {
            message: this.message,
            modelName: this.modelName,
            identifier: this.identifier,
        };
    }
}
