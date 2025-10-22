import GenreModel from "../../../domains/genre/model/Genre.model.js";
import PersonModel from "../../../domains/person/model/Person.model.js";
import Screen from "../../../domains/screen/model/Screen.js";
import Theatre from "../../../domains/theatre/model/Theatre.js";
import Showing from "../../../domains/showing/model/Showing.model.js";
import {ObjectIdStringSchema} from "../mongoose/ObjectIdStringSchema.js";
import Seat from "../../../domains/seat/model/Seat.model.js";

export const GenreAsyncIDString = ObjectIdStringSchema
    .refine(
        async (genreID) => {
            const genre = await GenreModel.findById(genreID);
            return !!genre;
        },
        "404. Invalid ID."
    );

export const PersonAsyncIDString = ObjectIdStringSchema
    .refine(
        async (personID) => {
            const genre = await PersonModel.findById(personID);
            return !!genre;
        },
        "404. Invalid ID."
    );

export const TheatreAsyncIDString = ObjectIdStringSchema
    .refine(
        async (theatreID) => {
            const theatre = await Theatre.findById(theatreID);
            return !!theatre;
        },
        "404. Screen not found."
    );

export const SeatAsyncIDString = ObjectIdStringSchema
    .refine(
        async (seatID) => {
            const seat = await Seat.findById(seatID);
            return !!seat;
        },
        "404. Screen not found."
    );

export const ScreenAsyncIDString = ObjectIdStringSchema
    .refine(
        async (screenID) => {
            const screen = await Screen.findById(screenID);
            return !!screen;
        },
        "404. Screen not found."
    );

export const ShowingAsyncIDString = ObjectIdStringSchema
    .refine(
        async (showingID) => {
            const showing = await Showing.findById(showingID);
            return !!showing;
        },
        "404. Showing not found."
    );