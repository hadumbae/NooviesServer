/**
 * @file Utility for generating secure, URL-friendly unique identifiers using a custom alphabet.
 * @filename generateNanoID.ts
 */

import {customAlphabet} from "nanoid";

/**
 * Configuration parameters for the NanoID generator.
 */
type NanoParams = {
    /**
     * The total character count of the generated ID.
     */
    length: number;
    /**
     * An optional string of characters to use for the ID.
     */
    alphabet?: string;
}

/**
 * Creates a customized NanoID generator function based on the provided alphabet and length.
 * @param params - The length and character set configuration.
 * @returns A function that, when called, returns a unique string ID.
 */
export function generateNanoID(params: NanoParams) {
    const {
        length,
        alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
    } = params;

    return customAlphabet(alphabet, length);
}