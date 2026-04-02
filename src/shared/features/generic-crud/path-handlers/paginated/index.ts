import type {
    CountDocumentsParams,
    GetPaginatedDocumentsParams
} from "@shared/features/generic-crud/path-handlers/paginated/crudPaginated.types";

import {
    countDocuments,
    getPaginatedDocuments, paginated
} from "@shared/features/generic-crud/path-handlers/paginated/crudPaginated";


export {
    countDocuments,
    getPaginatedDocuments,
    paginated,

}
export type {
    CountDocumentsParams,
    GetPaginatedDocumentsParams,
}