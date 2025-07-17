import TheatreServiceProvider from "../provider/TheatreServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {ITheatreController} from "../controller/TheatreController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import ScreenServiceProvider from "../../screen/provider/ScreenServiceProvider.js";
import {TheatreInputSchema} from "../schema/TheatreSchema.js";

const { controller: theatreController } = TheatreServiceProvider.register();
const { controller: screenController } = ScreenServiceProvider.register();

const baseConfig: IBaseRoutesConfig<ITheatreController> = {
    crudController: theatreController,
    createValidator: ZodAsyncValidator(TheatreInputSchema),
    updateValidator: ZodAsyncValidator(TheatreInputSchema),
};

const routes = createBaseRoutes<ITheatreController>(baseConfig);

routes.get('/get/:_id/screens', asyncHandler(screenController.getScreensByTheatre.bind(screenController)));

export default routes;