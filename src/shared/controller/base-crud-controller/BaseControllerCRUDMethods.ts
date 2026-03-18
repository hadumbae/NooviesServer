/**
 * @file Base CRUD controller contracts.
 * BaseControllerCRUDMethods.ts
 */

import type {Request, Response} from "express";
import type {BaseConstructorParams} from "../BaseController.js";
import type {BaseRepository} from "../../repository/BaseRepository.js";
import type AggregateQueryService from "../../services/aggregate/AggregateQueryService.js";
import type {QueryOptionTypes} from "../../types/query-options/QueryOptionService.types.js";
import type {ModelObject} from "../../types/ModelObject.js";
import {Types} from "mongoose";

/**
 * Required CRUD and query interface for controllers.
 */
export interface BaseControllerCRUDMethods<
    TSchema extends ModelObject = { _id: Types.ObjectId },
    TMatchFilters = unknown
> {
    all(req: Request, res: Response): Promise<Response>;

    paginated(req: Request, res: Response): Promise<Response>;

    create(req: Request, res: Response): Promise<Response>;

    get(req: Request, res: Response): Promise<Response>;

    getBySlug(req: Request, res: Response): Promise<Response>;

    update(req: Request, res: Response): Promise<Response>;

    delete(req: Request, res: Response): Promise<Response>;

    query(req: Request, res: Response): Promise<Response>;

    fetchQueryOptions(req: Request): QueryOptionTypes<TSchema, TMatchFilters>;
}

/**
 * Constructor parameters for CRUD controllers.
 */
export type BaseCRUDControllerConstructorParams<TSchema extends ModelObject> = BaseConstructorParams & {
    repository: BaseRepository<TSchema>;
    aggregateService: AggregateQueryService<TSchema>;
};