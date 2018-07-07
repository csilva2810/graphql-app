const graphql = require('graphql');
const axios = require('axios');

const jsonServer = axios.create({
  baseURL: 'http://localhost:3000',
});

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;

const users = [
  { id: '1', firstName: 'Ronald', age: 23 },
  { id: '2', firstName: 'Hermione', age: 22 },
  { id: '3', firstName: 'Harry', age: 22 },
];

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return jsonServer
          .get(`/users/${args.id}`)
          .then(response => response.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
