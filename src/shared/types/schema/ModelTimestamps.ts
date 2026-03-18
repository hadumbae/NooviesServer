/**
 * @file Base timestamp structure for Mongoose-managed models.
 * @filename ModelTimestamps.ts
 */

/**
 * Standard audit fields automatically managed by Mongoose.
 */
export type ModelTimestamps = {
    /** ISO date of record creation. */
    createdAt: Date;

    /** ISO date of the most recent modification. */
    updatedAt: Date;
}