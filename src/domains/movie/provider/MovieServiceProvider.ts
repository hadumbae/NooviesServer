import BaseRepository from "../../../shared/repository/BaseRepository.js";
import Movie, {type IMovie} from "../model/MovieModel.js";
import PaginationUtils from "../../../shared/utility/PaginationUtils.js";
import MovieController from "../controller/MovieController.js";

export default class MovieServiceProvider {
    static register() {
        const model = Movie;
        const populateRefs = ["genres", "directors", "cast", "showings"];

        const repository = new BaseRepository<IMovie>({model, populateRefs});
        const paginationUtils = PaginationUtils;

        const controller = new MovieController({repository, paginationUtils});

        return {
            repository,
            controller,
        }
    }
}