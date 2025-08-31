import type {IQueryUtils} from "../interfaces/query/IQueryUtils.js";
import QueryUtils from "../utility/query/QueryUtils.js";

export interface IBaseControllerConstructor {
    queryUtils?: IQueryUtils;
}

export default class BaseController {
    protected readonly queryUtils: IQueryUtils;

    constructor({queryUtils = QueryUtils}: IBaseControllerConstructor) {
        this.queryUtils = queryUtils;
    }
}