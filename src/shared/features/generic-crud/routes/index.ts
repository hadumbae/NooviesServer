import type {
    BuildCRUDRoutesParams,
    CRUDRoute,
    CRUDRouteMethods
} from "@shared/features/generic-crud/routes/CRUDRoutesFactory.types";
import {buildCRUDRoutes} from "@shared/features/generic-crud/routes/CRUDRoutesFactory";


export {
    buildCRUDRoutes
}

export type {
    CRUDRouteMethods,
    CRUDRoute,
    BuildCRUDRoutesParams,
}