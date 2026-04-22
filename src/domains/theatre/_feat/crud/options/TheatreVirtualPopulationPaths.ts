/**
 * @fileoverview Configuration for virtual field population on the Theatre model.
 */

/**
 * Array of paths used to populate computed theatre metrics
 * including screen, seat, and upcoming showing counts.
 */
export const TheatreVirtualPopulationPaths = [
    {
        path: "screenCount",
    },
    {
        path: "seatCount",
    },
    {
        path: "futureShowingCount",
        match: {
            startTime: {
                $gte: new Date()
            },
        }
    },
];