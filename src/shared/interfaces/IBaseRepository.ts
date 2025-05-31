import type {
    BaseRepositoryCountParams, BaseRepositoryCreateParams, BaseRepositoryDestroyParams,
    BaseRepositoryFindByIDParams,
    BaseRepositoryFindParams, BaseRepositoryPaginationParams, BaseRepositoryUpdateParams
} from "../types/BaseRepositoryTypes.js";

export default interface IBaseRepository<TSchema extends Record<string, any>> {
    count(params?: BaseRepositoryCountParams<TSchema>): Promise<number>;
    find(params?: BaseRepositoryFindParams<TSchema>): Promise<any>;
    findById(params: BaseRepositoryFindByIDParams): Promise<any>;
    create(params: BaseRepositoryCreateParams<TSchema>): Promise<any>;
    update(params: BaseRepositoryUpdateParams<TSchema>): Promise<any>;
    destroy(params: BaseRepositoryDestroyParams): Promise<any>;
    paginate(params: BaseRepositoryPaginationParams<TSchema>): Promise<any>;
}