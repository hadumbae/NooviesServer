/**
 * @fileoverview Service for fetching and aggregating person data for the browse view.
 */

import {Person, type PersonSchemaFields} from "@/domains/persons";
import type {
    BrowsePersonsQueryMatchStage,
    BrowsePersonsQuerySortStage
} from "@/domains/persons/_feat/client-view-data/browse-persons";
import MovieCredit from "@/domains/movie-credits/_models/credit/MovieCredit.model";
import type {PaginationReturns} from "@/shared/types/PaginationReturns";
import {Types} from "mongoose";

/** Configuration options for fetching and filtering the browse person view data. */
type FetchConfig = {
    page?: number;
    perPage?: number;
    match?: BrowsePersonsQueryMatchStage;
    sort?: BrowsePersonsQuerySortStage;
}

/** Aggregates unique role names from movie credits for a list of person IDs. */
export async function fetchRoleNamesForPersons(_ids: Types.ObjectId[]) {
    const results = await MovieCredit.aggregate([
        {$match: {person: {$in: _ids}}},
        {$lookup: {from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType"}},
        {$unwind: "$roleType"},
        {$group: {_id: "$person", roleNames: {$addToSet: "$roleType.roleName"}}},
    ]);

    return new Map(results.map(({_id, roleNames}) => [_id.toString(), roleNames]));
}

/** Fetches a paginated list of persons with their associated role names. */
export async function fetchBrowsePersonViewData(
    config: FetchConfig
): Promise<PaginationReturns<PersonSchemaFields>> {
    const {
        page = 1,
        perPage = 10,
        sort = {$sort: {name: 1}},
        match = {$match: {}},
    } = config;

    const [totalItems, persons] = await Promise.all([
        Person.countDocuments(match.$match),
        Person
            .find(match.$match)
            .sort(sort.$sort)
            .skip((page - 1) * perPage)
            .limit(perPage)
    ]);

    const personRoles = await fetchRoleNamesForPersons(persons.map(p => p._id));

    return {
        totalItems,
        items: persons.map(p => ({
            ...p.toObject(),
            roleNames: personRoles.get(p._id.toString()) ?? []
        })),
    }
}