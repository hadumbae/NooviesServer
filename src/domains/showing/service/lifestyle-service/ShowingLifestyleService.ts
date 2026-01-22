import type SeatMapService from "../../../seatmap/service/seat-map-service/SeatMapService.js";
import { type Aggregate, type HydratedDocument, type Query, Schema } from "mongoose";
import SeatMap from "../../../seatmap/model/SeatMap.model.js";
import type { ShowingSchemaFields } from "../../model/Showing.types.js";

/**
 * Constructor dependencies for {@link ShowingLifestyleService}.
 */
type ShowingLifestyleServiceConstructor = {
    /** Service responsible for creating seat maps for newly created showings. */
    seatMapService: SeatMapService;
};

/**
 * @file ShowingLifestyleService.ts
 *
 * Mongoose lifecycle hook manager for the `Showing` domain.
 *
 * @remarks
 * Centralizes all schema-level side effects and derived behavior for
 * `Showing` documents, keeping models declarative and services isolated.
 *
 * Responsibilities:
 * - Create seat maps when a showing is first inserted
 * - Inject seat-count virtuals into aggregate pipelines
 * - Populate seat-related virtuals for lean queries
 * - Cascade-delete seat maps on showing removal
 */
export default class ShowingLifestyleService {
    private seatMapService: SeatMapService;

    /**
     * Creates a new {@link ShowingLifestyleService}.
     *
     * @param params - Required lifecycle dependencies.
     */
    constructor(params: ShowingLifestyleServiceConstructor) {
        const { seatMapService } = params;
        this.seatMapService = seatMapService;
    }

    /**
     * Tracks whether the document was newly inserted.
     *
     * @remarks
     * Persists the original `isNew` flag so post-save logic can
     * differentiate inserts from updates.
     */
    private handlePreSave = async function (
        this: HydratedDocument<ShowingSchemaFields>
    ) {
        (this as any)._wasNew = this.isNew;
    };

    /**
     * Creates a seat map after a successful insert.
     *
     * @remarks
     * Executes only for newly created documents and delegates
     * seat map creation to {@link SeatMapService}.
     */
    private handlePostSave = async (
        doc: HydratedDocument<ShowingSchemaFields>
    ) => {
        if (!doc._id) return;

        if ((doc as any)._wasNew) {
            await this.seatMapService.createShowingSeatMap({
                showingID: doc._id,
            });
        }
    };

    /**
     * Injects seat-count virtual fields into aggregate pipelines.
     *
     * @remarks
     * Activated only when `aggregate({ virtuals: true })` is used.
     * Computes derived seat counts via `$lookup` and `$addFields`.
     */
    private handlePreAggregate = async function (
        this: Aggregate<ShowingSchemaFields>
    ) {
        const { virtuals } = this.options as { virtuals: boolean };
        if (!virtuals) return;

        const pipeline = this.pipeline();

        pipeline.push(
            {
                $lookup: {
                    from: "SeatMaps",
                    localField: "_id",
                    foreignField: "showing",
                    as: "_sms",
                },
            },
            {
                $addFields: {
                    seatMapCount: { $size: "$_sms" },
                    unavailableSeatsCount: {
                        $size: {
                            $filter: {
                                input: "$_sms",
                                as: "usc",
                                cond: { $eq: ["$usc.status", "UNAVAILABLE"] },
                            },
                        },
                    },
                    availableSeatsCount: {
                        $size: {
                            $filter: {
                                input: "$_sms",
                                as: "asc",
                                cond: { $eq: ["$asc.status", "AVAILABLE"] },
                            },
                        },
                    },
                    reservedSeatsCount: {
                        $size: {
                            $filter: {
                                input: "$_sms",
                                as: "rsc",
                                cond: { $eq: ["$rsc.status", "RESERVED"] },
                            },
                        },
                    },
                    soldSeatsCount: {
                        $size: {
                            $filter: {
                                input: "$_sms",
                                as: "ssc",
                                cond: { $eq: ["$ssc.status", "SOLD"] },
                            },
                        },
                    },
                },
            },
            { $project: { _sms: 0 } }
        );
    };

    /**
     * Populates seat-related virtuals for lean queries.
     *
     * @remarks
     * Automatically applies population when `lean({ virtuals: true })`
     * is requested, ensuring derived seat counts are available.
     */
    private handlePreFindQuery = async function (
        this: Query<any, ShowingSchemaFields>
    ) {
        const leanOptions = (this as any)._mongooseOptions?.lean;

        if (typeof leanOptions === "object" && leanOptions.virtuals === true) {
            (this as any).populate([
                { path: "seatMapCount" },
                { path: "availableSeatsCount" },
                { path: "reservedSeatsCount" },
                { path: "unreservedSeatsCount" },
            ]);
        }
    };

    /**
     * Cascades seat map deletion after a document-level removal.
     */
    private handlePostDeleteDocument = async (
        doc: HydratedDocument<ShowingSchemaFields>
    ) => {
        if (!doc._id) return;
        await SeatMap.deleteMany({ showing: doc._id });
    };

    /**
     * Cascades seat map deletion after a query-based removal.
     */
    private handlePostDeleteQuery = async function (
        this: Query<any, ShowingSchemaFields>
    ) {
        const { _id: showingID } = (this as any).getFilter();
        if (!showingID) return;

        await SeatMap.deleteMany({ showing: showingID });
    };

    /**
     * Registers all lifecycle hooks on the provided schema.
     *
     * @param schema - Mongoose schema to attach lifecycle behavior to.
     */
    public registerHooks(schema: Schema) {
        // --- Insert lifecycle ---
        schema.pre("save", { document: true }, this.handlePreSave);
        schema.post("save", { document: true }, this.handlePostSave);

        // --- Aggregation virtuals ---
        schema.pre("aggregate", this.handlePreAggregate);

        // --- Lean virtual population ---
        schema.pre(
            ["find", "findOne", "findOneAndUpdate"],
            { query: true },
            this.handlePreFindQuery
        );

        // --- Cascade deletion ---
        schema.post(
            "deleteOne",
            { document: true, query: false },
            this.handlePostDeleteDocument
        );
        schema.post(
            ["deleteOne", "deleteMany"],
            { document: false, query: true },
            this.handlePostDeleteQuery
        );
    }
}
