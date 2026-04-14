import {Genre} from "@domains/genre/models/genre/Genre.model";
import {GenreSchema} from "@domains/genre/models/genre/Genre.schema";
import type {GenreSchemaFields} from "@domains/genre/models/genre/Genre.types";
import {handleGenreDuplicateIndex} from "@domains/genre/models/genre/Genre.handlers";

export {
    Genre,
    GenreSchema,
    handleGenreDuplicateIndex,
}


export type {
    GenreSchemaFields,
}
