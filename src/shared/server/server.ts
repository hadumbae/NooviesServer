import 'dotenv/config';
import express, { type Express } from 'express';
import RegisterParsers from "./RegisterParsers.js";
import RegisterRoutes from "./RegisterRoutes.js";
import errorHandler from "../utility/handlers/errorHandler.js";
import RegisterCORS from "./RegisterCORS.js";
import RegisterGraphQL from "./RegisterGraphQL.js";

/**
 * Main Express application instance.
 *
 * This module sets up and configures the Express app with:
 * 1. **CORS** via {@link RegisterCORS}.
 * 2. **Parsers** (JSON, URL-encoded, etc.) via {@link RegisterParsers}.
 * 3. **GraphQL endpoints** via {@link RegisterGraphQL}.
 * 4. **REST API routes** via {@link RegisterRoutes}.
 * 5. **Global error handling** via {@link errorHandler}.
 *
 * After configuration, the Express app is exported for use in
 * server startup scripts or testing.
 *
 * @example
 * ```ts
 * import app from "./config/App";
 *
 * const PORT = process.env.PORT || 4000;
 * app.listen(PORT, () => {
 *   console.log(`Server running on port ${PORT}`);
 * });
 * ```
 */
const app: Express = express();

RegisterCORS(app);
RegisterParsers(app);
RegisterGraphQL(app);
RegisterRoutes(app);

app.use(errorHandler);

export default app;
