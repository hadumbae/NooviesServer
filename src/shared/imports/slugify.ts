import slugify from "slugify";

/**
 * Re-export of `slugify` with corrected default export typing.
 *
 * This wrapper normalizes the module’s default export for ESM/TypeScript
 * interoperability, ensuring `slugify` can be imported as a proper
 * callable function with accurate typings.
 */
export default slugify as unknown as typeof slugify.default;
