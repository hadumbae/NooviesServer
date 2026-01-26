import type {BookingErrorCode} from "../../schema/strings/BookingErrorCodeSchema.js";

/**
 * Constructor parameters for {@link BookingError}.
 */
type BookingErrorConstructor = {
    /** Human-readable error message intended for API consumers. */
    message: string;

    /** Stable, client-safe booking error code. */
    errorCode: BookingErrorCode;

    /** HTTP status code associated with this error. */
    statusCode: number;
};

/**
 * JSON-serializable representation of a {@link BookingError}.
 *
 * Used when returning structured error responses from the API.
 */
type ErrorJSONReturn = {
    message: string;
    errorCode: BookingErrorCode;
    statusCode: number;
};

/**
 * Domain error class for booking-related failures.
 *
 * @remarks
 * Combines a machine-readable {@link BookingErrorCode},
 * a human-readable message, and an HTTP status code.
 *
 * Instances are safe to serialize and return directly
 * in API error responses.
 */
export class BookingError extends Error {
    /** Stable booking error identifier. */
    readonly errorCode: BookingErrorCode;

    /** HTTP status code associated with this error. */
    readonly statusCode: number;

    /**
     * Creates a new {@link BookingError}.
     *
     * @param params - Error construction parameters.
     */
    constructor({message, errorCode, statusCode}: BookingErrorConstructor) {
        super(message);

        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }

    /**
     * Returns a concise string representation suitable for logging.
     */
    toString(): string {
        return `[${this.errorCode}] HTTP ${this.statusCode}`;
    }

    /**
     * Serializes the error into a JSON-safe structure.
     *
     * @remarks
     * Intended for use in API responses and error middleware.
     */
    toJSON(): ErrorJSONReturn {
        return {
            message: this.message,
            errorCode: this.errorCode,
            statusCode: this.statusCode,
        };
    }
}
