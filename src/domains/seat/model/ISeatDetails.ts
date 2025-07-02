import type ITheatre from "../../theatre/model/ITheatre.js";
import type {IScreen} from "../../screen/interface/IScreen.js";
import type ISeatBase from "./ISeatBase.js";

/**
 * Extended seat interface with fully populated screen and theatre references.
 * Used when detailed seat information is needed (e.g., in populated query results).
 */
export default interface ISeatDetails extends ISeatBase {
    /**
     * The screen this seat belongs to, fully populated.
     */
    screen: IScreen;

    /**
     * The theatre this seat belongs to, fully populated.
     */
    theatre: ITheatre;
}