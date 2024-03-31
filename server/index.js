  const express = require('express')
  const { connectDb } = require('./config/database')
  const { ApolloServer } = require("@apollo/server");
  const { startStandaloneServer } = require("@apollo/server/standalone");
  const { readFileSync } = require("fs");
  const path = require("path");
  const { gql } = require("graphql-tag");
  const app = express()
  const cors = require('cors')
  const typeDefs = require("./graphql/schema")
  const resolvers= require("./resolver")
  const verifyToken=require("./middleware/verifyToken")

  app.use(cors())

  connectDb();

  async function startApolloServer() {
      const server = new ApolloServer({ typeDefs , resolvers});
      const { url } = await startStandaloneServer(server,{
        context:verifyToken
      });
      console.log(`
      🚀  Server is running!
      📭  Query at ${url}
    `);
  }

  startApolloServer();