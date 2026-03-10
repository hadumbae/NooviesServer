/**
 * @file Defines default population paths for movie queries.
 * @filename MoviePopulatePaths.ts
 */

import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";

/**
 * Population paths applied when resolving movie relations.
 */
const MoviePopulatePaths: PopulatePath[] = [
    {path: "genres"},
];

export {
    MoviePopulatePaths,
}