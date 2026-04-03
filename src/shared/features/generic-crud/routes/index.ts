import type {
    BuildCRUDRoutesParams,
    CRUDRoute,
    CRUDRouteMethods
} from "@shared/features/generic-crud/routes/CRUDRoute.types";
import {buildCRUDRoutes} from "@shared/features/generic-crud/routes/CRUDRoute";


export {
    buildCRUDRoutes
}

export type {
    CRUDRouteMethods,
    CRUDRoute,
    BuildCRUDRoutesParams,
}