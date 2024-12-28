import ScreenServiceProvider from "../provider/ScreenServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IScreenController} from "../controller/ScreenController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";
import {ScreenSubmitSchema} from "../schema/ScreenSubmitSchema.js";

const {controller} = ScreenServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IScreenController> = {
    controller,
    createValidator: ZodAsyncValidator(ScreenSubmitSchema),
    updateValidator: ZodAsyncValidator(ScreenSubmitSchema),
};

const routes = createBaseRoutes<IScreenController>(baseConfig);

export default routes;