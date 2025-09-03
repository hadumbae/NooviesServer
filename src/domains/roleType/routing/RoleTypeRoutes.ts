import {createBaseRoutes, type IBaseRoutesConfig} from "../../../shared/routing/BaseRoutes.js";
import RoleTypeServiceProvider from "../provider/RoleTypeServiceProvider.js";
import validateZodSchemaAsync from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import {RoleTypeInputSchema} from "../schemas/RoleTypeInput.schema.js";

const {controller} = RoleTypeServiceProvider.register();

const baseConfig: IBaseRoutesConfig = {
    crudController: controller,
    createValidator: validateZodSchemaAsync(RoleTypeInputSchema),
    updateValidator: validateZodSchemaAsync(RoleTypeInputSchema),
};

const routes = createBaseRoutes(baseConfig);

export default routes;