import {z, type ZodTypeAny} from "zod";
import transformZodParsedJSON from "./transformZodParsedJSON.js";

export default <TReturn>(schema: ZodTypeAny) => {
    return z
        .string()
        .optional()
        .transform(
            transformZodParsedJSON<TReturn>(schema)
        );
}