/**
 * @file MovieReview service registration.
 * MovieReviewServiceProvider.ts
 */

import {MovieReviewModel} from "../model/MovieReview.model.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import {MovieReviewPopulatePaths} from "../queries/MovieReviewPopulatePaths.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import {MovieReviewPopulationPipelines} from "../queries/MovieReviewPopulationPipelines.js";
import {MovieReviewCRUDController} from "../controllers/crud/MovieReviewCRUDController.js";
import {MovieReviewCRUDWriter} from "../repositories/MovieReviewCRUDWriter.js";

/**
 * Registers MovieReview data access and controller services.
 */
export class MovieReviewServiceProvider {
    static register() {
        const model = MovieReviewModel;

        const repository = new BaseRepository({
            model,
            populateRefs: MovieReviewPopulatePaths,
            writer: new MovieReviewCRUDWriter(),
        });

        const aggregateService = new AggregateQueryService({
            model,
            populationPipelines: MovieReviewPopulationPipelines,
        });

        const crudController = new MovieReviewCRUDController({
            repository,
            aggregateService,
        });

        return {
            model,
            repository,
            controllers: {
                crudController,
            },
            services: {
                aggregateService,
            },
        };
    }
}