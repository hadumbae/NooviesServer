import SeatServiceProvider from "../provider/SeatServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {ISeatController} from "../controller/SeatController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {SeatSubmitSchema} from "../schema/SeatSubmitSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import isAdmin from "../../authentication/middleware/isAdmin.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const { controller } = SeatServiceProvider.register();

const baseConfig: IBaseRoutesConfig<ISeatController> = {
    controller,
    createValidator: ZodAsyncValidator(SeatSubmitSchema),
    updateValidator: ZodAsyncValidator(SeatSubmitSchema),
};

const routes = createBaseRoutes<ISeatController>(baseConfig);

export default routes;
