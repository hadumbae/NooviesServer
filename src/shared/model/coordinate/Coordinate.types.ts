/**
 * @fileoverview Interface definition for GeoJSON Point coordinate geometry structures.
 */

/** Schema definition for GeoJSON Point coordinate geometry objects. */
export type CoordinateSchemaFields = {
    type: "Point";
    coordinates: number[];
};