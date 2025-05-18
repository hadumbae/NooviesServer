import {type FilterQuery, type Model, Types} from "mongoose";
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
        params?: {
            filters?: FilterQuery<any>,
            populatePath?: PopulatePath[],
            populate?: boolean,
            virtuals?: boolean,
        }
    ): Promise<any> {
        const {populate = false, virtuals = false, filters = {}, populatePath} = params || {};

        const query = this.model.find(filters);

        if (populate) query.populate(populatePath || this.populateRefs);

        return query.lean({virtuals});
    }

    async findById(
        params: {
            _id: Types.ObjectId | string,
            virtuals?: boolean,
            populate?: boolean,
            populatePath?: PopulatePath[],
        }
    ): Promise<any> {
        const {_id, populatePath, populate, virtuals = false} = params;
        if (!Types.ObjectId.isValid(_id)) throw createHttpError(404, "Not found!");
        const query = this.model.findById(_id);

        if (populate) {
            query.populate(populatePath || this.populateRefs);
        }

        const doc = await query.lean({virtuals});
        if (!doc) throw createHttpError(404, "Not found!");

        return doc;
    }

    async exists404(
        params: {
            _id: Types.ObjectId | string,
            populatePath?: PopulatePath[],
            populate?: boolean,
            virtuals?: boolean,
        }
    ): Promise<any> {
        const {_id, populatePath, populate = false, virtuals = false} = params;
        if (!Types.ObjectId.isValid(_id)) throw createHttpError(404, "Invalid ID!");

        let query = this.model.findById(_id);

        if (populate) query.populate(populatePath || this.populateRefs);

        const doc = await query.lean({virtuals});
        if (!doc) throw createHttpError(404, 'Not found!');

        return doc;
    }

    async create(
        params: {
            data: Partial<T>,
            populatePath?: PopulatePath[],
            populate?: boolean,
            virtuals?: boolean,
        }
    ): Promise<any> {
        const {data, populatePath, populate, virtuals = false} = params;

        const doc = new this.model(data);
        await doc.save();

        const query = this.model.findById(doc._id);
        if (populate) query.populate(populatePath || this.populateRefs);

        return query.lean({virtuals});
    }

    async update(
        params: {
            _id: Types.ObjectId | string,
            data: Partial<T>,
            populatePath?: string[],
            populate?: boolean,
            virtuals?: boolean
        }
    ): Promise<any> {
        const {_id, data, populatePath, populate, virtuals = false} = params;

        const doc = await this.exists404({_id, virtuals: true});
        const query = this.model.findByIdAndUpdate(doc._id, data, {new: true});

        if (populate) {
            query.populate(populatePath || this.populateRefs);
        }

        return query.lean({virtuals});
    }

    async destroy(params: { _id: Types.ObjectId | string }): Promise<any> {
        const {_id} = params;
        const doc = await this.exists404({_id});
        await doc.deleteOne();
    }

    async paginate(
        params: {
            page: number,
            perPage: number,
            sort?: Record<string, any>,
            filters?: Record<string, any>,
            populatePath?: string[],
            populate?: boolean,
            virtuals?: boolean,
        }
    ) {
        const {
            page,
            perPage,
            filters = {},
            sort = {},
            virtuals = false,
            populatePath,
            populate,
        } = params;

        const query = this.model
            .find(filters)
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (populate) {
            query.populate(populatePath || this.populateRefs);
        }

        return query.lean({virtuals});
    }
}