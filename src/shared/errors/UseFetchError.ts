/**
 * @file Error type for failures originating from fetch-based requests.
 * Captures request metadata for logging and error handling.
 * @filename UseFetchError.ts
 */

import type {URLString} from "../schema/strings/URLStringSchema.js";
import type {RequestMethod} from "../types/request-options/RequestMethods.js";

/**
 * Parameters used to construct a {@link UseFetchError}.
 */
type ErrorParams = {
    /** Request URL associated with the failure. */
    url: URLString;

    /** HTTP method used for the request. */
    method: RequestMethod;

    /** Optional high-level error message. */
    message?: string;

    /** Optional HTTP status code returned by the request. */
    statusCode?: number;
};

/**
 * Error representing a failed `fetch` request.
 *
 * Includes request metadata to assist with debugging and logging.
 */
export class UseFetchError extends Error {
    /** Request URL associated with the failure. */
    public readonly url: string;

    /** HTTP method used for the request. */
    public readonly method: RequestMethod;

    /** Optional HTTP status code returned by the request. */
    public readonly statusCode?: number;

    /**
     * @param params - Fetch error details.
     */
    constructor({url, message, method, statusCode}: ErrorParams) {
        super(message);

        this.name = "UseFetchError";

        this.url = url;
        this.method = method;
        this.statusCode = statusCode;
    }

    /**
     * Returns a concise string representation of the error.
     */
    toString(): string {
        return `[${this.name}] ${this.method} | \`fetch\` Failed`;
    }

    /**
     * Serializes the error for logging or API responses.
     *
     * @returns JSON-safe representation of the fetch error.
     */
    toJSON(): Record<string, any> {
        return {
            message: this.message,
            url: this.url,
            method: this.method,
            statusCode: this.statusCode,
        };
    }
}