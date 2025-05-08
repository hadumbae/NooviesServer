import type {IQueryUtils} from "../utility/query/QueryUtils.js";

export interface IBaseControllerConstructor {
    queryUtils: IQueryUtils;
}

export default class BaseController {
    protected readonly queryUtils: IQueryUtils;

    constructor({queryUtils}: IBaseControllerConstructor) {
        this.queryUtils = queryUtils;
    }
}