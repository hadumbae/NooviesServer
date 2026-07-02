/**
 * @fileoverview Defines the handler type for managing duplicate database index errors.
 */

/** Callback function to handle errors when a unique index constraint is violated. */
export type DuplicateIndexHandler = (indexString: string) => void | never;