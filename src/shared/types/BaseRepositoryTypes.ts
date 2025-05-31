import {type FilterQuery, type SortOrder, Types} from "mongoose";
import type {PopulatePath} from "./PopulatePath.js";

export type BaseRepositoryCountParams<TSchema = Record<string, any>> = {
    filters?: Record<string, unknown>,
};

export type BaseRepositoryFindParams<TSchema = Record<string, any>> = {
    filters?: FilterQuery<TSchema>,
    populatePath?: PopulatePath[],
    populate?: boolean,
    virtuals?: boolean,
};

export type BaseRepositoryFindByIDParams = {
    _id: Types.ObjectId,
    virtuals?: boolean,
    populate?: boolean,
    populatePath?: PopulatePath[],
}

export type BaseRepositoryCreateParams<TSchema = Record<string, any>> = {
    data: Partial<TSchema>,
    populatePath?: PopulatePath[],
    populate?: boolean,
    virtuals?: boolean,
};

export type BaseRepositoryUpdateParams<TSchema = Record<string, any>> = {
    _id: Types.ObjectId,
    data: Partial<TSchema>,
    populatePath?: string[],
    populate?: boolean,
    virtuals?: boolean,
}

export type BaseRepositoryDestroyParams = {
    _id: Types.ObjectId | string,
}

export type BaseRepositoryPaginationParams<TSchema = Record<string, any>> = {
    page: number,
    perPage: number,
    sort?: string | [string, SortOrder][] | Record<string, SortOrder>,
    filters?: FilterQuery<TSchema>,
    populatePath?: string[],
    populate?: boolean,
    virtuals?: boolean,
}