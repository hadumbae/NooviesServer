/**
 * @file TypeScript types inferred from Ipify geolocation schemas.
 * @filename IpifyCountryData.types.ts
 */

import {z} from "zod";
import {IpifyCountryDataSchema, type IpifyLocationSchema} from "./IpifyCountryData.schema.js";

/**
 * Inferred type for {@link IpifyLocationSchema}.
 */
export type IpifyLocation = z.infer<typeof IpifyLocationSchema>;

/**
 * Inferred type for {@link IpifyCountryDataSchema}.
 */
export type IpifyCountryData = z.infer<typeof IpifyCountryDataSchema>;