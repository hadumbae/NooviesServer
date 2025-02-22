import {type Express} from "express";
import {buildSchema} from "graphql/utilities/index.js";
import {createHandler} from "graphql-http/lib/use/express";
import resolvers from "../graphql/resolvers.js";

export default (app: Express) => {

    const schema = buildSchema(`type Query { hello: String, bello: String } `);
    const rootValue = resolvers;

    app.all("/graphql", createHandler({schema, rootValue}));

    return app;
};