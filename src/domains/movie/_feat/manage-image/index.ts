import {removeMoviePosterImage, updateMoviePosterImage} from "@/domains/movie/_feat/manage-image/service";
import type {DeletePosterImageConfig, UploadPosterImageConfig} from "@/domains/movie/_feat/manage-image/service.types";


export {
    updateMoviePosterImage,
    removeMoviePosterImage,
}

export type {
    UploadPosterImageConfig,
    DeletePosterImageConfig,
}

