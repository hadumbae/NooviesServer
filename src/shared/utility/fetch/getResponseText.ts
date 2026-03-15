/**
 * @file Utility for safely reading response body text.
 * Normalizes errors thrown while accessing the response payload.
 * @filename getResponseText.ts
 */

import {HttpResponseError} from "../../errors/HttpResponseError.js";

/**
 * Reads the text body from a Fetch API response.
 *
 * Wraps errors thrown by `Response.text()` and rethrows them as
 * {@link HttpResponseError} with response metadata.
 *
 * @param response - Fetch API response object.
 * @returns Raw response body as a string.
 * @throws {HttpResponseError} If reading the response body fails.
 */
export async function getResponseText(response: Response): Promise<string> {
    const {url, status, statusText} = response;

    try {
        return await response.text();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new HttpResponseError({
                url,
                statusText,
                statusCode: status,
                message: error.message ?? "Failed to get response payload.",
            });
        }

        throw new HttpResponseError({
            url,
            message: "An unknown error occurred.",
            statusText,
            statusCode: status,
        });
    }
}