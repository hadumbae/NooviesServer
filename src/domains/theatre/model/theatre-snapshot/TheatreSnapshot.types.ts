/**
 * @file TheatreSnapshotSchemaFields.ts
 *
 * @summary
 * Defines the snapshot structure of a theatre for storage in other entities.
 */

import type { IANATimezone } from "../../../../shared/schema/date-time/IANATimezoneSchema.js";

/**
 * Fields representing a theatre snapshot.
 *
 * Used for storing a theatre’s state at a specific point in time
 * (e.g., in showings or reservations).
 */
export interface TheatreSnapshotSchemaFields {
    /** Name of the theatre */
    name: string;

    /** Optional street address */
    street?: string;

    /** City where the theatre is located */
    city: string;

    /** Optional state or province */
    state?: string;

    /** Country code or name */
    country: string;

    /** Optional postal or ZIP code */
    postalCode?: string;

    /** Timezone of the theatre (IANA format) */
    timezone: IANATimezone;
}
