import {Types} from "mongoose";

export type UploadPosterImageParams = {
    movieID: Types.ObjectId;
    image: Express.Multer.File;
}

export type DeletePosterImageParams = {
    movieID: Types.ObjectId
}
