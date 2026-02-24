/**
 * @file Base controller with shared dependencies.
 * BaseController.ts
 */

import type { IQueryUtils } from "../services/query-utils/IQueryUtils.js";
import QueryUtils from "../services/query-utils/QueryUtils.js";

/**
 * Constructor parameters for BaseController.
 */
export type BaseConstructorParams = {
    queryUtils?: IQueryUtils;
};

/**
 * Provides shared controller dependencies.
 */
export default class BaseController {
    protected readonly queryUtils: IQueryUtils;

    constructor({ queryUtils = QueryUtils }: BaseConstructorParams) {
        this.queryUtils = queryUtils;
    }
}