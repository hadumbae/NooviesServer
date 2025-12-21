/**
 * @file ISO4217CurrencyCodeEnumSchema.ts
 *
 * @description
 * Zod enum schema for validating ISO 4217 currency codes.
 *
 * Ensures that currency values conform to the supported ISO 4217 code set,
 * providing consistent validation and error messaging across the application.
 */

import { z } from "zod";
import ISO4217CurrencyCodesConstant from "../../constants/currency/ISO4217CurrencyCodesConstant.js";

/**
 * ISO 4217 currency code validation schema.
 */
export const ISO4217CurrencyCodeEnumSchema = z.enum(
    ISO4217CurrencyCodesConstant,
    {
        required_error: "Required.",
        invalid_type_error: "Invalid value. Must be an ISO 4217 currency code.",
    }
);

/**
 * Inferred ISO 4217 currency code type.
 */
export type ISO4217CurrencyCode = z.infer<typeof ISO4217CurrencyCodeEnumSchema>;