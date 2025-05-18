// * originalTitle
// * tagline
// * country
// * originalLanguage

export default interface IMovieSubmit {
    title: string,
    originalTitle: string,
    tagline?: string,
    synopsis: string,
    genres: string[],
    releaseDate?: string | null,
    runtime: number,
    country: string,
    originalLanguage: string,
    languages?: string[],
    subtitles?: string[],
    trailerURL?: string | null,
}