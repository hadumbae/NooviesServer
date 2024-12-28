import {z} from "zod";

export const PersonImageSchema = z.object({
    image: z.instanceof(File),
})