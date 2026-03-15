/**
 * @file Error type for non-success HTTP responses.
 * Captures response metadata and optional body content.
 * @filename HttpResponseError.ts
 */

import type {URLString} from "../schema/strings/URLStringSchema.js";

/**
 * Parameters used to construct a {@link HttpResponseError}.
 */
type ErrorParams = {
    /** Optional high-level error message. */
    message?: string;

    /** Request URL associated with the response. */
    url: URLString;

    /** HTTP response status code. */
    statusCode: number;

    /** HTTP response status text. */
    statusText: string;

    /** Optional response body returned by the server. */
    body?: unknown;
};

/**
 * Error representing a failed HTTP response.
 *
 * Used when a request completes but returns a non-success
 * status code (e.g., 4xx or 5xx).
 */
export class HttpResponseError extends Error {
    /** Request URL associated with the response. */
    public readonly url: URLString;

    /** HTTP response status code. */
    public readonly statusCode: number;

    /** HTTP response status text. */
    public readonly statusText: string;

    /** Optional response body returned by the server. */
    public readonly body?: unknown;

    /**
     * @param params - HTTP response error details.
     */
    constructor({url, statusText, statusCode, body, message}: ErrorParams) {
        super(message);

        this.name = "HttpResponseError";

        this.url = url;
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.body = body;
    }

    /**
     * Returns a concise string representation of the error.
     */
    toString(): string {
        return `[${this.name}] Response Error | HTTP${this.statusCode} : ${this.statusText}`;
    }

    /**
     * Serializes the error for logging or API responses.
     *
     * @returns JSON-safe representation of the HTTP response error.
     */
    toJSON(): Record<string, any> {
        return {
            message: this.message,
            url: this.url,
            statusCode: this.statusCode,
            statusText: this.statusText,
            body: this.body,
        };
    }
}