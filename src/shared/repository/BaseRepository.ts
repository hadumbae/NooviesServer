import {type Model, Types} from "mongoose";
import createHttpError from "http-errors";
import type {PopulatePath} from "../types/PopulatePath.js";

interface IBaseRepositoryConstructor<T> {
    model: Model<T>;
    populateRefs: PopulatePath[];
}

export default class BaseRepository<T> {
    private readonly model: Model<T>;
    private readonly populateRefs: PopulatePath[];

    constructor({model, populateRefs = []}: IBaseRepositoryConstructor<T>) {
        this.model = model;
        this.populateRefs = populateRefs;
    }

    async count(params?: { filters?: Record<string, unknown> }): Promise<number> {
        const {filters = {}} = params || {};
        return this.model
            .countDocuments(filters);
    }

    async find(
        params?: { filters?: Record<string, unknown>, populatePath?: PopulatePath[], populate?: boolean, lean?: boolean }
    ): Promise<any> {
        const {populate = false, lean = false, filters = {}, populatePath} = params || {};

        const query = this.model.find(filters);

        if (populate) query.populate(populatePath || this.populateRefs);
        if (lean) query.lean();

        return query;
    }

    async findById(
        params: { _id: Types.ObjectId | string, lean?: boolean, populate?: boolean, populatePath?: PopulatePath[] }
    ): Promise<any> {
        const {_id, populatePath, populate = false, lean = false} = params;
        const query = this.model.findById(_id);

        if (populate) query.populate(populatePath || this.populateRefs);
        if (lean) query.lean();

        return query;
    }

    async exists404(
        params: { _id: Types.ObjectId | string, populatePath?: PopulatePath[], populate?: boolean, lean?: boolean }
    ): Promise<any> {
        const {_id, populatePath, populate = false, lean = false} = params;
        let query = this.model.findById(_id);

        if (populate) query.populate(populatePath || this.populateRefs);
        if (lean) query.lean();

        const doc = await query;
        if (!doc) throw createHttpError(404, 'Not found!');

        return doc;
    }

    async create(
        params: { data: Partial<T>, populatePath?: PopulatePath[], populate?: boolean }
    ): Promise<any> {
        const {data, populatePath, populate = false} = params;

        const doc = new this.model(data);
        await doc.save();

        if (populate) {
            return this.model
                .findById(doc._id)
                .populate(populatePath || this.populateRefs);
        }

        return doc;
    }

    async update(
        params: {
            _id: Types.ObjectId | string,
            data: Partial<T>,
            populatePath?: string[],
            populate?: boolean,
            lean?: boolean
        }
    ): Promise<any> {
        const {_id, data, populatePath, populate = false, lean = false} = params;

        const doc = await this.exists404({_id});
        await doc.updateOne(data);

        return this.exists404({_id, populatePath, populate, lean});
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
            populatePath?: string[],
            populate?: boolean,
            lean?: boolean,
        }
    ) {
        const {
            page = 1,
            perPage = 100,
            filters = {},
            sort = {},
            populatePath,
            populate = false,
            lean = false,
        } = params || {};

        const query = this.model
            .find(filters)
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage)

        if (populate) query.populate(populatePath || this.populateRefs);
        if (lean) query.lean();

        return query;
    }
}