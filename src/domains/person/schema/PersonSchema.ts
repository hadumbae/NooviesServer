import {z, type ZodType} from 'zod';
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import type {IPerson} from "../model/PersonModel.js";
import {MovieSchema} from "../../movie/schema/MovieSchema.js";
import {PersonSubmitSchema} from "./PersonSubmitSchema.js";

export const PersonSchema: ZodType<IPerson> = PersonSubmitSchema.extend({
    _id: IDInstance,

    movies: z
        .array(z.union([
            IDInstance,
            z.lazy(() => MovieSchema),
        ])),
});

export type ZPerson = z.infer<typeof PersonSchema>;