/**
 * List of valid department types for movie roles.
 *
 * - "CREW": Technical and production staff (e.g. director, cinematographer).
 * - "CAST": On-screen performers (e.g. actors, extras).
 *
 * This constant is used as the single source of truth for valid department values
 * and is referenced in both Zod schemas and TypeScript types.
 */
export default [
    "CREW",
    "CAST",
] as const;