import {Model, model} from "mongoose";
import type IGenre from "./Genre.interface.js";
import GenreSchema from "./Genre.schema.js";
import {DeleteGenreDocumentPreMiddleware} from "./middleware/GenreDocumentMiddleware.js";
import {DeleteGenreQueryPreMiddleware} from "./middleware/GenreQueryMiddleware.js";

import "./Genre.virtuals.js";

GenreSchema.pre("deleteOne", {document: true, query: false}, DeleteGenreDocumentPreMiddleware);
GenreSchema.pre(["deleteOne", "deleteMany"], {document: false, query: true}, DeleteGenreQueryPreMiddleware);

const GenreModel: Model<IGenre> = model<IGenre>("Genre", GenreSchema);
export default GenreModel;