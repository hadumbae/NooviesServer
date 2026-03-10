/**
 * @file Composes and registers movie module dependencies.
 * @filename MovieServiceProvider.ts
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
import {MoviePopulatePaths} from "../queries/MoviePopulatePaths.js";

/**
 * Dependency provider for the movie module.
 */
export default class MovieServiceProvider {
    /**
     * Registers and returns configured movie components.
     */
    static register() {
        const model = MovieModel;
        const populateRefs: PopulatePath[] = MoviePopulatePaths;

        const repository = new BaseRepository<MovieSchemaFields>({model, populateRefs});
        const service = new MovieService();
        const optionService = new MovieQueryOptionService();
        const imageService = new MovieImageService();

        const aggregateService = new AggregateQueryService({
            model,
            populationPipelines: MoviePopulationPipelines,
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
            populateRefs,
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