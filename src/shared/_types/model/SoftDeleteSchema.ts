import type {Model} from "mongoose";
import type {BaseSoftDeleteModel} from "@/shared/_types/model/BaseModel";
import type {ModelSoftDeleteMethods} from "@/shared/_types/model/ModelSoftDelete";

export type SoftDeleteSchemaModel<T extends BaseSoftDeleteModel> = Model<T, {}, ModelSoftDeleteMethods<T>>;