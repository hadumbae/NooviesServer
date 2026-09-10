/**
 * @fileoverview Utility function for loading and validating application environment variables.
 */

import "dotenv/config";
import {EnvironmentVariablesSchema} from "@/shared/_feat/env/EnvironmentVariablesSchema";

/** Parses and validates process environment variables against EnvironmentVariablesSchema. */
export function getEnvVariables() {
    try {
        const values = process.env;
        return EnvironmentVariablesSchema.parse(values);
    } catch (e: unknown) {
        throw new Error("Invalid environment variables.");
    }
}