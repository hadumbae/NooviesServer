import {create, createDocument} from "@shared/_feat/generic-crud/path-handlers/create/crudCreate";
import {deleteDocument, destroy} from "@shared/_feat/generic-crud/path-handlers/delete/crudDestroy";
import {find, findDocuments} from "@shared/_feat/generic-crud/path-handlers/find/crudFind";
import {findById, findDocumentById} from "@shared/_feat/generic-crud/path-handlers/find-by-id/crudFindByID";
import {findBySlug, findDocumentBySlug} from "@shared/_feat/generic-crud/path-handlers/find-by-slug/crudFindBySlug";
import {
    findByUniqueCode,
    findDocumentByUniqueCode
} from "@shared/_feat/generic-crud/path-handlers/find-by-unique-code/crudFindByUniqueCode";
import {getPaginatedDocuments, paginated} from "@shared/_feat/generic-crud/path-handlers/paginated/crudPaginated";
import {softDelete, softDeleteDocument} from "@shared/_feat/generic-crud/path-handlers/soft-delete/crudSoftDelete";
import {update, updateDocument} from "@shared/_feat/generic-crud/path-handlers/update/crudUpdate";
import type {UpdateDocumentConfig} from "@shared/_feat/generic-crud/path-handlers/update/crudUpdate.types";
import type {
    SoftDeleteDocumentConfig
} from "@shared/_feat/generic-crud/path-handlers/soft-delete/crudSoftDelete.types";
import type {
    GetPaginatedDocumentsConfig
} from "@shared/_feat/generic-crud/path-handlers/paginated/crudPaginated.types";
import type {
    FindDocumentByUniqueCodeConfig
} from "@shared/_feat/generic-crud/path-handlers/find-by-unique-code/crudFindByUniqueCode.types";
import type {
    FindDocumentBySlugConfig
} from "@shared/_feat/generic-crud/path-handlers/find-by-slug/crudFindBySlug.types";
import type {FindDocumentByIdConfig} from "@shared/_feat/generic-crud/path-handlers/find-by-id/crudFindByID.types";
import type {FindDocumentsConfig} from "@shared/_feat/generic-crud/path-handlers/find/crudFind.types";
import type {DeleteDocumentConfig} from "@shared/_feat/generic-crud/path-handlers/delete/crudDestroy.types";
import type {CreateDocumentConfig} from "@shared/_feat/generic-crud/path-handlers/create/crudCreate.types";

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
    UpdateDocumentConfig,
    SoftDeleteDocumentConfig,
    GetPaginatedDocumentsConfig,
    FindDocumentByUniqueCodeConfig,
    FindDocumentBySlugConfig,
    FindDocumentByIdConfig,
    FindDocumentsConfig,
    DeleteDocumentConfig,
    CreateDocumentConfig,
}

