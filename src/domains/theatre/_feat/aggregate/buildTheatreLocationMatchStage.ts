/**
 * @fileoverview Utility for generating MongoDB aggregation match stages for theatre locations.
 */
import type {ISO3166Alpha2CountryCode} from "@/shared/schema/enums/ISO3166Alpha2CountryCodeSchema";

type BuilderConfig = {
    target?: string;
    country?: ISO3166Alpha2CountryCode;
}

/**
 * Creates a MongoDB $match stage to filter theatres by city, state, country, or postal code.
 */
export function buildTheatreLocationMatchStage(
    {target, country}: BuilderConfig
) {
    const targetFields = [
        {"location.city": target},
        {"location.state": target},
        {"location.postalCode": target},
    ];

    const countryFields = [
        {"location.country": country},
    ];

    return {
        $match: {
            $or: [
                ...target ? targetFields : [],
                ...country ? countryFields : [],
            ],
        },
    }
}