import Person from "../model/Person.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import PersonController from "../controller/PersonController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";
import type {PopulatePath} from "../../../shared/types/PopulatePath.js";
import PersonQueryService from "../service/PersonQueryService.js";

export default class PersonServiceProvider {
    static register() {
        const model = Person;
        const populateRefs: PopulatePath[] = [
            {path: "movies", populate: {path: "movie"}},
        ];

        const queryUtils = QueryUtils;
        const repository = new BaseRepository({model, populateRefs});
        const queryService = new PersonQueryService();

        const controller = new PersonController({repository, queryUtils, queryService});

        return {
            repository,
            controller
        }
    }
}