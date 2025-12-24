import type {Query} from "mongoose";
import type {RequestOptions} from "../../types/request-options/RequestOptions.js";

/**
 * Parameters for {@link populateQuery}.
 *
 * @template ResultType - Result type returned by the query.
 * @template DocType - Underlying Mongoose document type.
 */
type QueryParams<ResultType, DocType> = {
    /** Mongoose query instance to modify. */
    query: Query<ResultType, DocType>;
    /** Request-level query options. */
    options?: RequestOptions;
};

/**
 * Applies population and virtual configuration to a Mongoose query.
 *
 * Conditionally enables:
 * - Reference population
 * - Lean results with virtuals
 *
 * @template ResultType - Result type returned by the query.
 * @template DocType - Underlying Mongoose document type.
 *
 * @param params - Query and request options.
 * @returns The modified query instance.
 */
export default function populateQuery<ResultType, DocType>(
    params: QueryParams<ResultType, DocType>,
): Query<ResultType, DocType> {
    const {
        query,
        options: {populate, virtuals, populatePaths = []} = {},
    } = params;

    if (populate) {
        query.populate(populatePaths);
    }

    if (virtuals) {
        query.lean({virtuals: true});
    }

    return query;
}
