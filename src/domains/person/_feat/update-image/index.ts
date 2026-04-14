import {deleteProfileImage, updateProfileImage} from "@domains/person/_feat/update-image/service";
import type {
    RemovePersonProfileImageConfig,
    UploadPersonProfileImageConfig
} from "@domains/person/_feat/update-image/service.types";
import {deleteRemoveProfileImage, patchUpdateProfileImage} from "@domains/person/_feat/update-image/controller";
import {PersonImageRoutes} from "@domains/person/_feat/update-image/routes";
import {hasProfileImage} from "@domains/person/_feat/update-image/hasProfileImage";

export {
    updateProfileImage,
    deleteProfileImage,
    patchUpdateProfileImage,
    deleteRemoveProfileImage,
    PersonImageRoutes,
    hasProfileImage,
}
export type {
    UploadPersonProfileImageConfig,
    RemovePersonProfileImageConfig,
}

