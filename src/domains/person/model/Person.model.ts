import {model, type Model} from "mongoose";
import type {IPerson} from "../interfaces/IPerson.js";
import {PersonSchema} from "./Person.schema.js";

import "./Person.virtuals.js";
import "./Person.middleware.js";

const PersonModel: Model<IPerson> = model<IPerson>("Person", PersonSchema);
export default PersonModel;