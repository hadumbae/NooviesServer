/**
 * @fileoverview Defines the structure for paginated response data.
 */

/** Represents a paginated result set containing a list of items and the total count. */
export type PaginationReturns<TItem> = {
    totalItems: number;
    items: TItem[];
};
