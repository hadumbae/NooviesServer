/**
 * Represents a single populate option for Mongoose queries.
 *
 * Allows specifying a path to populate and nested population options.
 */
export type PopulateOption = {
    /** The path of the field to populate. */
    path: string;
    /** Optional nested populate options. Can be a single option or an array of options. */
    populate?: PopulateOption | PopulateOption[];
};

/**
 * Represents a path or option for populating referenced documents in Mongoose.
 *
 * Can be a simple string path or a detailed {@link PopulateOption}.
 */
export type PopulatePath = string | PopulateOption;
