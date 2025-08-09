import GenreModel from "../model/Genre.model.js";
import type IGenre from "../model/Genre.interface.js";
import type IGenreSubmit from "../schema/interface/IGenreSubmit.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import type {ZodIssue} from "zod";
import createHttpError from "http-errors";
import mongoose from "mongoose";

type CreateData = { data: IGenreSubmit };
type UpdateData = CreateData & { genreID: string };

export interface IGenreService {
    catchDuplicateError(err: unknown): unknown;

    create(params: CreateData): Promise<IGenre>;

    updateUniqueGenre({genreID, data}: UpdateData): Promise<IGenre | null>;

    update({genreID, data}: UpdateData): Promise<IGenre>;
}

export default class GenreService implements IGenreService {
    async create({data}: CreateData): Promise<IGenre> {
        try {
            return await GenreModel.create(data);
        } catch (err: unknown) {
            throw this.catchDuplicateError(err);
        }
    }

    async updateUniqueGenre({genreID, data}: UpdateData): Promise<IGenre | null> {
        try {
            return GenreModel.findByIdAndUpdate(genreID, data);
        } catch (err: unknown) {
            throw this.catchDuplicateError(err);
        }
    }

    async update(params: UpdateData): Promise<IGenre> {
        const genre = await this.updateUniqueGenre(params);
        if (!genre) throw createHttpError(404, "Not found!");
        return genre;
    }

    catchDuplicateError(err: unknown): unknown {
        const mongooseCheck = err instanceof mongoose.Error
            && err.cause instanceof mongoose.mongo.MongoServerError
            && err.cause.code === 11000;

        const mongoCheck = err
            && typeof err === "object"
            && "code" in err
            && (err as { code?: number }).code === 11000;

        if (mongooseCheck || mongoCheck) {
            const errors: ZodIssue[] = [{code: "custom", message: "Name already exists.", path: ["name"]}];
            return new ZodParseError({message: "Failed to create genre.", errors});
        }

        return err;
    }
}