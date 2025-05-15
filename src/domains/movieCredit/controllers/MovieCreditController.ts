import BaseCRUDController, {
    type IBaseCRUDController,
    type IBaseCRUDControllerConstructor
} from "../../../shared/controller/BaseCRUDController.js";
import type {IMovieCredit} from "../models/IMovieCredit.js";

export interface IMovieCreditConstructor extends IBaseCRUDControllerConstructor<IMovieCredit> {
}

export interface IMovieCreditController extends IBaseCRUDController {
}

export default class MovieCreditController extends BaseCRUDController<IMovieCredit> implements IMovieCreditController {
    constructor(params: IMovieCreditConstructor) {
        super({...params});
    }
}