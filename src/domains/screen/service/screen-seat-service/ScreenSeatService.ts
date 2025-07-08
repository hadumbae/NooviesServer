import type {PipelineStage} from "mongoose";
import Seat from "../../../seat/model/Seat.js";
import type {FetchSeatsByRowParams, IScreenSeatService, SeatsByRow} from "./ScreenSeatService.types.js";

export default class ScreenSeatService implements IScreenSeatService {
    async fetchSeatsByRow(params: FetchSeatsByRowParams): Promise<SeatsByRow[]> {
        const {screenID, populate} = params;

        const pipelines: PipelineStage[] = [];

        const populateStages = populate ? this.constructPopulateStages() : [];
        const groupStage = this.constructGroupStage();
        const projectStage = this.constructProjectStage();

        pipelines.push({$match: {screen: screenID}});
        pipelines.push(...populateStages);
        pipelines.push({$sort: {row: 1, seatNumber: 1}});
        pipelines.push(groupStage);
        pipelines.push(projectStage);

        return Seat.aggregate(pipelines);
    }

    constructGroupStage(): PipelineStage.Group {
        return {
            $group: {
                _id: "$row",
                numberOfSeats: {$sum: 1},
                seats: {
                    $push: {
                        _id: "$_id",
                        theatre: "$theatre",
                        screen: "$screen",
                        row: "$row",
                        seatNumber: "$seatNumber",
                        seatLabel: "$seatLabel",
                        seatType: "$seatType",
                        isAvailable: "$isAvailable",
                        priceMultiplier: "$priceMultiplier",
                        x: "$x",
                        y: "$y",
                    }
                }
            }
        };
    }

    constructProjectStage(): PipelineStage.Project {
        return {
            $project: {
                _id: 0,
                row: "$_id",
                numberOfSeats: 1,
                seats: 1,
            }
        };
    }

    constructPopulateStages(): (PipelineStage.Lookup | PipelineStage.Unwind)[] {
        return [
            {$lookup: {from: "Theatre", localField: "theatre", foreignField: "_id", as: "theatre"}},
            {$lookup: {from: "Screen", localField: "screen", foreignField: "_id", as: "screen"}},
            {$unwind: "$theatre"},
            {$unwind: "$screen"},
        ];
    }
}