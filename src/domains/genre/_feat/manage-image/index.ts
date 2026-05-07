import {
    type ManageGenreImageRouteConfig,
    ManageGenreImageRouteConfigSchema
} from "@domains/genre/_feat/manage-image/schema/ManageGenreImageRouteConfig";
import {GenreImageManagementRoutes} from "@domains/genre/_feat/manage-image/routes";
import {patchRemoveGenreImage, patchUpdateGenreImage} from "@domains/genre/_feat/manage-image/controller";
import {removeGenreImage, updateGenreImage} from "@domains/genre/_feat/manage-image/service/service";
import type {
    RemoveGenreImageConfig,
    UpdateGenreImageConfig
} from "@domains/genre/_feat/manage-image/service/service.types";
import {
    type GenreImageInputData,
    GenreImageInputSchema
} from "@domains/genre/_feat/manage-image/schema/GenreImageInputSchema";
import {hasGenreImage} from "@domains/genre/_feat/manage-image/middleware/hasGenreImage";

export {
    ManageGenreImageRouteConfigSchema,
    GenreImageManagementRoutes,
    patchUpdateGenreImage,
    patchRemoveGenreImage,
    updateGenreImage,
    removeGenreImage,
    GenreImageInputSchema,
    hasGenreImage,
}

export type {
    ManageGenreImageRouteConfig,
    UpdateGenreImageConfig,
    RemoveGenreImageConfig,
    GenreImageInputData,
}

