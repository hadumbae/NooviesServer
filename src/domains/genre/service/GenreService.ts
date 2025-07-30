import GenreModel from "../model/Genre.model.js";
import type IGenre from "../model/Genre.interface.js";
import type IGenreSubmit from "../schema/interface/IGenreSubmit.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";
import type {ZodIssue} from "zod";
import createHttpError from "http-errors";

export interface IGenreService {
    updateGenre({genreID, data}: { genreID: string, data: IGenreSubmit }): Promise<IGenre>;
}

export default class GenreService implements IGenreService{
    async updateGenre({genreID, data}: { genreID: string, data: IGenreSubmit }): Promise<IGenre> {
        const genre = await GenreModel.findById(genreID);
        if (!genre) throw createHttpError(404, "Not found!");

        const genreWithName = await GenreModel.findOne({name: data.name, _id: {$ne: genreID}}).lean();
        if (genreWithName) {
            const error = {code: "invalid_string", path: ["name"], message: "Must be unique."};
            throw new ZodParseError({message: "Authentication failed.", errors: [error as ZodIssue]});
        }

        const updatedGenre = await GenreModel.findByIdAndUpdate({_id: genreID}, data, {new: true}).populate("movies");
        if (!updatedGenre) throw createHttpError(500, "Error updating genre.");

        return updatedGenre;
    }
}