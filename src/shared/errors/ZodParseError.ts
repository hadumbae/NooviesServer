import type {ZodIssue} from "zod";

export default class ZodParseError extends Error {
    public readonly errors: ZodIssue[];

    constructor(params: {message?: string, errors: ZodIssue[] }) {
        const {message, errors} = params;

        super(message);
        this.errors = errors;
    }

}