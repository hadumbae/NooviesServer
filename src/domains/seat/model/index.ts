import {handleDuplicateIndex} from "@domains/seat/model/Seat.handlers";
import {SeatSchema} from "@domains/seat/model/Seat.schema";
import type {SeatSchemaFields} from "@domains/seat/model/Seat.types";
import {Seat} from "@domains/seat/model/Seat.model";

export {
    Seat,
    SeatSchema,
    handleDuplicateIndex,
}

export type {
    SeatSchemaFields,
}
