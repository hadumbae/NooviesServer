import {PersistenceManager} from "../../../../shared/repository/managers/PersistenceManager.js";
import type {PersistenceManagerMethods} from "../../../../shared/repository/managers/PersistenceManager.types.js";
import type {ZodIssue} from "zod";
import ZodParseError from "../../../../shared/errors/ZodParseError.js";
import Genre from "../../model/Genre.model.js";

export class GenrePersistenceManager extends PersistenceManager implements PersistenceManagerMethods {
    constructor() {
        super({modelName: Genre.modelName});
    }

    checkDuplicateIndexString(indexString: string) {
        if (indexString === "name_1") {
            const errors: ZodIssue[] = [
                {
                    path: ["name"],
                    code: "custom",
                    message: "A genre with this name already exists. Please choose a different name."
                }
            ];

            throw new ZodParseError({
                errors,
                message: "Duplicate genre detected. Each genre name must be unique."
            });
        }
    }
}