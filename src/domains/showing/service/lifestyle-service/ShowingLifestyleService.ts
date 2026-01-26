import type SeatMapService from "../../../seatmap/service/seat-map-service/SeatMapService.js";
import { type Aggregate, type HydratedDocument, type Query, Schema } from "mongoose";
import SeatMap from "../../../seatmap/model/SeatMap.model.js";
import type { ShowingSchemaFields } from "../../model/showing/Showing.types.js";
import { ShowingSeatMapVirtualPipelines } from "../../queries/ShowingSeatMapVirtualPipelines.js";

/**
 * Constructor dependencies for {@link ShowingLifestyleService}.
 */
type ShowingLifestyleServiceConstructor = {
    /** Service responsible for seat map creation and management. */
    seatMapService: SeatMapService;
};

/**
 * @file ShowingLifestyleService.ts
 *
 * Lifecycle hook manager for the `Showing` domain.
 *
 * @remarks
 * Centralizes all schema-level side effects for `Showing` documents,
 * keeping models declarative and domain behavior isolated.
 *
 * Responsibilities:
 * - Create seat maps on initial insert
 * - Inject seat-count virtuals into aggregation pipelines
 * - Auto-populate seat-count virtuals for lean queries
 * - Cascade-delete seat maps on removal
 */
export default class ShowingLifestyleService {
    private seatMapService: SeatMapService;

    /**
     * Creates a new lifecycle service instance.
     *
     * @param params - Required service dependencies.
     */
    constructor(params: ShowingLifestyleServiceConstructor) {
        this.seatMapService = params.seatMapService;
    }

    /**
     * Captures whether the document is newly inserted.
     *
     * @remarks
     * Persists the original `isNew` state so post-save logic
     * can distinguish inserts from updates.
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
     * Executes only for newly created documents.
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
     * Injects seat-count virtual fields into aggregation pipelines.
     *
     * @remarks
     * Activated only when `aggregate({ virtuals: true })` is used.
     * Appends `$lookup` and `$addFields` stages to the pipeline.
     */
    private handlePreAggregate = async function (
        this: Aggregate<ShowingSchemaFields>
    ) {
        const { virtuals } = this.options as { virtuals: boolean };
        if (!virtuals) return;

        this.pipeline().push(...ShowingSeatMapVirtualPipelines);
    };

    /**
     * Populates seat-count virtuals for lean queries.
     *
     * @remarks
     * Automatically applies population when `lean({ virtuals: true })`
     * is requested on find queries.
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
                { path: "unavailableSeatsCount" },
                { path: "soldSeatsCount" },
            ]);
        }
    };

    /**
     * Cascades seat map deletion after document-level removal.
     */
    private handlePostDeleteDocument = async (
        doc: HydratedDocument<ShowingSchemaFields>
    ) => {
        if (!doc._id) return;
        await SeatMap.deleteMany({ showing: doc._id });
    };

    /**
     * Cascades seat map deletion after query-based removal.
     */
    private handlePostDeleteQuery = async function (
        this: Query<any, ShowingSchemaFields>
    ) {
        const { _id: showingID } = (this as any).getFilter();
        if (!showingID) return;

        await SeatMap.deleteMany({ showing: showingID });
    };

    /**
     * Registers all lifecycle hooks on the given schema.
     *
     * @param schema - Target Mongoose schema.
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
