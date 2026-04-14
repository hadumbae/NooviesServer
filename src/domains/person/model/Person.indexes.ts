/**
 * @fileoverview Database indexes for the Person collection.
 * Optimizes searches by name (case-insensitive) and nationality.
 */

import {PersonSchema} from "@domains/person/model/Person.schema";

/**
 * Case-insensitive index on 'name' for efficient searching and sorting.
 */
PersonSchema.index(
    {name: 1},
    {collation: {locale: "en", strength: 2}},
);

/**
 * Standard index on 'nationality' for category-based filtering.
 */
PersonSchema.index({nationality: 1});