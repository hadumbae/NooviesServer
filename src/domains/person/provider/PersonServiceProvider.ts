import PersonModel from "../model/Person.model.js";
import {BaseRepository} from "../../../shared/repository/BaseRepository.js";
import PersonController from "../controller/PersonController.js";
import QueryUtils from "../../../shared/services/query-utils/QueryUtils.js";
import type { PopulatePath } from "../../../shared/types/mongoose/PopulatePath.js";
import PersonQueryOptionService from "../services/PersonQueryOptionService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import PersonImageService from "../services/image-service/PersonImageService.js";

/**
 * @class PersonServiceProvider
 * @description
 * Service provider responsible for registering and initializing
 * the components related to the Person entity: model, repository,
 * services, and controller.
 */
export default class PersonServiceProvider {
    /**
     * Registers the Person components and returns an object containing
     * the model, repository, and controllers.
     *
     * @static
     * @returns {Object} An object with the following structure:
     * {
     *   model: typeof PersonModel,
     *   repository: BaseRepository<PersonModel>,
     *   controllers: {
     *     controller: PersonController
     *   }
     * }
     */
    static register() {
        // Model representing Person
        const model = PersonModel;

        // Paths to populate for queries (empty here)
        const populateRefs: PopulatePath[] = [];

        // Utility for query manipulation
        const queryUtils = QueryUtils;

        // Repository for Person with CRUD operations and population options
        const repository = new BaseRepository({ model, populateRefs });

        // Service for handling advanced queries specific to Person
        const optionService = new PersonQueryOptionService();

        // Service for handling Person images via Cloudinary
        const imageService = new PersonImageService();

        // Service for aggregate queries for Person
        const aggregateService = new AggregateQueryService({ model, populateRefs });

        // Controller handling HTTP requests for Person
        const controller = new PersonController({
            repository,
            queryUtils,
            optionService,
            aggregateService,
            imageService,
        });

        return {
            model,
            repository,
            controllers: {
                controller
            }
        };
    }
}
