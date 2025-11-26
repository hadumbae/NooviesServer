import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";

/**
 * ## SeatMap Populate References
 *
 * Default population paths for the `SeatMap` Mongoose model.
 *
 * These values provide a consistent set of reference paths that can be reused
 * throughout repositories, services, and controllers when performing Mongoose
 * `.populate()` operations.
 *
 * Using this constant helps avoid hard-coding string paths and ensures that
 * population keys remain type-safe and synchronized with the underlying schema.
 *
 * @remarks
 * The `as const` assertion preserves literal string types and infers the tuple
 * as a readonly array of `"seat"` and `"showing"`.
 *
 * @example
 * ```ts
 * SeatMapModel.find()
 *   .populate(SeatMapPopulateRefs)
 *   .exec();
 * ```
 *
 * @see ISeatMap – For the underlying model interface.
 */
const SeatMapPopulateRefs: PopulatePath[] = ["seat", "showing"] as const;

export default SeatMapPopulateRefs;
