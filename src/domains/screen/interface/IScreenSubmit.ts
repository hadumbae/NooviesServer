import type {ScreenTypeEnumType} from "../schema/enum/ScreenTypeEnum.js";

export interface IScreenSubmit {
    name: string,
    capacity: number,
    screenType: ScreenTypeEnumType,
    theatre: string,
}