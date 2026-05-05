/**
 * @fileoverview Type definitions for MongoDB aggregation pipeline segments and configuration.
 * Provides a structured way to define filters, sorts, and population logic for
 * complex Mongoose aggregation queries.
 */

import type {Model, PipelineStage} from "mongoose";
import type {BaseModel} from "@shared/types/schema/BaseModel";

/**
 * Standard query components for a top-level model aggregation.
 */
export type AggregateModelQueries = {
    filters?: PipelineStage.Match;
    sorts?: PipelineStage.Sort;
};

/**
 * Complex query segments for nested or referenced aggregations.
 */
export type AggregateReferenceQueries = {
    filters?: PipelineStage[];
    sorts?: PipelineStage[];
};

/**
 * Base configuration for executing a standardized aggregation pipeline.
 */
export type AggregateBaseConfig<TSchema extends BaseModel> = {
    model: Model<TSchema>;
    match?: PipelineStage.Match;
    sort?: PipelineStage.Sort;
    reference?: AggregateReferenceQueries;
    populationPipelines?: PipelineStage[];
    virtualsPipelines?: PipelineStage[];
};