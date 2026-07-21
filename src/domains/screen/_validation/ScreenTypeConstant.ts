/**
 * @fileoverview Centralized source of truth for supported cinema screen technologies.
 * Defines the available technological formats and luxury classifications used
 * across Screen models, snapshots, and validation schemas.
 */

/**
 * Constant array defining the diverse array of technological and service-level
 * screen formats supported by the platform.
 */
export const ScreenTypeConstant = [
    "2D",
    "3D",
    "IMAX",
    "4DX",
    "Dolby Cinema",
    "ScreenX",
    "Drive-In",
    "VIP",
    "D-Box",
    "Onyx LED",
    "Classic",
    "PLF",
] as const;