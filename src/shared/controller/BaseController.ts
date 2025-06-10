import type {IQueryUtils} from "../interfaces/query/IQueryUtils.js";

export interface IBaseControllerConstructor {
    queryUtils: IQueryUtils;
}

export default class BaseController {
    protected readonly queryUtils: IQueryUtils;

    constructor({queryUtils}: IBaseControllerConstructor) {
        this.queryUtils = queryUtils;
    }
}