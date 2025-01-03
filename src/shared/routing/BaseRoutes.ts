import express, {type RequestHandler} from "express";
import asyncHandler from "../utility/AsyncHandler.js";
import {type IBaseController} from "../controller/BaseController.js";
import isAuth from "../../domains/authentication/middleware/isAuth.js";

export interface IBaseRoutesConfig<TController extends IBaseController> {
    controller: TController,
    createValidator: RequestHandler,
    updateValidator: RequestHandler,
}

export const createBaseRoutes = <TController extends IBaseController>(
    config: IBaseRoutesConfig<TController>
) => {
    const { controller, createValidator, updateValidator } = config;
    const router = express.Router();

    router.get(
        '/all',
        asyncHandler(
            controller.all.bind(controller),
        ),
    );

    router.get(
        '/paginated',
        isAuth,
        asyncHandler(
            controller.paginated.bind(controller),
        ),
    );

    router.post(
        '/create',
        [createValidator],
        asyncHandler(
            controller.create.bind(controller),
        ),
    );

    router.get(
        '/get/:_id',
        asyncHandler(
            controller.get.bind(controller),
        ),
    );

    router.patch(
        '/update/:_id',
        [updateValidator],
        asyncHandler(
            controller.update.bind(controller),
        ),
    );

    router.delete(
        '/delete/:_id',
        asyncHandler(
            controller.delete.bind(controller),
        ),
    );

    return router;
};
