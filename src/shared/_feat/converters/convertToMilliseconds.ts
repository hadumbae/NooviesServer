/**
 * @fileoverview Utility functions and configurations for time unit conversions.
 */

type ConverterConfig = {
    value: number;
    from: "seconds" | "minutes" | "hours" | "days";
}

/** Converts a given duration value from specified time units to milliseconds. */
export function convertToMilliseconds(
    {value, from}: ConverterConfig
): number {
    switch (from) {
        case "seconds":
            return value * 1000;
        case "minutes":
            return value * 60 * 1000;
        case "hours":
            return value * 60 * 60 * 1000;
        case "days":
            return value * 24 * 60 * 60 * 1000;
        default:
            return value;
    }
}