import GenreServiceProvider from "../provider/GenreServiceProvider.js";
import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import type {IGenreController} from "../controller/GenreController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {GenreSubmitSchema} from "../schema/GenreSubmitSchema.js";

const { controller } = GenreServiceProvider.register();

const baseConfig: IBaseRoutesConfig<IGenreController> = {
    controller,
    createValidator: ZodAsyncValidator(GenreSubmitSchema),
    updateValidator: ZodAsyncValidator(GenreSubmitSchema),
};

const routes = createBaseRoutes(baseConfig);

export default routes;