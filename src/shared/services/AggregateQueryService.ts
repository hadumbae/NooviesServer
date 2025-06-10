import type {
    AggregateServiceCountParams,
    AggregateServiceGenerateParams,
    AggregateServiceQueryParams
} from "../types/services/AggregateQueryServiceTypes.js";
import type {Model, PipelineStage} from "mongoose";

interface IAggregateQueryService<TSchema = Record<string, any>, TMatchFilters = any> {
    fetchAggregateParams(params: AggregateServiceGenerateParams<TMatchFilters>): AggregateServiceQueryParams<TSchema>;
}

export default class AggregateQueryService<TSchema = Record<string, any>, TMatchFilters = any> implements IAggregateQueryService<TSchema, TMatchFilters> {
    private readonly _model: Model<TSchema>;

    constructor({_model}: {_model: Model<TSchema>}) {
        this._model = _model;
    }

    fetchAggregateParams(params: AggregateServiceGenerateParams): AggregateServiceQueryParams {
        const {paginated = false, populate = false, page, perPage, ...additionalParams} = params;
        const baseParams = {populate, ...additionalParams};

        if (paginated) {
            return {
                ...baseParams,
                paginated: true,
                page: page!,
                perPage: perPage!
            };
        }

        return baseParams;
    }

    async aggregate(params: AggregateServiceQueryParams): Promise<any> {
        const {
            matchFilters,
            populateFilters,
            limit,
            paginated = false,
            page,
            perPage,
            populatePipelines = [],
            populate = false,
        } = params;

        const pipeline: PipelineStage[] = [];

        pipeline.push({$match: matchFilters});
        pipeline.push(...populateFilters);

        if (paginated) {
            pipeline.push({$skip: (page! - 1) * perPage!});
            pipeline.push({$limit: perPage!});
        }

        if (!paginated && typeof limit === "number") pipeline.push({$limit: limit});
        if (populate) pipeline.push(...populatePipelines);

        return this._model.aggregate(pipeline).exec();
    }

    async count(params: AggregateServiceCountParams): Promise<number> {
        const {matchFilters, populateFilters} = params;

        const pipeline: PipelineStage[] = [];

        if (matchFilters) pipeline.push({$match: matchFilters});
        if (populateFilters) pipeline.push(...populateFilters);
        pipeline.push({$count: "docCount"});

        const aggregate = await this._model.aggregate(pipeline);

        return aggregate[0]?.docCount ?? 0;
    }
}