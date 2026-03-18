/**
 * @file Utility for generating fuzzy regex patterns.
 * @filename generateFuzzyRegexPattern.ts
 */

/**
 * Escapes regex characters and replaces whitespace with `.*`
 * to allow flexible matching between terms.
 *
 * Returns an empty string when input is nullish.
 */
export function generateFuzzyRegexPattern(searchString?: string | null): string {
    if (!searchString) {
        return "";
    }

    const escaped = searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(/\s+/g, '.*');
}