import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {ISeatMapController} from "../controller/SeatMapController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {SeatMapSubmitSchema} from "../schema/SeatMapSubmitSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import SeatMapServiceProvider from "../provider/SeatMapServiceProvider.js";

const {controller} = SeatMapServiceProvider.register();
const baseConfig: IBaseRoutesConfig<ISeatMapController> = {
    controller,
    createValidator: ZodAsyncValidator(SeatMapSubmitSchema),
    updateValidator: ZodAsyncValidator(SeatMapSubmitSchema),
}

const routes = createBaseRoutes<ISeatMapController>(baseConfig);

// /api/v1/admin/seatmaps/showing/:_id/seating/get
routes.get('/showing/:_id/seating/get', isAuth, asyncHandler(controller.getShowingSeatMap.bind(controller)));

// /api/v1/admin/seatmaps/showing/:_id/seating/create
routes.post('/showing/:_id/seating/create', isAuth, asyncHandler(controller.createSeatMap.bind(controller)));

// /api/v1/admin/seatmaps/update/:_id/toggle/availability
routes.patch('/update/:_id/toggle/availability', isAuth, asyncHandler(controller.toggleSeatMapAvailability.bind(controller)));

export default routes;