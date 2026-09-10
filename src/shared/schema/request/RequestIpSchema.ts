/**
 * @fileoverview Zod schema and type definition for parsing and transforming request IP addresses.
 */

import "dotenv/config"
import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {z} from "zod";

/** Zod schema for resolving the client IP address with support for fallback environment mocks. */
export const RequestIpSchema = NonEmptyStringSchema
    .optional()
    .transform((value) => process.env.USE_MOCKED_IP ? process.env.MOCKED_CLIENT_IP : value);

/** Inferred type for a validated request IP address string. */
export type RequestIp = z.infer<typeof RequestIpSchema>;