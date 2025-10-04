/**
 * Broad role categories for behind-the-scenes crew.
 *
 * @remarks
 * These categories represent high-level groupings of common
 * crew responsibilities. Individual job titles (e.g.
 * `"Executive Producer"`, `"Unit Production Manager"`,
 * `"Key Grip"`) are stored in the free-text `roleName`
 * field but should map to one of these categories.
 */
const RoleTypeCrewCategoryConstant = [
    /** Producers of any level (executive, associate, line, etc.). */
    "Producer",

    /** Directors and assistant directors. */
    "Director",

    /** Writers of screenplay, teleplay, story, or adaptation. */
    "Writer",

    /** Cinematography and camera operation (DoP, operator). */
    "Cinematography",

    /** Editing and assembly of picture. */
    "Editing",

    /** Sound design, mixing, ADR, and Foley. */
    "Sound",

    /** Music composition, soundtrack, or score. */
    "Music",

    /** Art department, including set design and decoration. */
    "Art Department",

    /** Costume design, wardrobe, and related roles. */
    "Costume & Wardrobe",

    /** Makeup artists and hairstylists. */
    "Makeup & Hair",

    /** Computer-generated imagery and digital effects. */
    "Visual Effects",

    /** Practical and mechanical effects created on set. */
    "Special Effects",

    /** Stunt coordination and choreography. */
    "Stunts",

    /** Production management, coordinators, assistants. */
    "Production",

    /** Camera crew, electrical, grips, gaffers. */
    "Camera & Electrical",

    /** Casting directors and assistants. */
    "Casting",

    /** Post-production supervision, colorists, finishing. */
    "Post-Production",

    /** Miscellaneous or uncategorized crew roles. */
    "Other",
] as const;

export default RoleTypeCrewCategoryConstant;
