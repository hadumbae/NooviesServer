/**
 * @file Interface contracts and parameter types for CRUD controllers.
 * @filename BaseControllerCRUDMethods.ts
 */

import type {Request, Response} from "express";
import type {BaseConstructorParams} from "../BaseController.js";
import type {BaseRepository} from "../../repository/BaseRepository.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {ModelObject} from "../../types/ModelObject.js";
import {Types} from "mongoose";

/**
 * Interface defining the standard set of CRUD and Query handlers.
 * * @template TSchema - The model structure.
 * @template TMatchFilters - Valid filter keys for the aggregate query.
 */
export interface BaseControllerCRUDMethods<
    TSchema extends ModelObject = { _id: Types.ObjectId },
    TMatchFilters = unknown
> {
    /** GET /all */
    all(req: Request, res: Response): Promise<Response>;

    /** GET / (paginated) */
    paginated(req: Request, res: Response): Promise<Response>;

    /** POST / */
    create(req: Request, res: Response): Promise<Response>;

    /** GET /:_id */
    get(req: Request, res: Response): Promise<Response>;

    /** GET /slug/:slug */
    getBySlug(req: Request, res: Response): Promise<Response>;

    /** PATCH /:_id */
    update(req: Request, res: Response): Promise<Response>;

    /** DELETE /:_id (Permanent) */
    delete(req: Request, res: Response): Promise<Response>;

    /** PATCH /:_id/soft-delete */
    softDelete(req: Request, res: Response): Promise<Response>;

    /** GET /query (Aggregation) */
    query(req: Request, res: Response): Promise<Response>;

    /** Metadata builder for {@link query}. */
    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters>;
}

/**
 * Parameters for initializing a {@link BaseCRUDController}.
 */
export type BaseCRUDControllerConstructorParams<TSchema extends ModelObject> = BaseConstructorParams & {
    /** The persistence layer for the entity. */
    repository: BaseRepository<TSchema>;
    /** The aggregation service for the entity. */
    aggregateService: AggregateQueryService<TSchema>;
};