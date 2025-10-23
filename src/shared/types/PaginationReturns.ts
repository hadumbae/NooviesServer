/**
 * Represents the return value of a paginated query.
 *
 * @template TItem - Type of the items contained in the page.
 */
export type PaginationReturns<TItem> = {
    /** Total number of items matching the query (ignores pagination limits). */
    totalItems: number;
    /** Array of items for the current page. */
    items: TItem[];
};
