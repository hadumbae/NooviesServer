/**
 * @fileoverview Type definitions for the movie client view data service.
 */

import {Types} from "mongoose";
import type {PositiveInteger} from "@shared/schema/numbers/PositiveIntegerSchema";
import type {ISO3166Alpha2CountryCode} from "@shared/schema/enums/ISO3166Alpha2CountryCodeSchema";
import type {NonNegativeNumber} from "@shared/schema/numbers/NonNegativeNumberSchema";
import type {DocumentType} from "@shared/types/mongoose/DocumentType";
import type {ShowingSchemaFields} from "@domains/showing/models/showing/Showing.types";
import type {RoleTypeCastCategory, RoleTypeCrewCategory} from "@domains/roleType/schemas/RoleTypeCategory.types";
import type {IMovieCredit} from "@domains/movieCredit/models/MovieCredit.interface";
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";
import type {MovieSchemaFields} from "@domains/movie/model/movie";
import type {ReviewDetailsByMovieReturns} from "@domains/movie/_feat/fetch-reviews-by-movie";

/** Represents movie credits grouped by their specific role category. */
export type CategoryGroupedCredits = {
    category: RoleTypeCastCategory | RoleTypeCrewCategory;
    credits: IMovieCredit[];
    totalCredits: number;
}

/** Structure for movie credits separated into cast and categorized crew groups. */
export type GroupedCreditsForMovieData = {
    castCredits: IMovieCredit[];
    crewCredits: CategoryGroupedCredits[];
}

/** Parameters for fetching movie showings based on location and pagination. */
export type FetchShowingsForMovieParams = {
    movieID: Types.ObjectId;
    queries: {
        page: PositiveInteger;
        perPage: PositiveInteger;
        country: ISO3166Alpha2CountryCode;
        near?: string;
    };
};

/** The paginated result set of showing documents for a specific movie. */
export type FetchShowingsForMovieReturns = {
    totalItems: NonNegativeNumber;
    items: DocumentType<ShowingSchemaFields>[];
};

/** Configuration parameters for fetching movie information view data. */
export type FetchMovieInfoOverviewViewDataConfig = {
    slug: SlugString;
    userID: Types.ObjectId;
    reviewPage: PositiveInteger;
    reviewPerPage: PositiveInteger;
}

/** The composite data structure returned for the movie information view. */
export type MovieInfoOverviewViewData = {
    movie: MovieSchemaFields;
    credits: IMovieCredit[];
    reviews: ReviewDetailsByMovieReturns;
}