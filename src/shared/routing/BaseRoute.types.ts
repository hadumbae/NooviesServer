/**
 * @file Type definitions for route generation logic.
 * @filename BaseRoute.types.ts
 */

/**
 * Supported HTTP methods for standard CRUD operations.
 */
export type BaseRouteMethods =
    | "get"
    | "post"
    | "put"
    | "patch"
    | "delete";

/**
 * Identifiers for standard endpoints.
 * Used for selective middleware application and route exclusion in {@link createBaseRoutes}.
 */
export type BaseRoutePathKeys =
    | "all"
    | "paginated"
    | "create"
    | "get"
    | "slug"
    | "update"
    | "delete"
    | "soft-delete"
    | "query";