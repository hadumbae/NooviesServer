/**
 * @fileoverview Data structure definitions for the TheatreSnapshot entity.
 */

import type { IANATimezone } from "@shared/schema/date-time/IANATimezoneSchema";

/**
 * Properties of a theatre captured at a specific point in time for historical record-keeping.
 */
export type TheatreSnapshotSchemaFields = {
    name: string;
    street?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    timezone: IANATimezone;
}