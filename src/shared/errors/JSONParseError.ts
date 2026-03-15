/**
 * @file Error type for JSON parsing failures.
 * Captures the raw input and optional metadata about the source.
 * @filename JSONParseError.ts
 */

type ErrorParams = {
    /** Raw value that failed JSON parsing. */
    raw: unknown;

    /** Optional high-level error message. */
    message?: string;

    /** Optional identifier describing the origin of the JSON payload. */
    source?: string;

    /** Optional HTTP status code associated with the failure. */
    statusCode?: number;
};

/**
 * Error representing a failure to parse JSON data.
 */
export class JSONParseError extends Error {
    /** Raw value that failed parsing. */
    public readonly raw: unknown;

    /** Optional identifier for where the JSON originated. */
    public readonly source?: string;

    /** Optional HTTP status code associated with the error. */
    public readonly statusCode?: number;

    /**
     * @param params - JSON parse error details.
     */
    constructor({raw, message, source, statusCode}: ErrorParams) {
        super(message);

        this.name = "JSONParseError";

        this.raw = raw;
        this.source = source;
        this.statusCode = statusCode;
    }

    /**
     * Returns a concise string representation of the error.
     */
    toString(): string {
        return `[${this.name}] Failed to parse JSON`;
    }

    /**
     * Serializes the error for logging or API responses.
     *
     * @returns JSON-safe representation of the error.
     */
    toJSON(): Record<string, any> {
        return {
            raw: this.raw,
            source: this.source,
            message: this.message,
            statusCode: this.statusCode,
        };
    }
}