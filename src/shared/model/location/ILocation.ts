import type {IANATimezone} from "../../schema/date-time/IANATimezoneSchema.js";
import type ICoordinate from "../coordinate/ICoordinate.js";

/**
 * Interface representing a physical location.
 */
export default interface ILocation {
    /**
     * Street address (e.g., "123 Main St").
     */
    street?: string;

    /**
     * City name (e.g., "Bangkok").
     */
    city: string;

    /**
     * State or region (e.g., "California").
     */
    state?: string;

    /**
     * Country code in ISO 3166-1 alpha-2 format (e.g., "US", "TH").
     */
    country: string;

    /**
     * Postal or ZIP code.
     */
    postalCode?: string;

    /**
     * IANA timezone name (e.g., "Asia/Bangkok").
     */
    timezone: IANATimezone;

    /**
     * Optional GeoJSON Point for precise geolocation.
     */
    coordinates?: ICoordinate;
}