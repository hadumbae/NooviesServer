import {
    type ReserveTicketInputData,
    ReserveTicketInputSchema,
} from "../../schemas/reserve-ticket/ReserveTicket.input.schema.js";
import {RequestValidationError} from "../../../../shared/errors/RequestValidationError.js";

/**
 * Validates and parses ticket checkout input data.
 *
 * Uses the checkout input Zod schema to ensure the payload
 * is structurally valid and internally consistent.
 *
 * On validation failure, throws a domain-specific `ZodParseError`
 * containing the Zod error details and the raw input payload.
 *
 * @param data - Raw checkout input data to validate
 * @returns Parsed and type-safe checkout input data
 * @throws RequestValidationError When schema validation fails
 */
export function validateTicketReservationInput(data: ReserveTicketInputData): ReserveTicketInputData {
    const {data: parsedData, success, error} = ReserveTicketInputSchema.safeParse(data);

    if (!success) {
        throw new RequestValidationError({
            message: "Failed to parse ticket checkout input data.",
            errors: error?.errors,
            raw: data,
        });
    }

    return parsedData;
}
