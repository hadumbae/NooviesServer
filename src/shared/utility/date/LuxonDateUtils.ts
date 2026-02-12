/**
 * @file LuxonDateUtils.ts
 *
 * UTC-safe date utility helpers built on Luxon.
 *
 * @description
 * Provides small, deterministic helper functions for generating native
 * JavaScript `Date` objects normalized to UTC.
 *
 * @remarks
 * - All returned values are explicitly converted to UTC.
 * - Designed for persistence (database timestamps) and reliable comparisons.
 * - Avoids implicit local timezone behavior of `new Date()`.
 */

import {DateTime, type DurationLike} from "luxon";

/**
 * Returns the current date-time normalized to UTC.
 *
 * @description
 * Wraps `DateTime.now()` to ensure consistent UTC normalization before
 * converting to a native JavaScript `Date`.
 *
 * @returns A `Date` instance representing the current moment in UTC
 *
 * @remarks
 * - Equivalent to "now" in absolute time.
 * - Safe for persistence (e.g., `createdAt`, `updatedAt`, lifecycle fields).
 * - Prevents accidental reliance on system-local timezone offsets.
 */
export function calculateDateNow(): Date {
    return DateTime
        .now()
        .toUTC()
        .toJSDate();
}

/**
 * Calculates a future UTC date-time relative to the current moment.
 *
 * @description
 * Adds a Luxon `DurationLike` object to the current UTC time and
 * returns the resulting value as a native JavaScript `Date`.
 *
 * @param duration - A Luxon-compatible duration object
 * (e.g. `{ minutes: 15 }`, `{ hours: 2 }`, `{ days: 1 }`)
 *
 * @returns A `Date` instance representing the computed future moment in UTC
 *
 * @remarks
 * - The calculation is always relative to the current moment.
 * - Result is normalized to UTC before conversion.
 * - Suitable for expiration timestamps, deadlines, token lifetimes, and scheduling.
 */
export function calculateFutureDate(duration: DurationLike): Date {
    return DateTime
        .now()
        .toUTC()
        .plus(duration)
        .toJSDate();
}
