/**
 * @fileoverview Defines database indexes for the Movie schema to optimize query performance.
 */

import {MovieSchema} from "@/domains/movie/model/movie/Movie.schema";

MovieSchema.index({title: 1});
MovieSchema.index({originalTitle: 1});
MovieSchema.index({releaseDate: -1});
MovieSchema.index({isAvailable: 1});
