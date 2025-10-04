/**
 * Broad role categories for on-screen performers.
 *
 * @remarks
 * Used to group different kinds of cast roles under a shared
 * category. This allows more detailed role names
 * (e.g. `"Lead Actor"`, `"Supporting Actor"`, `"Executive Cameo"`)
 * while still normalizing them into broad categories for
 * filtering and querying.
 */
const RoleTypeCastCategoryConstant = [
    /** General acting roles (lead, supporting, ensemble). */
    "Actor",

    /** Performers providing character voices (dubbing, animation, ADR). */
    "Voice Actor",

    /** Cast performing physical stunt work on screen. */
    "Stunt Performer",

    /** Special or brief appearances, often notable figures. */
    "Cameo",

    /** Background roles without lines; sometimes called "extras." */
    "Extra",

    /** Appearing as themselves (documentary, interview, meta roles). */
    "Self",

    /** Roles performed through motion/performance capture technology. */
    "Motion Capture",
] as const;

export default RoleTypeCastCategoryConstant;

