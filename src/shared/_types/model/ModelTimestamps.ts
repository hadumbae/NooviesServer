/**
 * @fileoverview Defines the standard timestamp fields for database models.
 */

/** Represents the creation and update timestamps for a model. */
export type ModelTimestamps = {
    createdAt: Date;
    updatedAt: Date;
}