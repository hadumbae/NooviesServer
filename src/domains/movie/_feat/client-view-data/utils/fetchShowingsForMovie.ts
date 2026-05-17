/**
 * @fileoverview Utility for fetching and filtering movie showings based on location and pagination.
 */

import {type FilterQuery, Types} from "mongoose";
import type {NonNegativeNumber} from "@/schema/numbers/NonNegativeNumberSchema";
import type {DocumentType} from "@/types/mongoose/DocumentType";
import type {PositiveInteger} from "@/schema/numbers/PositiveIntegerSchema";
import type {ISO3166Alpha2CountryCode} from "@/schema/enums/ISO3166Alpha2CountryCodeSchema";
import type {ShowingSchemaFields} from "@domains/showing/models/showing/Showing.types";
import {generateFuzzyRegexPattern} from "@/utility/regex/generateFuzzyRegexPattern";
import Showing from "@domains/showing/models/showing/Showing.model";
import {ShowingPopulationPipelines} from "@domains/showing/queries/ShowingPopulationPipelines";

/** Parameters for the fetchShowingsForMovie function. */
export type FetchShowingsForMovieConfig = {
    movieID: Types.ObjectId;
    queries: {
        page: PositiveInteger;
        perPage: PositiveInteger;
        country: ISO3166Alpha2CountryCode;
        near?: string;
    };
};

/** The paginated result set of showing documents. */
export type PaginatedShowingsForMovie = {
    totalItems: NonNegativeNumber;
    items: DocumentType<ShowingSchemaFields>[];
};

/** Retrieves a paginated list of active scheduled showings for a movie filtered by location. */
export async function fetchShowingsForMovie(
    {movieID, queries: {page, perPage, country, near}}: FetchShowingsForMovieConfig
): Promise<PaginatedShowingsForMovie> {
    const matchStage: FilterQuery<ShowingSchemaFields> = {
        movie: movieID,
        status: "SCHEDULED",
        "config.isActive": true,
        "location.country": country,
    };

    if (near) {
        const locSearchRegex = {
            $regex: generateFuzzyRegexPattern(near),
            $options: "i",
        };

        matchStage.$or = [
            {"location.city": locSearchRegex},
            {"location.state": locSearchRegex},
            {"location.postalCode": locSearchRegex},
        ];
    }

    const [result] = await Showing.aggregate<PaginatedShowingsForMovie>([
        {
            $match: matchStage
        },
        {
            $facet: {
                totalCount: [
                    {$count: "count"}
                ],
                items: [
                    {$skip: perPage * (page - 1)},
                    {$limit: perPage},
                    {$sort: {startTime: -1}},
                    ...ShowingPopulationPipelines,
                ],
            }
        },
        {
            $project: {
                items: 1,
                totalItems: {
                    $ifNull: [
                        {$arrayElemAt: ["$totalCount.count", 0]},
                        0
                    ],
                },
            }
        },
    ]);

    return result;
}