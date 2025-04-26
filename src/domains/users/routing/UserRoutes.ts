import UserServiceProvider from "../provider/UserServiceProvider.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import express from "express";

const {controller} = UserServiceProvider.register();
const routes = express.Router();

routes.get('/all', asyncHandler(controller.all.bind(controller)));
routes.get('/get/:_id', asyncHandler(controller.get.bind(controller)));
routes.delete('/delete/:_id', asyncHandler(controller.delete.bind(controller)));

routes.patch('/update/:_id/password', asyncHandler(controller.updateUserPassword.bind(controller)));

export default routes;