import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IPersonController} from "../controller/PersonController.js";
import PersonServiceProvider from "../provider/PersonServiceProvider.js";
import ZodValidator from "../../../shared/utility/zod/validateZodSchema.js";
import {PersonSubmitSchema} from "../schema/PersonSubmitSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import {uploadImage} from "@config/image-multr.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import hasProfileImage from "../middleware/hasProfileImage.js";

const { controller } = PersonServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IPersonController> = {
    crudController: controller,
    createValidator: ZodValidator(PersonSubmitSchema),
    updateValidator: ZodValidator(PersonSubmitSchema),
};

const routes = createBaseRoutes(baseConfig);

routes.patch(
    '/update/:_id/images/profile',
    [isAuth, uploadImage.single("profileImage"), hasProfileImage],
    asyncHandler(controller.updateProfileImage.bind(controller)),
);

routes.delete(
    '/delete/:_id/images/profile',
    [isAuth, uploadImage.single("profileImage"), hasProfileImage],
    asyncHandler(controller.deleteProfileImage.bind(controller)),
);

export default routes;