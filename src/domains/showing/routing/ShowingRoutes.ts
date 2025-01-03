import ShowingServiceProvider from "../provider/ShowingServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IShowingController} from "../controller/ShowingController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";
import {ShowingSubmitSchema} from "../schema/ShowingSubmitSchema.js";

const {controller} = ShowingServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IShowingController> = {
    controller,
    createValidator: ZodAsyncValidator(ShowingSubmitSchema),
    updateValidator: ZodAsyncValidator(ShowingSubmitSchema),
};

const routes = createBaseRoutes<IShowingController>(baseConfig);

export default routes;