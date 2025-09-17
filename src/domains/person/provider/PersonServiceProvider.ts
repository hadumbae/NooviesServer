import PersonModel from "../model/Person.model.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import PersonController from "../controller/PersonController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import type { PopulatePath } from "../../../shared/types/PopulatePath.js";
import PersonQueryService from "../services/PersonQueryService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import PersonImageService from "../services/image-service/PersonImageService.js";
import CloudinaryUtils from "../../../shared/utility/CloudinaryUtils.js";

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

        // Utility for handling Cloudinary image operations
        const cloudinaryUtils = new CloudinaryUtils();

        // Repository for Person with CRUD operations and population options
        const repository = new BaseRepository({ model, populateRefs });

        // Service for handling advanced queries specific to Person
        const queryService = new PersonQueryService();

        // Service for handling Person images via Cloudinary
        const imageService = new PersonImageService({ cloudinaryUtils });

        // Service for aggregate queries for Person
        const aggregateService = new AggregateQueryService({ model, populateRefs });

        // Controller handling HTTP requests for Person
        const controller = new PersonController({
            repository,
            queryUtils,
            queryService,
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
