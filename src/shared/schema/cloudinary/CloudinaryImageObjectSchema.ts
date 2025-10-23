import { z } from "zod";
import { NonNegativeNumberSchema } from "../numbers/NonNegativeNumberSchema.js";
import { PositiveNumberSchema } from "../numbers/PositiveNumberSchema.js";
import { URLStringSchema } from "../strings/URLStringSchema.js";
import { NonEmptyStringSchema } from "../strings/NonEmptyStringSchema.js";
import preprocessEmptyToUndefined from "../../utility/zod/preprocessEmptyToUndefined.js";

/**
 * Schema variant of {@link PositiveNumberSchema} that
 * converts empty string inputs (`""`) to `undefined`
 * before validation.
 *
 * Useful for form submissions where numeric fields may
 * be empty but should not trigger validation errors.
 */
const CleanedPositiveNumberSchema = preprocessEmptyToUndefined(PositiveNumberSchema);

/**
 * Schema variant of {@link NonNegativeNumberSchema} that
 * converts empty string inputs (`""`) to `undefined`
 * before validation.
 *
 * Ensures empty fields in form data are safely ignored
 * instead of causing parsing failures.
 */
const CleanedNonNegativeNumberSchema = preprocessEmptyToUndefined(NonNegativeNumberSchema);

/**
 * Zod schema representing a Cloudinary image object.
 *
 * This schema validates the typical structure returned by
 * Cloudinary when uploading or fetching an image resource.
 * It ensures all required properties are present and typed
 * correctly, with numeric fields sanitized for optional form input.
 *
 * @example
 * CloudinaryImageObjectSchema.parse({
 *   public_id: "sample_image",
 *   secure_url: "https://res.cloudinary.com/demo/image/upload/v123456789/sample.jpg",
 *   version: 123456789,
 *   width: 800,
 *   height: 600,
 *   format: "jpg",
 *   resource_type: "image",
 *   bytes: 204800,
 *   type: "upload",
 *   etag: "abc123etag",
 *   url: "http://res.cloudinary.com/demo/image/upload/v123456789/sample.jpg",
 *   signature: "d41d8cd98f00b204e9800998ecf8427e"
 * }); // ✅ Valid
 */
export const CloudinaryImageObjectSchema = z.object({
    /** Public identifier of the image in Cloudinary. */
    public_id: NonEmptyStringSchema,

    /** Secure HTTPS URL of the image. */
    secure_url: URLStringSchema,

    /** Version number of the image, must be positive. */
    version: CleanedPositiveNumberSchema,

    /** Width of the image in pixels, must be non-negative. */
    width: CleanedNonNegativeNumberSchema,

    /** Height of the image in pixels, must be non-negative. */
    height: CleanedNonNegativeNumberSchema,

    /** File format of the image (e.g., "jpg", "png"). */
    format: NonEmptyStringSchema,

    /** Type of Cloudinary resource, typically "image". */
    resource_type: NonEmptyStringSchema,

    /** File size in bytes, must be non-negative. */
    bytes: CleanedNonNegativeNumberSchema,

    /** Upload type of the image, typically "upload". */
    type: NonEmptyStringSchema,

    /** ETag used for caching or version validation. */
    etag: NonEmptyStringSchema,

    /** Direct HTTP(S) URL of the image. */
    url: URLStringSchema,

    /** Cloudinary-generated signature for validation. */
    signature: NonEmptyStringSchema,
});

/**
 * Inferred TypeScript type representing a validated Cloudinary image object.
 *
 * Equivalent to:
 * ```ts
 * type CloudinaryImageObject = {
 *   public_id: string;
 *   secure_url: string;
 *   version: number;
 *   width: number;
 *   height: number;
 *   format: string;
 *   resource_type: string;
 *   bytes: number;
 *   type: string;
 *   etag: string;
 *   url: string;
 *   signature: string;
 * };
 * ```
 */
export type CloudinaryImageObject = z.infer<typeof CloudinaryImageObjectSchema>;
