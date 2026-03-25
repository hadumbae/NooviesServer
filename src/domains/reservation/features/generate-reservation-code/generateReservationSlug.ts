/**
 * @file Utility for generating SEO-friendly slugs for Reservation entities based on movie metadata.
 * @filename generateReservationSlug.ts
 */

import {Types} from "mongoose";
import Showing from "../../../showing/models/showing/Showing.model.js";
import generateSlug from "../../../../shared/utility/generateSlug.js";
import type {MovieSchemaFields} from "../../../movie/model/Movie.types.js";
import type {SlugString} from "../../../../shared/schema/strings/SlugStringSchema.js";

/**
 * Resolves a Reservation slug by looking up the Movie title associated with a given Showing.
 * * * **Relational Lookup:** Queries the `Showing` collection and populates the nested `Movie`
 * document to retrieve the source title.
 * * **Transformation:** Passes the movie title through {@link generateSlug} to ensure
 * a URL-safe, kebab-case string.
 * * **Data Safety:** Returns `null` if the showing or its associated movie cannot be found,
 * allowing the caller to handle validation failures gracefully.
 * * @param showingID - The MongoDB {@link Types.ObjectId} of the showing to reference.
 * @returns {Promise<SlugString | null>} A validated slug string or null if the lookup fails.
 * * @example
 * ```ts
 * const slug = await generateReservationSlug(new Types.ObjectId("..."));
 * if (slug) doc.slug = slug;
 * ```
 */
export async function generateReservationSlug(showingID: Types.ObjectId): Promise<SlugString | null> {
    const showing = await Showing
        .findById(showingID)
        .select("movie")
        .populate("movie")
        .lean();

    if (!showing) {
        return null;
    }

    /** Casts the populated movie to access its title for slug generation. */
    return generateSlug((showing.movie as unknown as MovieSchemaFields).title);
}