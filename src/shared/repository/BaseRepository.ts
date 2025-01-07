import {type Model, Types} from "mongoose";
import createHttpError from "http-errors";

interface IBaseRepositoryConstructor<T> {
    model: Model<T>;
    populateRefs: string[];
}

export default class BaseRepository<T> {
    private readonly model: Model<T>;
    private readonly populateRefs: string[];

    constructor({model, populateRefs = []}: IBaseRepositoryConstructor<T>) {
        this.model = model;
        this.populateRefs = populateRefs;
    }

    async count(params?: { filters?: Record<string, unknown> }): Promise<number> {
        const {filters = {}} = params || {};
        return this.model
            .countDocuments(filters);
    }

    async find(params?: { filters?: Record<string, unknown> }): Promise<any> {
        const {filters = {}} = params || {};
        return this.model
            .find(filters)
            .populate(this.populateRefs)
            .lean();
    }

    async findById({_id}: { _id: Types.ObjectId | string }): Promise<any> {
        return this.model
            .findById(_id)
            .populate(this.populateRefs)
            .lean();
    }

    async exists404({_id}: { _id: Types.ObjectId | string }): Promise<any> {
        const doc = await this.model.findById(_id).populate(this.populateRefs);
        if (!doc) throw createHttpError(404, 'Not found!');
        return doc;
    }

    async exists404Lean({_id}: { _id: Types.ObjectId | string }): Promise<any> {
        const doc = await this.model.findById(_id).populate(this.populateRefs).lean();
        if (!doc) throw createHttpError(404, 'Not found!');
        return doc;
    }

    async create({data}: { data: Partial<T> }): Promise<any> {
        return this.model
            .create(data);
    }

    async update({_id, data}: { _id: Types.ObjectId | string, data: Partial<T> }): Promise<any> {
        const doc = await this.exists404({_id});
        await doc.updateOne({_id}, data);
        return this.exists404Lean({_id});
    }

    async destroy({_id}: { _id: Types.ObjectId | string }): Promise<any> {
        const doc = await this.exists404({_id});
        await doc.deleteOne();
    }

    async paginate(
        params?: {
            page?: number,
            perPage?: number,
            sort?: Record<string, any>,
            filters?: Record<string, any>,
        }
    ) {
        const {page = 1, perPage = 100, filters = {}, sort = {}} = params || {};
        return this.model
            .find(filters)
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate(this.populateRefs)
            .lean();
    }
}