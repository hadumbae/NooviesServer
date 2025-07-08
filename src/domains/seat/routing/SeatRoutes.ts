import SeatServiceProvider from "../provider/SeatServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {ISeatController} from "../controller/SeatController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {SeatsByRowSubmitSchema, SeatSubmitSchema} from "../schema/submits/SeatSubmit.schema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const {controller} = SeatServiceProvider.register();

const baseConfig: IBaseRoutesConfig<ISeatController> = {
    crudController: controller,
    createValidator: ZodAsyncValidator(SeatSubmitSchema),
    updateValidator: ZodAsyncValidator(SeatSubmitSchema),
};

const routes = createBaseRoutes<ISeatController>(baseConfig);

routes.post("/create/by-row", [isAuth, ZodAsyncValidator(SeatsByRowSubmitSchema)], asyncHandler(controller.createSeatsByRow.bind(controller)));

export default routes;
