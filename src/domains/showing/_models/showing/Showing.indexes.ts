/**
 * @fileoverview Defines database indexes for the Showing schema to optimize query performance.
 */

import {ShowingSchema} from "./Showing.schema.js";

ShowingSchema.index({movie: 1, startTime: 1});

ShowingSchema.index({theatre: 1, screen: 1, startTime: 1});

ShowingSchema.index({startTime: 1, endTime: 1});

ShowingSchema.index({ startTime: 1, "config.isActive": 1, "config.isSpecialEvent": 1 });