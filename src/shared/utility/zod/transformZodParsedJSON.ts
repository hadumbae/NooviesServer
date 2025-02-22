import ZodParseErrorHandler from "./ZodParseErrorHandler.js";
import type {ZodTypeAny} from "zod";

export default <TReturn = any>(schema: ZodTypeAny) => (value?: string) => {
    if (!value) return undefined;

    try {
        const result = JSON.parse(value);
        return schema.parse(result) as TReturn;
    } catch (e: any) {
        ZodParseErrorHandler(e, "Invalid Query Types.");
    }
}