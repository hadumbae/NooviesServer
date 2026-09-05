/**
 * @fileoverview Registers and configures the GraphQL HTTP handler middleware on the Express application.
 */

import { type Express } from "express";
import { buildSchema } from "graphql/utilities/index.js";
import { createHandler } from "graphql-http/lib/use/express";
import {resolvers} from "@/shared/graphql/resolvers.js";

/** Registers the GraphQL endpoint and handler on the provided Express application instance. */
export function registerGraphQL(app: Express) {
    // Build a simple schema; replace with actual schema as needed
    const schema = buildSchema(`type Query { hello: String } `);
    const rootValue = resolvers;

    // Register the GraphQL handler on the /graphql route
    app.all("/graphql", createHandler({schema, rootValue}));

    return app;
}