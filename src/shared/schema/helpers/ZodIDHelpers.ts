import {IDString} from "./ZodStringHelpers.js";
import Genre from "../../../domains/genre/model/GenreModel.js";
import Person from "../../../domains/person/model/PersonModel.js";

export const GenreAsyncIDString = IDString
    .refine(
        async (genreID) => {
            const genre = await Genre.findById(genreID);
            return !!genre;
        },
        "404. Invalid ID."
    );

export const PersonAsyncIDString = IDString
    .refine(
        async (personID) => {
            const genre = await Person.findById(personID);
            return !!genre;
        },
        "404. Invalid ID."
    );