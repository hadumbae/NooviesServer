import type {
    BuildCRUDRoutesParams,
    CRUDRoute,
    CRUDRouteMethods
} from "@shared/_feat/generic-crud/routes/CRUDRoutesFactory.types";
import {buildCRUDRoutes} from "@shared/_feat/generic-crud/routes/CRUDRoutesFactory";


export {
    buildCRUDRoutes
}

export type {
    CRUDRouteMethods,
    CRUDRoute,
    BuildCRUDRoutesParams,
}