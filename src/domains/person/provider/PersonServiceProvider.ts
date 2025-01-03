import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Person from "../model/Person.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import PersonController from "../controller/PersonController.js";

export default class PersonServiceProvider {
    static register() {
        const repository = new BaseRepository({model: Person, populateRefs: ["movies"]});
        const paginationUtils = PaginationUtils;

        const controller = new PersonController({repository, paginationUtils});

        return {
            repository,
            controller
        }
    }
}