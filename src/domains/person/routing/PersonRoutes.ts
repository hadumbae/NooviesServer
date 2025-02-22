import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IPersonController} from "../controller/PersonController.js";
import PersonServiceProvider from "../provider/PersonServiceProvider.js";
import ZodValidator from "../../../shared/utility/zod/validateZodSchema.js";
import {PersonSubmitSchema} from "../schema/PersonSubmitSchema.js";

const { controller } = PersonServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IPersonController> = {
    controller,
    createValidator: ZodValidator(PersonSubmitSchema),
    updateValidator: ZodValidator(PersonSubmitSchema),
};

const routes = createBaseRoutes(baseConfig);

export default routes;