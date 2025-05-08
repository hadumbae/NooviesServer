import ShowingServiceProvider from "../provider/ShowingServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IShowingController} from "../controller/ShowingController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {ShowingSubmitSchema} from "../schema/ShowingSubmitSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const {controller} = ShowingServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IShowingController> = {
    crudController: controller,
    createValidator: ZodAsyncValidator(ShowingSubmitSchema),
    updateValidator: ZodAsyncValidator(ShowingSubmitSchema),
};

const routes = createBaseRoutes<IShowingController>(baseConfig);

// /api/v1/admin/showings/:_id/seats/seatmaps
routes.get('/get/:_id/seats', isAuth, asyncHandler(controller.fetchSeatsForShowing.bind(controller)));

export default routes;