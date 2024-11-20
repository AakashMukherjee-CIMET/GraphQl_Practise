import express, { query } from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `#graphql
      type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
      }
      
      type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
      }

      type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!): User
      }
    `,
    resolvers: {
      Todo: {
        user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
      },
      Query: {
        getAllUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
        getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
        getUser: async (parent, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
      }
    },
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
