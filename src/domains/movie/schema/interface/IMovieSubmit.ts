export default interface IMovieSubmit {
    title: string,
    description: string,
    genres: string[],
    directors: string[],
    cast: string[],
    releaseDate: Date,
    durationInMinutes: number,
    languages?: string[],
    subtitles?: string[],
    trailerURL?: string | null,
    price: number,
}