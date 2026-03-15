/**
 * @file High-level fetch utility for executing API requests.
 * Handles request execution, response validation, and JSON parsing.
 * @filename useFetchAPI.ts
 */

import type {URLString} from "../../schema/strings/URLStringSchema.js";
import {executeFetch} from "./executeFetch.js";
import type {RequestMethod} from "../../types/request-options/RequestMethods.js";
import {handleBadResponse} from "./handleBadResponse.js";
import {parseJSON} from "../parseJSON.js";
import {getResponseText} from "./getResponseText.js";

/**
 * Parameters for {@link useFetchAPI}.
 */
type FetchParams = {
    /** Request URL. */
    url: URLString;

    /** HTTP method used for the request. */
    method: RequestMethod;

    /** Optional request headers. */
    headers?: HeadersInit;

    /** Optional request body. */
    body?: BodyInit | undefined;

    /** Optional abort signal for request cancellation. */
    signal?: AbortSignal | null;
};

/**
 * Executes an API request and returns the parsed JSON response.
 *
 * Internally handles request execution, response validation,
 * and payload parsing.
 *
 * @typeParam TReturns - Expected return type of the parsed JSON response.
 * @param params - Fetch execution parameters.
 * @returns Parsed JSON response payload.
 *
 * @throws {UseFetchError} When a network or fetch-level error occurs.
 * @throws {HttpResponseError} When the server returns a non-success response.
 * @throws {JSONParseError} When the response body cannot be parsed as JSON.
 */
export const useFetchAPI = async <TReturns = unknown>(
    {url, method, headers, body, signal}: FetchParams
): Promise<TReturns> => {
    const response = await executeFetch({
        url,
        method,
        headers,
        body,
        signal,
    });

    const {status, statusText} = response;
    const rawString = await getResponseText(response);

    if (!response.ok) {
        await handleBadResponse({
            url,
            status,
            statusText,
            raw: rawString,
        });
    }

    return parseJSON<TReturns>({
        jsonString: rawString,
        source: useFetchAPI.name,
        statusCode: status,
    });
};