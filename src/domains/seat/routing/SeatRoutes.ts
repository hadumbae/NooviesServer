import SeatServiceProvider from "../provider/SeatServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {ISeatController} from "../controller/SeatController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {SeatSubmitSchema} from "../schema/submits/SeatSubmit.schema.js";

const { controller } = SeatServiceProvider.register();

const baseConfig: IBaseRoutesConfig<ISeatController> = {
    crudController: controller,
    createValidator: ZodAsyncValidator(SeatSubmitSchema),
    updateValidator: ZodAsyncValidator(SeatSubmitSchema),
};

const routes = createBaseRoutes<ISeatController>(baseConfig);

export default routes;
