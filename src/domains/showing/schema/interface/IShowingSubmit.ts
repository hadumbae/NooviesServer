export default interface IShowingSubmit {
    startTime: Date,
    endTime?: Date | null,
    ticketPrice: number,
    language: string,
    subtitleLanguages: string[],
    isSpecialEvent?: boolean,
    isActive?: boolean,

    movie: string,
    theatre: string,
    screen: string,
}