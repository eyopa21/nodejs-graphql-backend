const { GraphQLList, GraphQLID, GraphQLScalarType, GraphQLString } = require('graphql')

const { User, Post, Comment } = require('../models')
const { UserType, PostType, CommentType } = require('./types')



const users = {
    type: new GraphQLList(UserType),
    description: 'retrive all the users',
    resolve(parent, args) {
        return User.find()
    }

}

const user = {
    type: UserType,
    description: 'retrive single users',
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
        return User.findById(args.id)
    }

}

const currentUser = {
    type: UserType,
    description: 'current user',

    resolve(parent, args, { verifiedUser }) {
        console.log("currentUser", verifiedUser)

        if (verifiedUser) {
            console.log("good");
            return {
                id: verifiedUser._id,
            }
        } else {
            throw new Error('unAuthorized')
        }


    }
}

const posts = {
    type: new GraphQLList(PostType),
    description: "get all posts",
    resolve(parent, args) {
        return Post.find()
    }
}

const post = {
    type: PostType,
    desription: "get single post",
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
        return Post.findById(args.id)
    }
}


const comments = {
    type: new GraphQLList(CommentType),
    description: "get all comments",
    resolve(parent, args) {
        return Comment.find()
    }
}

const comment = {
    type: CommentType,
    desription: "get single comment",
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
        return Comment.findById(args.id)
    }
}


module.exports = { users, user, posts, post, comments, comment, currentUser }