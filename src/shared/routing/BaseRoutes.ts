import express, {type RequestHandler} from "express";
import asyncHandler from "../utility/AsyncHandler.js";
import {type IBaseCRUDController} from "../controller/BaseCRUDController.js";
import isAuth from "../../domains/authentication/middleware/isAuth.js";

export interface IBaseRoutesConfig<TController extends IBaseCRUDController> {
    crudController: TController,
    createValidator: RequestHandler,
    updateValidator: RequestHandler,
}

export const createBaseRoutes = <TController extends IBaseCRUDController>(
    config: IBaseRoutesConfig<TController>
) => {
    const {crudController, createValidator, updateValidator} = config;
    const router = express.Router();

    router.get('/all', isAuth, asyncHandler(crudController.all.bind(crudController)));

    router.get('/paginated', isAuth, asyncHandler(crudController.paginated.bind(crudController)));

    router.post('/create', [isAuth, createValidator], asyncHandler(crudController.create.bind(crudController)));

    router.get('/get/:_id', isAuth, asyncHandler(crudController.get.bind(crudController)));

    router.patch('/update/:_id', [isAuth, updateValidator], asyncHandler(crudController.update.bind(crudController)));

    router.delete('/delete/:_id', isAuth, asyncHandler(crudController.delete.bind(crudController)));

    return router;
};
