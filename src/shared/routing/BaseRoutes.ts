import express, {type RequestHandler} from "express";
import asyncHandler from "../utility/AsyncHandler.js";
import isAuth from "../../domains/authentication/middleware/isAuth.js";
import type {IBaseCRUDController} from "../controller/base-crud-controller/BaseCRUDController.types.js";

type RoutePath<TController extends IBaseCRUDController> = {
    method: "get" | "post" | "put" | "patch" | "delete",
    path: string;
    fn: keyof TController;
};

export type BaseRouteMiddleware<TController extends IBaseCRUDController> = {
    all?: RequestHandler[];
    path?: Partial<Record<keyof TController, RequestHandler[]>>
}

export interface IBaseRoutesConfig<TController extends IBaseCRUDController = IBaseCRUDController> {
    crudController: TController;
    middlewareList?: BaseRouteMiddleware<TController>
}

export const createBaseRoutes = <TController extends IBaseCRUDController>(config: IBaseRoutesConfig<TController>) => {
        const {crudController, middlewareList} = config;
        const {all: allMiddleware, path: pathMiddleware} = middlewareList || {};

        const bind = (fn: keyof TController) => asyncHandler(
            (crudController[fn] as (...args: any) => Promise<any>).bind(crudController)
        );

        const secure = (handlers: RequestHandler[] = []): RequestHandler[] => [isAuth, ...handlers];

        const router = express.Router();

        const routes: RoutePath<TController>[] = [
            {method: "get", path: '/all', fn: "all"},
            {method: "get", path: '/paginated', fn: "paginated"},
            {method: "post", path: '/create', fn: "create"},
            {method: "get", path: '/get/:_id', fn: "get"},
            {method: "patch", path: '/update/:_id', fn: "update"},
            {method: "delete", path: '/delete/:_id', fn: "delete"},
            {method: "get", path: '/query', fn: "query"},
        ];

        for (const {method, path, fn} of routes) {
            const middleware = [...(allMiddleware ?? []), ...(pathMiddleware?.[fn] ?? [])];
            router[method](path, secure(middleware), bind(fn));
        }

        return router;
    }
;
