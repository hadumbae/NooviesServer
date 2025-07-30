import GenreServiceProvider from "../provider/GenreServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IGenreController} from "../controller/GenreController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {GenreInputSchema} from "../schema/GenreInputSchema.js";

const { controller } = GenreServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IGenreController> = {
    crudController: controller,
    createValidator: ZodAsyncValidator(GenreInputSchema),
    updateValidator: ZodAsyncValidator(GenreInputSchema),
};

const routes = createBaseRoutes(baseConfig);

export default routes;