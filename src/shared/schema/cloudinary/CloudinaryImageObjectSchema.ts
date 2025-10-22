import {z} from "zod";
import {NonNegativeNumberSchema} from "../numbers/NonNegativeNumberSchema.js";

import {PositiveNumberSchema} from "../numbers/PositiveNumberSchema.js";
import {URLStringSchema} from "../strings/URLStringSchema.js";
import {NonEmptyStringSchema} from "../strings/NonEmptyStringSchema.js";

/**
 * Schema representing a Cloudinary image object.
 *
 * This schema validates the typical response returned by Cloudinary when
 * uploading or fetching an image. It ensures that all required properties
 * are present and have the correct types/constraints.
 */
export const CloudinaryImageObjectSchema = z.object({
    /** Public identifier of the image in Cloudinary. */
    public_id: NonEmptyStringSchema,

    /** Secure HTTPS URL of the image. */
    secure_url: URLStringSchema,

    /** Version number of the image, must be positive. */
    version: PositiveNumberSchema,

    /** Width of the image in pixels, non-negative. */
    width: NonNegativeNumberSchema,

    /** Height of the image in pixels, non-negative. */
    height: NonNegativeNumberSchema,

    /** Format of the image file (e.g., "jpg", "png"). */
    format: NonEmptyStringSchema,

    /** Resource type, usually "image". */
    resource_type: NonEmptyStringSchema,

    /** Size of the image file in bytes, non-negative. */
    bytes: NonNegativeNumberSchema,

    /** Type of the image, typically "upload". */
    type: NonEmptyStringSchema,

    /** ETag provided by Cloudinary for caching/versioning. */
    etag: NonEmptyStringSchema,

    /** URL of the image (HTTP or HTTPS). */
    url: URLStringSchema,

    /** Signature returned by Cloudinary for validation. */
    signature: NonEmptyStringSchema,
});

/**
 * TypeScript type inferred from {@link CloudinaryImageObjectSchema}.
 *
 * Represents a fully validated Cloudinary image object.
 */
export type CloudinaryImageObject = z.infer<typeof CloudinaryImageObjectSchema>;