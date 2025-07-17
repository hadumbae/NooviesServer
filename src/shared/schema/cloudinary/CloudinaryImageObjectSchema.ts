import {z, type ZodType} from "zod";
import type ICloudinaryImage from "../../model/cloudinary-image/ICloudinaryImage.js";
import {NonNegativeNumberSchema} from "../numbers/NonNegativeNumberSchema.js";

import {PositiveNumberSchema} from "../numbers/PositiveNumberSchema.js";
import {ValidURLStringSchema} from "../strings/ValidURLStringSchema.js";
import {RequiredStringSchema} from "../strings/RequiredStringSchema.js";

/**
 * Zod schema defining the expected shape of a Cloudinary image upload response.
 *
 * Each field is required and validated:
 * - `public_id`, `format`, `resource_type`, `type`, `etag`, `signature` must be non-empty strings.
 * - `secure_url`, `url` must be valid URLs.
 * - `version` must be a finite UNIX number.
 * - `width`, `height`, `bytes` are non-negative numbers (>= 0).
 *
 * @remarks
 * This schema is used both at runtime to validate data and compile-time to enforce
 * the structure through `satisfies ZodType<ICloudinaryImage>`.
 *
 * @example
 * ```ts
 * const result = CloudinaryImageObjectSchema.safeParse(response);
 * if (!result.success) {
 *   console.error(result.error.issues);
 * } else {
 *   const img: CloudinaryImageObject = result.data;
 *   console.log(img.public_id, img.secure_url, img.width);
 * }
 * ```
 */
const CloudinaryImageObjectRawSchema = z.object({
    public_id: RequiredStringSchema,
    secure_url: ValidURLStringSchema,
    version: PositiveNumberSchema,
    width: NonNegativeNumberSchema,
    height: NonNegativeNumberSchema,
    format: RequiredStringSchema,
    resource_type: RequiredStringSchema,
    bytes: NonNegativeNumberSchema,
    type: RequiredStringSchema,
    etag: RequiredStringSchema,
    url: ValidURLStringSchema,
    signature: RequiredStringSchema,
});

/**
 * Zod schema statically ensured to match the TypeScript interface `ICloudinaryImage`.
 *
 * Using the TypeScript `satisfies` operator ensures that if the schema shape diverges
 * from `ICloudinaryImage`, a compile-time error is raised.
 */
export const CloudinaryImageObjectSchema = CloudinaryImageObjectRawSchema satisfies ZodType<ICloudinaryImage>;

/**
 * TypeScript type inferred from `CloudinaryImageObjectSchema`.
 *
 * This type is identical to `ICloudinaryImage`, but derived automatically from the schema.
 */
export type CloudinaryImageObject = z.infer<typeof CloudinaryImageObjectSchema>;