import 'dotenv/config';
import express, { type Express } from 'express';
import errorHandler from "../utility/handlers/errorHandler.js";
import registerParsers from "./registerParsers.js";
import registerRoutes from "./registerRoutes.js";
import registerCORS from "./registerCORS.js";
import registerGraphQL from "./registerGraphQL.js";

/**
 * Main Express application instance.
 *
 * This module sets up and configures the Express app with the following:
 * 1. **CORS** via {@link registerCORS}.
 * 2. **Parsers** (JSON, cookies) via {@link registerParsers}.
 * 3. **GraphQL endpoints** via {@link registerGraphQL}.
 * 4. **REST API routes** via {@link registerRoutes}.
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

// Register middlewares and routes
registerCORS(app);
registerParsers(app);
registerGraphQL(app);
registerRoutes(app);

// Global error handler should be registered last
app.use(errorHandler);

export default app;
