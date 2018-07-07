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
  GraphQLList,
} = graphql;

const parseResponse = response => response.data;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return jsonServer
          .get(`/companies/${parentValue.companyId}`)
          .then(parseResponse);
      },
    },
  }),
});

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return jsonServer
          .get(`/companies/${parentValue.id}/users`)
          .then(parseResponse);
      },
    },
  }),
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
          .then(parseResponse);
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return jsonServer
          .get(`/companies/${args.id}`)
          .then(parseResponse);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
