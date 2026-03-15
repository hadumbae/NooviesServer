/**
 * @file Service for retrieving IP geolocation data from the Ipify API.
 * @filename IpApiService.ts
 */

import "dotenv/config";
import {useFetchAPI} from "../../../../shared/utility/fetch/useFetchAPI.js";
import * as process from "node:process";
import {IpifyCountryDataSchema} from "../../../../shared/schema/ipify/IpifyCountryData.schema.js";
import {DataValidationError} from "../../../../shared/errors/DataValidationError.js";
import type {IpifyCountryData} from "../../../../shared/schema/ipify/IpifyCountryData.types.js";

/**
 * Fetches geolocation data for the provided IP address.
 *
 * The response payload is validated against {@link IpifyCountryDataSchema}
 * before being returned.
 *
 * @param ipAddress - IP address to resolve.
 * @returns Validated Ipify geolocation data.
 *
 * @throws {UseFetchError} When a network or fetch-level error occurs.
 * @throws {HttpResponseError} When the external API returns a non-success response.
 * @throws {JSONParseError} When the response body cannot be parsed as JSON.
 * @throws {DataValidationError} When the response payload fails schema validation.
 */
export const fetchIPData = async (ipAddress: string): Promise<IpifyCountryData> => {
    const url = `https://geo.ipify.org/api/v2/country?apiKey=${process.env.IPIFY_KEY}&ipAddress=${ipAddress}`;

    const fetchedData = await useFetchAPI({
        url,
        method: "GET",
    });

    const {data, success, error} = IpifyCountryDataSchema.safeParse(fetchedData);

    if (!success) {
        throw new DataValidationError({
            message: "Invalid Country Data.",
            source: fetchIPData.name,
            raw: fetchedData,
            errors: error.errors,
        });
    }

    return data;
};