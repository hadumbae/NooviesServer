/**
 * @fileoverview Utility for generating MongoDB aggregation match stages for theatre locations.
 */

/**
 * Creates a MongoDB $match stage to filter theatres by city, state, country, or postal code.
 */
export function buildTheatreLocationMatchStage(target: string) {
    return {
        $match: {
            $or: [
                {"location.city": target},
                {"location.state": target},
                {"location.country": target},
                {"location.postalCode": target},
            ],
        },
    }
}