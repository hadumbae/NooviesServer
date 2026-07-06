import {Person, type PersonSchemaFields} from "@/domains/persons";
import type {
    BrowsePersonsQueryMatchStage,
    BrowsePersonsQuerySortStage
} from "@/domains/persons/_feat/client-view-data/browse-persons";
import MovieCredit from "@/domains/movie-credits/_models/credit/MovieCredit.model";
import type {PaginationReturns} from "@/shared/types/PaginationReturns";

type FetchConfig = {
    page?: number;
    perPage?: number;
    match?: BrowsePersonsQueryMatchStage;
    sort?: BrowsePersonsQuerySortStage;
}

export async function fetchRoleNamesForPersons(_ids: string[]) {
    const results = await MovieCredit.aggregate([
        {$match: {person: {$in: _ids}}},
        {$lookup: {from: "roletypes", localField: "roleType", foreignField: "_id", as: "roleType"}},
        {$unwind: "roleType"},
        {$group: {_id: "$person", roleNames: {$addToSet: "$roleType.roleName"}}},
    ]);

    return new Map(results.map(({_id, roleNames}) => [_id, roleNames]));
}

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

    const roleNames = await fetchRoleNamesForPersons(persons.map(p => p._id.toString()));

    return {
        totalItems,
        items: persons.map(p => {
            (p as any).roleNames = roleNames.get(p._id.toString()) ?? [];
            return p;
        }),
    }
}