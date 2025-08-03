import {Model, model} from "mongoose";
import type IGenre from "./Genre.interface.js";
import GenreSchema from "./Genre.schema.js";

import "./Genre.virtuals.js";
import "./Genre.middleware.js";

const GenreModel: Model<IGenre> = model<IGenre>("Genre", GenreSchema);
export default GenreModel;