import SeatMap from "../domains/seatmap/model/SeatMap.model.js";

const updateSeatMapIndexes = async () => {
    await SeatMap.syncIndexes();
};

updateSeatMapIndexes()
    .catch(err => console.error(err));