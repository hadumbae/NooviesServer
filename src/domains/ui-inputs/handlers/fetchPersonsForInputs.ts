/**
 * @fileoverview Handler for fetching minimal person data for UI input selections.
 */

import {Person} from "@/domains/persons/_models/person/Person.model";
import type {PersonSchemaFields} from "@/domains/persons/_models/person/Person.types";
import type {FetchLeanDataConfig} from "@/domains/ui-inputs/handlers/fetchLeanDataConfig";

/** Fetches a list of persons with only essential fields for display in UI inputs. */
export async function fetchPersonsForInputs(
    {filters, sorts}: FetchLeanDataConfig<PersonSchemaFields> = {}
): Promise<PersonSchemaFields[]> {
    return Person
        .find(filters ?? {})
        .sort(sorts)
        .select("_id name dob nationality")
        .lean();
}