/**
 * Supported HTTP methods for base routes.
 */
export type BaseRouteMethods =
    | "get"
    | "post"
    | "put"
    | "patch"
    | "delete";

/**
 * Logical identifiers for standard CRUD routes.
 *
 * Used to:
 * - Register routes
 * - Apply middleware selectively
 * - Exclude routes at creation time
 */
export type BaseRoutePathKeys =
    | "all"
    | "paginated"
    | "create"
    | "get"
    | "slug"
    | "update"
    | "delete"
    | "query";
