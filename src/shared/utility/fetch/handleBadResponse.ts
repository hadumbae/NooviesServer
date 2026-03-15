import {HttpResponseError} from "../../errors/HttpResponseError.js";
import {parseJSON} from "../parseJSON.js";
import type {URLString} from "../../schema/strings/URLStringSchema.js";

type HandlerParams = {
    url: URLString;
    status: number;
    statusText: string;
    raw: string;
}

export async function handleBadResponse(
    {url, raw, status, statusText}: HandlerParams
): Promise<never> {
    const responseData = parseJSON({
        jsonString: raw,
        statusCode: status,
        source: handleBadResponse.name,
    });

    throw new HttpResponseError({
        url,
        statusText,
        statusCode: status,
        body: responseData,
    });
}