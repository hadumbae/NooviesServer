/**
 * Checks whether a given value appears to be a Multer file object.
 *
 * Multer file objects are typically provided by the Multer
 * middleware in Express when handling file uploads. A valid
 * Multer file object should have at least the following string
 * properties:
 * - `originalname` – the name of the file on the user's computer
 * - `mimetype` – the MIME type of the file
 *
 * @param file - The value to check, e.g., `req.file` or an item from `req.files`.
 * @returns `true` if the input has `originalname` and `mimetype` as strings, otherwise `false`.
 *
 * @example
 * ```ts
 * if (isMulterFile(req.file)) {
 *   console.log("Valid file uploaded:", req.file.originalname);
 * } else {
 *   console.log("No valid file uploaded");
 * }
 * ```
 */
export default function isMulterFile(file: any): boolean {
    return (
        file &&
        typeof file === "object" &&
        typeof file.originalname === "string" &&
        typeof file.mimetype === "string"
    );
}
