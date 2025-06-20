import Person from "../model/Person.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import PersonController from "../controller/PersonController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import type {PopulatePath} from "../../../shared/types/PopulatePath.js";
import PersonQueryService from "../services/PersonQueryService.js";
import AggregateQueryService from "../../../shared/services/aggregate/AggregateQueryService.js";
import PersonImageService from "../services/image-service/PersonImageService.js";
import CloudinaryUtils from "../../../shared/utility/CloudinaryUtils.js";

export default class PersonServiceProvider {
    static register() {
        const model = Person;
        const populateRefs: PopulatePath[] = [
            {path: "movies", populate: {path: "movie"}},
        ];

        const queryUtils = QueryUtils;
        const cloudinaryUtils = new CloudinaryUtils();
        const repository = new BaseRepository({model, populateRefs});

        const queryService = new PersonQueryService();
        const imageService = new PersonImageService({cloudinaryUtils});
        const aggregateService = new AggregateQueryService({model, populateRefs});

        const controller = new PersonController({
            repository,
            queryUtils,
            queryService,
            aggregateService,
            imageService,
        });

        return {
            repository,
            controller
        }
    }
}