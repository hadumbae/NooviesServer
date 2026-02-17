/**
 * @file MovieServiceProvider.ts
 * Wires Movie model, repository, services, and controller dependencies.
 */

import MovieModel from "../model/Movie.model.js";

import MovieController from "../controller/MovieController.js";
import MovieImageService from "../service/MovieImageService.js";

import MovieService from "../service/movie/MovieService.js";
import MovieQueryOptionService from "../service/MovieQueryOptionService.js";
import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import type {MovieSchemaFields} from "../model/Movie.types.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import {MoviePopulationPipelines} from "../queries/MoviePopulationPipelines.js";
import {MovieVirtualPipelines} from "../queries/MovieVirtualPipelines.js";

/**
 * Composes and exposes Movie-related dependencies.
 */
export default class MovieServiceProvider {
    /**
     * Creates and returns configured Movie components.
     */
    static register() {
        const model = MovieModel;

        const populateRefs: PopulatePath[] = [
            {path: "genres"},
        ];

        const repository = new BaseRepository<MovieSchemaFields>({model, populateRefs});
        const service = new MovieService();
        const optionService = new MovieQueryOptionService();
        const imageService = new MovieImageService();

        const aggregateService = new AggregateQueryService({
            model,
            populationPipelines: MoviePopulationPipelines,
            virtualsPipelines: MovieVirtualPipelines,
        });

        const controller = new MovieController({
            repository,
            service,
            optionService,
            imageService,
            aggregateService,
        });

        return {
            model,
            repository,
            services: {
                imageService,
                optionService,
            },
            controllers: {
                controller,
            },
        };
    }
}
