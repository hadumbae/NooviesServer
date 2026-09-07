/**
 * @fileoverview Re-exports factory-generated image uploader functions for movie posters and banners.
 */

import {createMovieImageUploader} from "@/domains/movies/_feat/manage-image/update-image/factory";

/** Replaces a movie's poster image with a new upload and removes the existing asset. */
export const updateMoviePosterImage = createMovieImageUploader({key: "posterImage"});

/** Replaces a movie's banner image with a new upload and removes the existing asset. */
export const updateMovieBannerImage = createMovieImageUploader({key: "bannerImage"});