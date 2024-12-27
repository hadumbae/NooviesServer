import {z} from "zod";
import {Types} from "mongoose";

export const IDInstance = z.instanceof(Types.ObjectId).readonly();