import {type Model} from "mongoose";
import createHttpError from "http-errors";
import type {PopulatePath} from "../types/PopulatePath.js";
import type IBaseRepository from "../interfaces/IBaseRepository.js";
import type {
    BaseRepositoryCountParams, BaseRepositoryCreateParams, BaseRepositoryDestroyParams,
    BaseRepositoryFindByIDParams,
    BaseRepositoryFindParams, BaseRepositoryPaginationParams, BaseRepositoryUpdateParams
} from "../types/BaseRepositoryTypes.js";

interface IBaseRepositoryConstructor<TSchema> {
    model: Model<TSchema>;
    populateRefs: PopulatePath[];
}

export default class BaseRepository<TSchema extends Record<string, any>> implements IBaseRepository<TSchema> {
    private readonly model: Model<TSchema>;
    private readonly populateRefs: PopulatePath[];

    constructor({model, populateRefs = []}: IBaseRepositoryConstructor<TSchema>) {
        this.model = model;
        this.populateRefs = populateRefs;
    }

    async count(params?: BaseRepositoryCountParams<TSchema>): Promise<number> {
        const {filters = {}} = params || {};
        return this.model.countDocuments(filters);
    }

    async find(params?: BaseRepositoryFindParams<TSchema>): Promise<any> {
        const {populate = false, virtuals = false, filters = {}, populatePath} = params || {};

        const query = this.model.find(filters);
        if (populate) query.populate(populatePath || this.populateRefs);

        return query.lean({virtuals});
    }

    async findById({_id, populatePath, populate, virtuals = false}: BaseRepositoryFindByIDParams): Promise<any> {
        const query = this.model.findById(_id);
        if (populate) query.populate(populatePath || this.populateRefs);

        const doc = await query.lean({virtuals});
        if (!doc) throw createHttpError(404, "Not found!");

        return doc;
    }

    async create(params: BaseRepositoryCreateParams<TSchema>): Promise<any> {
        const {data, populatePath, populate, virtuals = false} = params;

        const doc = new this.model(data);
        await doc.save();

        const query = this.model.findById(doc._id);
        if (populate) query.populate(populatePath || this.populateRefs);

        return query.lean({virtuals});
    }

    async update(params: BaseRepositoryUpdateParams<TSchema>): Promise<any> {
        const {_id, data, populatePath, populate, virtuals = false} = params;

        const query = this.model.findByIdAndUpdate(_id, data, {new: true});
        if (populate) query.populate(populatePath || this.populateRefs);

        const doc = await query.lean({virtuals});
        if (!doc) throw createHttpError(404, "Not found!");

        return doc;
    }

    async destroy({_id}: BaseRepositoryDestroyParams): Promise<any> {
        const doc = await this.model.findById({_id});
        if (!doc) throw createHttpError(404, "Not found!");

        await doc.deleteOne();
    }

    async paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<any> {
        const {page, perPage, filters = {}, sort = {}, virtuals = false, populatePath, populate} = params;

        const query = this.model
            .find(filters)
            .sort(sort)
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (populate) query.populate(populatePath || this.populateRefs);
        return query.lean({virtuals});
    }
}