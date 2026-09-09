import {type PipelineStage, Types} from "mongoose";
import type {AggregateQueryOptions} from "@/shared/_feat/generic-aggregate/optionTypes";
import type {UserStatus} from "@/domains/users/validation/fields/UserStatusSchema";

declare module "express" {
    export interface Request {
        authUserID?: Types.ObjectId;
        authUserAdmin?: boolean;
        authUserStatus?: UserStatus;

        validatedBody?: any;
        validatedParams?: Record<any, any>;
        validatedQuery?: Record<any, any>;
        validatedFiles?: [];

        unsetFields?: any;

        queryOptions?: AggregateQueryOptions;

        queryMatchStage?: PipelineStage.Match;
        querySortStage?: PipelineStage.Sort;

        queryFilters?: Record<string, unknown>;
        querySorts?: Record<string, 1 | -1>;

        parsedParams?: unknown;
        parsedConfig?: unknown;
    }
}