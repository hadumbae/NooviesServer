import {model, type Model} from "mongoose";
import type {IMovieCredit} from "./MovieCredit.interface.js";
import {MovieCreditSchema} from "./MovieCredit.schema.js";

/**
 * Mongoose model for MovieCredit documents.
 *
 * Represents a credit for a person in a movie, either as CAST or CREW.
 *
 * The model enforces schema validation, including:
 * - Required references to `movie`, `person`, and `roleType`.
 * - Department-specific fields and boolean flags.
 * - Uniqueness constraints for billing order and credits.
 */
const MovieCredit: Model<IMovieCredit> = model<IMovieCredit>("MovieCredit", MovieCreditSchema);

export default MovieCredit