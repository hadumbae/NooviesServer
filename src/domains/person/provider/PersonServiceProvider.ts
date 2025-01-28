import Person from "../model/Person.js";
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import PersonController from "../controller/PersonController.js";
import QueryUtils from "../../../shared/utility/query/QueryUtils.js";

export default class PersonServiceProvider {
    static register() {
        const model = Person;
        const populateRefs = ["movies"];

        const queryUtils = QueryUtils;
        const repository = new BaseRepository({model, populateRefs});

        const controller = new PersonController({repository, queryUtils});

        return {
            repository,
            controller
        }
    }
}