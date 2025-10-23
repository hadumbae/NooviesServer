import { type Express } from "express";
import { buildSchema } from "graphql/utilities/index.js";
import { createHandler } from "graphql-http/lib/use/express";
import resolvers from "../graphql/resolvers.js";

/**
 * Registers a basic GraphQL endpoint on an Express application.
 *
 * This function sets up a `/graphql` route that handles GraphQL queries
 * using the provided schema and resolvers.
 *
 * @param app - The Express application instance to register the GraphQL endpoint on.
 * @returns The Express app with the GraphQL route registered.
 */
export default function registerGraphQL(app: Express) {
    // Build a simple schema; replace with actual schema as needed
    const schema = buildSchema(`type Query { hello: String } `);
    const rootValue = resolvers;

    // Register the GraphQL handler on the /graphql route
    app.all("/graphql", createHandler({ schema, rootValue }));

    return app;
};
