import MovieServiceProvider from "../provider/MovieServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IMovieController} from "../controller/MovieController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/ZodAsyncValidator.js";
import {MovieSubmitSchema} from "../schema/MovieSubmitSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import {upload} from "../../../shared/config/multr.js";
import hasPosterImage from "../middleware/hasPosterImage.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const { controller } = MovieServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IMovieController> = {
    controller,
    createValidator: ZodAsyncValidator(MovieSubmitSchema),
    updateValidator: ZodAsyncValidator(MovieSubmitSchema),
};

const routes = createBaseRoutes(baseConfig);

routes.patch(
    '/update/:_id/poster_image',
    [isAuth, upload.single("image"), hasPosterImage],
    asyncHandler(
        controller.updatePosterPicture.bind(controller),
    )
);

export default routes;