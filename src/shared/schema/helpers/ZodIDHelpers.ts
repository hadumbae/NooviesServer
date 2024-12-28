import {IDString} from "./ZodStringHelpers.js";
import Genre from "../../../domains/genre/model/GenreModel.js";
import Person from "../../../domains/person/model/PersonModel.js";
import Screen from "../../../domains/screen/model/ScreenModel.js";
import Seat from "../../../domains/seat/model/SeatModel.js";
import Theatre from "../../../domains/theatre/model/TheatreModel.js";

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

export const TheatreAsyncIDString = IDString
    .refine(
        async (theatreID) => {
            const theatre = await Theatre.findById(theatreID);
            return !!theatre;
        },
        "404. Screen not found."
    );

export const SeatAsyncIDString = IDString
    .refine(
        async (seatID) => {
            const seat = await Seat.findById(seatID);
            return !!seat;
        },
        "404. Screen not found."
    );

export const ScreenAsyncIDString = IDString
    .refine(
        async (screenID) => {
            const screen = await Screen.findById(screenID);
            return !!screen;
        },
        "404. Screen not found."
    );