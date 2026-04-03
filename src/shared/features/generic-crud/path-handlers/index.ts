import {create, createDocument} from "@shared/features/generic-crud/path-handlers/create/crudCreate";
import {deleteDocument, destroy} from "@shared/features/generic-crud/path-handlers/delete/crudDestroy";
import {find, findDocuments} from "@shared/features/generic-crud/path-handlers/find/crudFind";
import {findById, findDocumentById} from "@shared/features/generic-crud/path-handlers/find-by-id/crudFindByID";
import {findBySlug, findDocumentBySlug} from "@shared/features/generic-crud/path-handlers/find-by-slug/crudFindBySlug";
import {
    findByUniqueCode,
    findDocumentByUniqueCode
} from "@shared/features/generic-crud/path-handlers/find-by-unique-code/crudFindByUniqueCode";
import {getPaginatedDocuments, paginated} from "@shared/features/generic-crud/path-handlers/paginated/crudPaginated";
import {softDelete, softDeleteDocument} from "@shared/features/generic-crud/path-handlers/soft-delete/crudSoftDelete";
import {update, updateDocument} from "@shared/features/generic-crud/path-handlers/update/crudUpdate";
import type {UpdateDocumentParams} from "@shared/features/generic-crud/path-handlers/update/crudUpdate.types";
import type {SoftDeleteDocumentParams} from "@shared/features/generic-crud/path-handlers/soft-delete/crudSoftDelete.types";
import type {
    GetPaginatedDocumentsParams
} from "@shared/features/generic-crud/path-handlers/paginated/crudPaginated.types";
import type {
    FindDocumentByUniqueCodeParams
} from "@shared/features/generic-crud/path-handlers/find-by-unique-code/crudFindByUniqueCode.types";
import type {FindDocumentBySlugParams} from "@shared/features/generic-crud/path-handlers/find-by-slug/crudFindBySlug.types";
import type {FindDocumentByIdParams} from "@shared/features/generic-crud/path-handlers/find-by-id/crudFindByID.types";
import type {FindDocumentsParams} from "@shared/features/generic-crud/path-handlers/find/crudFind.types";
import type {DeleteDocumentParams} from "@shared/features/generic-crud/path-handlers/delete/crudDestroy.types";
import type {CreateDocumentParams} from "@shared/features/generic-crud/path-handlers/create/crudCreate.types";

export {
    createDocument,
    deleteDocument,
    findDocuments,
    findDocumentById,
    findDocumentBySlug,
    findDocumentByUniqueCode,
    getPaginatedDocuments,
    findByUniqueCode,
    softDeleteDocument,
    updateDocument,
    create,
    destroy,
    find,
    findById,
    findBySlug,
    paginated,
    softDelete,
    update,
}

export type {
    UpdateDocumentParams,
    SoftDeleteDocumentParams,
    GetPaginatedDocumentsParams,
    FindDocumentByUniqueCodeParams,
    FindDocumentBySlugParams,
    FindDocumentByIdParams,
    FindDocumentsParams,
    DeleteDocumentParams,
    CreateDocumentParams,
}

