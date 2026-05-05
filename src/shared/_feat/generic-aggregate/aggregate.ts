/**
 * @fileoverview Controller factory for standardized MongoDB aggregations.
 * Generates an Express request handler that integrates request options,
 * pre-validated query filters, and custom aggregation pipelines.
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Model, PipelineStage} from "mongoose";
import {fetchRequestOptions} from "@shared/_feat/fetch-request-options/utils";
import type {Request, Response} from "express";
import {aggregateQuery} from "@shared/_feat/generic-aggregate/aggregateQuery";
import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";

type FactoryConfig<TSchema extends BaseModel> = {
    model: Model<TSchema>;
    populationPipelines?: PipelineStage[];
    virtualsPipelines?: PipelineStage[];
};

/**
 * Creates an Express middleware/handler for performing complex aggregations.
 */
export function aggregate<TSchema extends BaseModel>(
    {model, populationPipelines, virtualsPipelines}: FactoryConfig<TSchema>
): ControllerAsyncFunc {
    return async (req: Request, res: Response): Promise<Response> => {
        const options = fetchRequestOptions(req);
        const match = req.queryMatchStage;
        const sort = req.querySortStage;

        const data = await aggregateQuery({
            model,
            match,
            sort,
            options,
            populationPipelines,
            virtualsPipelines,
        });

        return res.status(200).json(data);
    };
}