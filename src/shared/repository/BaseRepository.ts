import {type Model, Types} from "mongoose";
import createHttpError from "http-errors";

interface IBaseRepositoryConstructor<T> {
    model: Model<T>;
    populateRefs: string[];
}

export default class BaseRepository<T> {
    private readonly model: Model<T>;
    private readonly populateRefs: string[];

    constructor(
        {model, populateRefs = []}: IBaseRepositoryConstructor<T>
    ) {
        this.model = model;
        this.populateRefs = populateRefs;
    }

    async count(
        params?: {filters?: Record<string, unknown>}
    ): Promise<number> {
        const {filters = {}} = params || {};
        return this.model
            .countDocuments(filters);
    }

    async find(
        params?: {filters?: Record<string, unknown>}
    ): Promise<any> {
        const {filters = {}} = params || {};

        return this.model
            .find(filters)
            .populate(this.populateRefs)
            .lean();
    }

    async findOne(
        params?: {filters?: Record<string, unknown>}
    ): Promise<any> {
        const {filters = {}} = params || {};
        return this.model
            .findOne(filters)
            .lean();
    }

    async findById(
        params: {_id: Types.ObjectId | string}
    ): Promise<any> {
        const {_id} = params;
        return this.model
            .findById(_id)
            .lean();
    }

    async exists404(
        params: {_id: Types.ObjectId | string}
    ): Promise<any> {
        const {_id} = params;
        const doc = await this.model.findById(_id).lean();
        if (!doc) throw createHttpError(404, 'Not found!');
        return doc;
    }

    async create(
        params: {data: Partial<T>}
    ): Promise<any> {
        const {data} = params;
        return this.model
            .create(data);
    }

    async findByIdAndUpdate(
        params: {_id: Types.ObjectId | string, data: Partial<T>}
    ): Promise<any> {
        const {_id, data} = params;
        return this.model
            .findByIdAndUpdate(_id, data, { new: true })
            .lean();
    }

    async findByIdAndDelete(
        params: {_id: Types.ObjectId | string}
    ): Promise<any> {
        const {_id} = params;
        return this.model
            .findByIdAndDelete(_id)
            .lean();
    }

    async paginate(
        params?: {
            page?: number,
            perPage?: number,
            sort?: Record<string, any>,
            filters?: Record<string, any>,
        }
    ) {
        const { page = 1, perPage = 100, filters = {}, sort = {} } = params || {};
        return this.model
            .find(filters)
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .lean();
    }
}