import ScreenServiceProvider from "../provider/ScreenServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IScreenController} from "../controller/ScreenController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {ScreenSubmitSchema} from "../schema/ScreenSubmitSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const {controller} = ScreenServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IScreenController> = {
    crudController: controller,
    createValidator: ZodAsyncValidator(ScreenSubmitSchema),
    updateValidator: ZodAsyncValidator(ScreenSubmitSchema),
};

const routes = createBaseRoutes<IScreenController>(baseConfig);

routes.get(`/get/:_id/seats/by-row`, isAuth, asyncHandler(controller.getSeatsByRow.bind(controller)));

export default routes;