/**
 * @fileoverview Re-exports factory-generated image remover functions for movie posters and banners.
 */

import {createMovieImageRemover} from "@/domains/movies/_feat/manage-image/remove-image/factory";

/** Removes a movie's poster image from Cloudinary and clears its reference in the database. */
export const removeMoviePosterImage = createMovieImageRemover({key: "posterImage"});

/** Removes a movie's banner image from Cloudinary and clears its reference in the database. */
export const removeMovieBannerImage = createMovieImageRemover({key: "bannerImage"});