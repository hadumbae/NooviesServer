/**
 * @file Zod schemas for validating Ipify geolocation responses.
 * @filename IpifyCountryData.schema.ts
 */

import {z} from "zod";
import {ISO3166Alpha2CountryCodeSchema} from "../enums/ISO3166Alpha2CountryCodeSchema.js";
import {NonEmptyStringSchema} from "../strings/NonEmptyStringSchema.js";
import {TimezoneOffsetSchema} from "../date-time/TimezoneOffsetSchema.js";
import {IpSchema} from "../strings/IPSchema.js";

/**
 * Schema describing the `location` object returned by the Ipify API.
 */
export const IpifyLocationSchema = z.object({
    country: ISO3166Alpha2CountryCodeSchema,
    region: NonEmptyStringSchema,
    timezone: TimezoneOffsetSchema,
});

/**
 * Schema describing the Ipify geolocation payload.
 */
export const IpifyCountryDataSchema = z.object({
    ip: IpSchema,
    location: IpifyLocationSchema,
    isp: NonEmptyStringSchema,
});