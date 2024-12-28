import TheatreServiceProvider from "../provider/TheatreServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {ITheatreController} from "../controller/TheatreController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";
import {TheatreSubmitSchema} from "../schema/TheatreSubmitSchema.js";

const { controller } = TheatreServiceProvider.register();

const baseConfig: IBaseRoutesConfig<ITheatreController> = {
    controller,
    createValidator: ZodAsyncValidator(TheatreSubmitSchema),
    updateValidator: ZodAsyncValidator(TheatreSubmitSchema),
};

const routes = createBaseRoutes<ITheatreController>(baseConfig);

export default routes;