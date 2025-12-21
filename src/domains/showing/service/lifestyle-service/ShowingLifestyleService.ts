import type SeatMapService from "../../../seatmap/service/seat-map-service/SeatMapService.js";
import {type HydratedDocument, type Query, Schema} from "mongoose";
import type ShowingSchemaFields from "../../model/Showing.types.js";
import SeatMap from "../../../seatmap/model/SeatMap.model.js";

/**
 * @summary Constructor dependencies for `ShowingLifestyleService`.
 */
type ShowingLifestyleServiceConstructor = {
    /** Service responsible for creating seat maps for new showings. */
    seatMapService: SeatMapService;
};

/**
 * @summary Lifecycle hook manager for the Showing model.
 *
 * @description
 * Encapsulates all Mongoose lifecycle behavior related to `Showing` documents.
 *
 * Responsibilities:
 * - Automatically create a seat map when a showing is newly inserted.
 * - Populate seat-related virtuals when lean queries request virtuals.
 * - Cascade-delete associated seat maps when a showing is removed.
 */
export default class ShowingLifestyleService {
    private seatMapService: SeatMapService;

    /**
     * @param params - Required dependencies for lifecycle behavior.
     */
    constructor(params: ShowingLifestyleServiceConstructor) {
        const {seatMapService} = params;
        this.seatMapService = seatMapService;
    }

    /**
     * @summary Tracks whether a document is newly created.
     *
     * @description
     * Stores the original `isNew` state so the post-save hook can distinguish
     * between inserts and updates.
     */
    private handlePreSave = async function (this: HydratedDocument<ShowingSchemaFields>) {
        (this as any)._wasNew = (this as any).isNew;
    };

    /**
     * @summary Creates a seat map after a new showing is inserted.
     *
     * @description
     * Runs only for newly created documents and delegates seat map creation
     * to `SeatMapService`.
     */
    private handlePostSave = async (doc: HydratedDocument<ShowingSchemaFields>) => {
        const {_id} = doc;
        if (!_id) return;

        if ((doc as any)._wasNew) {
            await this.seatMapService.createShowingSeatMap({showingID: _id});
        }
    };

    /**
     * @summary Populates seat-related virtuals for lean queries.
     *
     * @description
     * Automatically applies population when `lean({ virtuals: true })`
     * is requested, ensuring virtual seat counts are available.
     */
    private handlePreFindQuery = async function (this: Query<any, ShowingSchemaFields>) {
        const hasVirtuals =
            typeof (this as any)._mongooseOptions.lean === "object" &&
            (this as any)._mongooseOptions.lean.virtuals === true;

        if (hasVirtuals) {
            (this as any).populate([
                {path: "seatMapCount"},
                {path: "availableSeatsCount"},
                {path: "reservedSeatsCount"},
                {path: "unreservedSeatsCount"},
            ]);
        }
    };

    /**
     * @summary Cascades seat map deletion when a showing document is removed.
     *
     * @description
     * Triggered when deletion occurs via a document operation.
     */
    private handlePostDeleteDocument = async (doc: HydratedDocument<ShowingSchemaFields>) => {
        const {_id} = doc;
        if (!_id) return;

        await SeatMap.deleteMany({showing: _id});
    };

    /**
     * @summary Cascades seat map deletion when a showing is removed via a query.
     *
     * @description
     * Handles deletions executed through query-based operations.
     */
    private handlePostDeleteQuery = async function (this: Query<any, ShowingSchemaFields>) {
        const {_id: showingID} = (this as any).getFilter();
        await SeatMap.deleteMany({showing: showingID});
    };

    /**
     * @summary Registers all lifecycle hooks on a Showing schema.
     *
     * @param schema - The Mongoose schema to attach hooks to.
     */
    public registerHooks(schema: Schema) {
        // --- Create Seat Map ---
        schema.pre("save", {document: true}, this.handlePreSave);
        schema.post("save", {document: true}, this.handlePostSave);

        // --- Populate Virtuals ---
        schema.pre(["find", "findOne", "findOneAndUpdate"], {query: true}, this.handlePreFindQuery);

        // --- Cascade Delete Seat Maps ---
        schema.post("deleteOne", {document: true, query: false}, this.handlePostDeleteDocument);
        schema.post(["deleteOne", "deleteMany"], {document: false, query: true}, this.handlePostDeleteQuery);
    }
}
