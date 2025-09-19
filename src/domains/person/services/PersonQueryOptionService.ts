import type { Request } from "express";
import { PersonQueryFiltersSchema } from "../schema/query/PersonFilters.schema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import { type FilterQuery, type SortOrder } from "mongoose";
import type { PersonQueryFilters, PersonQueryOptions } from "../schema/query/PersonFilters.types.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type { IPerson } from "../interfaces/IPerson.js";
import type IQueryOptionService from "../../../shared/interfaces/IQueryOptionService.js";

/**
 * Service for handling query options related to {@link IPerson}.
 *
 * Implements {@link IQueryOptionService} specifically for the Person model.
 * Responsibilities include:
 * - Parsing and validating URL query parameters
 * - Converting query options into Mongoose-compatible `$match` filters
 * - Converting query options into Mongoose-compatible sort specifications
 *
 * @example
 * ```ts
 * const service = new PersonQueryOptionService();
 *
 * // Extract and validate query params
 * const options = service.fetchQueryParams(req);
 * // => { name: "John", nationality: "US", sortByName: 1 }
 *
 * // Generate filters
 * const filters = service.generateMatchFilters(options);
 * // => { name: { $regex: "John", $options: "i" }, nationality: "US" }
 *
 * // Generate sorts
 * const sorts = service.generateQuerySorts(options);
 * // => { name: 1, nationality: 1 }
 * ```
 */
export default class PersonQueryOptionService
    implements IQueryOptionService<IPerson, PersonQueryOptions, PersonQueryFilters>
{
    /**
     * Extracts and validates query parameters from an Express request.
     *
     * Uses {@link PersonQueryFiltersSchema} for validation and throws
     * {@link ZodParseError} if validation fails.
     *
     * @param req - The incoming Express request
     * @returns A validated {@link PersonQueryOptions} object
     *
     * @example
     * // ?name=John&nationality=US
     * // Returns: { name: "John", nationality: "US" }
     */
    fetchQueryParams(req: Request): PersonQueryFilters {
        const { success, data, error } = PersonQueryFiltersSchema.safeParse(req.query);

        if (!success) {
            const message = "Invalid Query Parameters.";
            throw new ZodParseError({ message, errors: error.errors });
        }

        return data;
    }

    /**
     * Generates a Mongoose `$match` filter query from validated query options.
     *
     * - `name` is converted to a case-insensitive regex match
     * - `nationality` is included as-is if provided
     * - `_id` is included as-is if provided
     *
     * @param queries - Validated query options
     * @returns A {@link FilterQuery} usable in `Model.find()`
     *
     * @example
     * // { name: "John", nationality: "US" }
     * // => { name: { $regex: "John", $options: "i" }, nationality: "US" }
     */
    generateMatchFilters(queries: PersonQueryOptions): FilterQuery<PersonQueryFilters> {
        const { _id, name, nationality } = queries;

        const filters = {
            _id,
            nationality,
            ...(name && { name: { $regex: name, $options: "i" } }),
        };

        return filterNullArray(filters);
    }

    /**
     * Generates a Mongoose sort specification from validated query options.
     *
     * - `sortByName` sorts results by the `name` field
     * - `sortByNationality` sorts results by the `nationality` field
     *
     * @param queries - Validated query options
     * @returns A partial mapping of {@link IPerson} keys to {@link SortOrder}
     *
     * @example
     * // { sortByName: 1, sortByNationality: -1 }
     * // => { name: 1, nationality: -1 }
     */
    generateQuerySorts(queries: PersonQueryOptions): Partial<Record<keyof IPerson, SortOrder>> {
        const { sortByName, sortByNationality } = queries;
        const sorts = { name: sortByName, nationality: sortByNationality };
        return filterNullArray(sorts);
    }
}
