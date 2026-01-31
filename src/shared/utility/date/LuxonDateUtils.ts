/**
 * @file LuxonDateUtils.ts
 *
 * UTC-safe date utility helpers built on Luxon.
 *
 * Provides small, deterministic helpers for producing `Date` objects
 * normalized to UTC, suitable for persistence and comparison.
 */

import {DateTime, type DurationLike} from "luxon";

/**
 * Returns the current UTC date-time as a native `Date`.
 *
 * @remarks
 * - Uses Luxon for timezone safety
 * - Always normalized to UTC
 * - Intended for persistence (e.g. timestamps, lifecycle fields)
 *
 * @returns Current date-time in UTC
 */
export function calculateDateNow(): Date {
    return DateTime
        .now()
        .toUTC()
        .toJSDate();
}

/**
 * Calculates a future UTC date-time from now using a Luxon duration.
 *
 * @remarks
 * - The calculation is relative to the current moment
 * - Result is normalized to UTC
 * - Suitable for expiration timestamps and deadlines
 *
 * @param duration Luxon duration-like object (e.g. `{ minutes: 15 }`)
 * @returns Future date-time in UTC
 */
export function calculateFutureDate(duration: DurationLike): Date {
    return DateTime
        .now()
        .plus(duration)
        .toUTC()
        .toJSDate();
}
