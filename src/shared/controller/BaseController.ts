import type {IQueryUtils} from "../services/query-utils/IQueryUtils.js";
import QueryUtils from "../services/query-utils/QueryUtils.js";

export interface IBaseControllerConstructor {
    queryUtils?: IQueryUtils;
}

export default class BaseController {
    protected readonly queryUtils: IQueryUtils;

    constructor({queryUtils = QueryUtils}: IBaseControllerConstructor) {
        this.queryUtils = queryUtils;
    }
}