// import required staffs for gql
const { GraphQLSchema, GraphQLObjectType } = require('graphql');

//import queries

const { users, user, posts, post, comments, comment, currentUser } = require('./queries')

//import mutations
const { register, login, addPost, addComment, updatePost, deletePost } = require('./mutations')

//define query type

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'Queries',
    fields: { users, user, posts, post, comments, comment, currentUser }
})

//define mutation type

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'Mutations',
    fields: { register, login, addPost, addComment, updatePost, deletePost }
})

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})