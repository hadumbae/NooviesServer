/**
 * @file Safe JSON parsing utility with structured error handling.
 * Throws a JSONParseError when parsing fails.
 * @filename parseJSON.ts
 */

import {JSONParseError} from "../errors/JSONParseError.js";

/**
 * Parameters for {@link parseJSON}.
 */
type ParseParams = {
    /** JSON string to parse. */
    jsonString: string;

    /** Optional identifier describing the JSON source. */
    source?: string;

    /** Optional HTTP status code associated with the payload. */
    statusCode?: number;
};

/**
 * Parses a JSON string and returns the typed result.
 *
 * @typeParam TReturn - Expected return type of the parsed JSON.
 * @param params - JSON parsing parameters.
 * @throws {JSONParseError} If the JSON string cannot be parsed.
 */
export function parseJSON<TReturn = unknown>(
    {jsonString, source, statusCode}: ParseParams
): TReturn {
    try {
        return JSON.parse(jsonString);
    } catch {
        throw new JSONParseError({
            message: "Failed to parse JSON.",
            raw: jsonString,
            source,
            statusCode,
        });
    }
}