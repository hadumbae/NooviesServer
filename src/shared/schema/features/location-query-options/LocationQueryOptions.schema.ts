/**
 * @fileoverview Zod schemas for validating location-based query parameters.
 */

import {z} from "zod";
import {ISO3166Alpha2CountryCodeSchema} from "../../enums/ISO3166Alpha2CountryCodeSchema.js";
import {NonEmptyStringSchema} from "../../strings/NonEmptyStringSchema.js";
import {CityStringSchema, StateStringSchema} from "@/shared/_schema";

/**
 * Schema for validating free-form or standardized location targets.
 */
export const LocationTargetSchema = NonEmptyStringSchema.max(500, {message: "Must be 500 characters or less."});

/**
 * Schema for an object wrapper containing optional location target and country fields.
 */
export const LocationTargetObjectSchema = z.object({
    target: LocationTargetSchema.optional(),
    country: ISO3166Alpha2CountryCodeSchema.optional(),
});

/**
 * Schema for validating structured and free-form location query options.
 */
export const LocationQueryOptionsSchema = z.object({
    city: CityStringSchema.optional(),
    state: StateStringSchema.optional(),
    country: ISO3166Alpha2CountryCodeSchema.optional(),
    postalCode: NonEmptyStringSchema.optional(),
}).merge(LocationTargetObjectSchema);