import type {ZodIssue, ZodTypeAny} from "zod";

interface ParseReturn<TData = any>{
    data: TData | null,
    errors: ZodIssue[] | null
}

export const safeParse = <
    TSchema extends ZodTypeAny,
    TData = any
>(
    params: {schema: TSchema, data: TData}
): ParseReturn<TData> => {
    const {schema, data} = params;
    const parsedResult = schema.safeParse(data);

    if (parsedResult.success) return {data: parsedResult.data, errors: null};
    return {data: null, errors: parsedResult.error.errors};
}

export const safeParseAsync = async <
    TSchema extends ZodTypeAny,
    TData = any
>(
    params: {schema: TSchema, data: TData}
): Promise<ParseReturn<TData>> => {
    const {schema, data} = params;
    const parsedResult = await schema.safeParseAsync(data);

    if (parsedResult.success) return {data: parsedResult.data, errors: null};
    return {data: null, errors: parsedResult.error.errors};
}