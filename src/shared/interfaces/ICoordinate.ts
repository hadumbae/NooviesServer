/**
 * Interface representing a GeoJSON Point coordinate pair.
 */
export default interface ICoordinate {
    /**
     * The GeoJSON geometry type.
     * Must always be the literal string "Point".
     */
    type: "Point";

    /**
     * The coordinate pair as [longitude, latitude].
     * - Longitude (first element) must be between -180 and 180.
     * - Latitude (second element) must be between -90 and 90.
     */
    coordinates: number[];
}