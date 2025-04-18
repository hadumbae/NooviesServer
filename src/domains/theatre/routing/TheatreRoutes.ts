import TheatreServiceProvider from "../provider/TheatreServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {ITheatreController} from "../controller/TheatreController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {TheatreSubmitSchema} from "../schema/TheatreSubmitSchema.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import ScreenServiceProvider from "../../screen/provider/ScreenServiceProvider.js";

const { controller: theatreController } = TheatreServiceProvider.register();
const { controller: screenController } = ScreenServiceProvider.register();

const baseConfig: IBaseRoutesConfig<ITheatreController> = {
    controller: theatreController,
    createValidator: ZodAsyncValidator(TheatreSubmitSchema),
    updateValidator: ZodAsyncValidator(TheatreSubmitSchema),
};

const routes = createBaseRoutes<ITheatreController>(baseConfig);

routes.get('/get/:_id/screens', asyncHandler(screenController.getScreensByTheatre.bind(screenController)));

export default routes;