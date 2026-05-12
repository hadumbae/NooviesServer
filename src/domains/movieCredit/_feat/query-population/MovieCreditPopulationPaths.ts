/**
 * @fileoverview Defines the Mongoose population paths for MovieCredit documents.
 */
import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";

/** Population configuration for MovieCredit relations including role, person, and movie details. */
export const MovieCreditPopulationPaths: PopulatePath[] = [
    {path: "roleType"},
    {path: "person"},
    {path: "movie", populate: {path: "genres"}},
]