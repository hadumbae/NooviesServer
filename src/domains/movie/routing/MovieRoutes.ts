import MovieServiceProvider from "../provider/MovieServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IMovieController} from "../controller/MovieController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {MovieSubmitSchema} from "../schema/MovieSubmitSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import {uploadImage} from "@config/image-multr.js";
import hasPosterImage from "../middleware/hasPosterImage.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

const {crudController} = MovieServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IMovieController> = {
    crudController: crudController,
    createValidator: ZodAsyncValidator(MovieSubmitSchema),
    updateValidator: ZodAsyncValidator(MovieSubmitSchema),
};

const routes = createBaseRoutes(baseConfig);

routes.get(
    '/query/populated',
    [isAuth],
    asyncHandler(crudController.fetchMoviesByQueryWithData.bind(crudController)),
);

routes.patch(
    '/update/:_id/poster_image',
    [isAuth, uploadImage.single("image"), hasPosterImage],
    asyncHandler(crudController.updatePosterPicture.bind(crudController)),
);

routes.delete(
    '/delete/:_id/poster_image',
    [isAuth, uploadImage.single("image"), hasPosterImage],
    asyncHandler(crudController.updatePosterPicture.bind(crudController)),
);

export default routes;