import UserServiceProvider from "../provider/UserServiceProvider.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import express from "express";
import isAuth from "../../authentication/middleware/isAuth.js";

const {controller} = UserServiceProvider.register();
const routes = express.Router();

// CRUD Routes

routes.get('/all', [isAuth], asyncHandler(controller.all.bind(controller)));
routes.get('/get/:_id', [isAuth], asyncHandler(controller.get.bind(controller)));
routes.delete('/delete/:_id', [isAuth], asyncHandler(controller.delete.bind(controller)));

// Update Routes

routes.patch('/update/:_id/password', [isAuth], asyncHandler(controller.updateUserPassword.bind(controller)));

export default routes;