/**
 * @file MovieReview service registration.
 * MovieReviewServiceProvider.ts
 */

import {MovieReview} from "../model/MovieReview.model.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import {MovieReviewPopulatePaths} from "../queries/MovieReviewPopulatePaths.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import {MovieReviewPopulationPipelines} from "../queries/MovieReviewPopulationPipelines.js";
import {MovieReviewCRUDController} from "../controllers/crud/MovieReviewCRUDController.js";
import {MovieReviewQueryOptionService} from "../services/query-options/MovieReviewQueryOptionService.js";

/**
 * Registers MovieReview data access and controller services.
 */
export class MovieReviewServiceProvider {
    static register() {
        const model = MovieReview;

        const repository = new BaseRepository({
            model,
            populateRefs: MovieReviewPopulatePaths,
        });

        const aggregateService = new AggregateQueryService({
            model,
            populationPipelines: MovieReviewPopulationPipelines,
        });

        const optionService = new MovieReviewQueryOptionService();

        const crudController = new MovieReviewCRUDController({
            repository,
            aggregateService,
            optionService,
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