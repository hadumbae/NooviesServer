/**
 * @file Zod schemas and types for validating IP address strings.
 * @filename IpSchema.ts
 */

import { z } from "zod";
import {StringValueSchema} from "./StringValueSchema.js";

/**
 * Schema for a trimmed string representing a valid IPv4 or IPv6 address.
 */
export const IpSchema = StringValueSchema.ip({
    message: "Must be a valid IP address"
});

/**
 * Type representing a validated IP address string.
 */
export type IpString = z.infer<typeof IpSchema>;

/**
 * Schema for a trimmed string representing a valid IPv4 address.
 */
export const IpV4Schema = StringValueSchema.ip({
    message: "Must be a valid IP V4 address",
    version: "v4",
});

/**
 * Type representing a validated IPv4 address string.
 */
export type IpV4String = z.infer<typeof IpV4Schema>;

/**
 * Schema for a trimmed string representing a valid IPv6 address.
 */
export const IpV6Schema = StringValueSchema.ip({
    message: "Must be a valid IP V6 address",
    version: "v6",
});

/**
 * Type representing a validated IPv6 address string.
 */
export type IpV6String = z.infer<typeof IpV6Schema>;