import ShowingServiceProvider from "../provider/ShowingServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IShowingController} from "../controller/ShowingController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";
import {ShowingSchema} from "../schema/ShowingSchema.js";

const {controller} = ShowingServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IShowingController> = {
    controller,
    createValidator: ZodAsyncValidator(ShowingSchema),
    updateValidator: ZodAsyncValidator(ShowingSchema),
};

const routes = createBaseRoutes<IShowingController>(baseConfig);

export default routes;