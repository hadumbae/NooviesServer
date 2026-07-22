import type {Request} from "express";
import {
    type ShowingQueryMatchFilters,
    type ShowingQueryOptions,
    ShowingQueryOptionSchema
} from "@/domains/showing/_feat/validate-query";
import {RequestValidationError} from "@/shared/errors/RequestValidationError";
import type {FilterQuery} from "mongoose";
import filterNullishAttributes from "../../../../shared/utility/filterNullishAttributes.js";
import type {QueryOptionTypes, SortQuery} from "@/shared/types/query-options/QueryOptionService.types";
import type {LookupMatchStageOptions} from "@/shared/_types/mongoose/LookupMatchStageOptions";
import generateReferenceFilterPipelineStages from "@/shared/utility/mongoose/generateReferenceFilterPipelineStages.js";
import type {ShowingSchemaFields} from "../../models/showing/Showing.types.js";
import type IReferenceQueryOptionService from "@/shared/types/query-options/IReferenceQueryOptionService.js";


export default class ShowingQueryOptionService
    implements IReferenceQueryOptionService<ShowingSchemaFields, ShowingQueryOptions, ShowingQueryMatchFilters> {

    fetchQueryParams(req: Request): ShowingQueryOptions {
        const {data, success, error} = ShowingQueryOptionSchema.safeParse(req.query);

        if (!success) {
            throw new RequestValidationError({
                errors: error?.errors,
                raw: req.query,
                message: "Invalid Showing Query.",
            });
        }

        return data;
    }

    generateMatchFilters(options: ShowingQueryOptions): FilterQuery<ShowingQueryMatchFilters> {
        return filterNullishAttributes({
            movie: options.movie,
            theatre: options.theatre,
            screen: options.screen,
            ticketPrice: options.ticketPrice,
            status: options.status,
            "config.isSpecialEvent": options.isSpecialEvent,
            "config.isActive": options.isActive,
        });
    }

    generateMatchSorts(options: ShowingQueryOptions): SortQuery<ShowingSchemaFields> {
        return filterNullishAttributes({
            startTime: options.sortByStartTime,
            endTime: options.sortByEndTime,
        });
    }

    generateReferenceFilters(options: ShowingQueryOptions): ReferenceFilterPipelineStages {
        const {
            movieSlug,
            screenSlug,
            theatreSlug,
            theatreState,
            theatreCity,
            theatreCountry,
        } = options;

        const stages: LookupMatchStageOptions[] = [
            {
                from: "movies",
                localField: "movie",
                foreignField: "_id",
                as: "showingMovie",
                filters: filterNullishAttributes({
                    slug: movieSlug,
                }),
            },
            {
                from: "theatres",
                localField: "theatre",
                foreignField: "_id",
                as: "showingTheatre",
                filters: filterNullishAttributes({
                    slug: theatreSlug,
                    "location.state": theatreState,
                    "location.city": theatreCity,
                    "location.country": theatreCountry,
                }),
            },
            {
                from: "screens",
                localField: "screen",
                foreignField: "_id",
                as: "showingScreen",
                filters: filterNullishAttributes({
                    slug: screenSlug,
                }),
            },
        ];

        return generateReferenceFilterPipelineStages({stages});
    }

    generateReferenceSorts(options: ShowingQueryOptions): ReferenceSortPipelineStages {
        return [];
    }

    generateQueryOptions(options: ShowingQueryOptions): QueryOptionTypes<ShowingSchemaFields, ShowingQueryMatchFilters> {
        return {
            match: {
                filters: this.generateMatchFilters(options),
                sorts: this.generateMatchSorts(options),
            },
            reference: {
                filters: this.generateReferenceFilters(options),
                sorts: this.generateReferenceSorts(options),
            },
        };
    }
}
