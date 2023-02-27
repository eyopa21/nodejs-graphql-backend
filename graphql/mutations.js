const { GraphQLString, GraphQLObjectType } = require('graphql');

const { PostType, CommentType, UserType } = require('./types')
const { User, Post, Comment } = require('../models')
const { createJwtToken } = require('../util/auth')


const register = {
    type: GraphQLString,
    description: "Register new user",
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        displayName: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const { username, email, password, displayName } = args;
        const user = new User({ username, email, password, displayName })

        await user.save();
        const token = createJwtToken(user);
        return token;
    }
}


const login = {
    type: GraphQLString,
    escription: "login user",
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent, args, { verifiedUser }) {
        console.log("vu", verifiedUser)

        const user = await User.findOne({ email: args.email }).select('+password')
        if (!user) {
            throw new Error("User not found")
        } else if (args.password !== user.password) {
            throw new Error("password miss match")
        }

        const token = createJwtToken(user)

        return token
    }
}





const currentUser = {
    type: UserType,
    description: "current user",

    async resolve(parent, args, { verifiedUser }) {
        console.log("current", verifiedUser)

        return verifiedUser


    }
}




const addPost = {
    type: PostType,
    description: "create new post",
    args: {
        title: { type: GraphQLString },
        body: { type: GraphQLString }
    },
    resolve(parent, args, { verifiedUser }) {
        console.log("Vuser", verifiedUser)
        if (!verifiedUser) {
            throw new Error("unauthorized")
        }

        const post = new Post({
            authorId: verifiedUser._id,
            title: args.title,
            body: args.body
        })

        return post.save()
    }
}

const updatePost = {
    type: PostType,
    description: "update the blog post",
    args: {
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        body: { type: GraphQLString }

    },

    async resolve(parent, args, { verifiedUser }) {
        if (!verifiedUser) {
            throw new Error("Unauthenticated user")
        }
        const postUpdated = await Post.findOneAndUpdate({
            _id: args.id,
            authorId: verifiedUser._id
        }, {
            title: args.title,
            body: args.body
        }, {
            new: true,
            runValidators: true
        })

        if (!postUpdated) {
            throw new Error("no post with the give id found")
        }

        return postUpdated
    }
}

const deletePost = {
    type: GraphQLString,
    description: "delete post",
    args: {
        postId: { type: GraphQLString },

    },
    async resolve(parent, args, { verifiedUser }) {
        if (!verifiedUser) {
            throw new Error("Unauthenticated user")
        }

        const deletedPost = await Post.findByIdAndDelete({
            _id: args.postId,
            authorId: verifiedUser._id
        })

        if (!deletedPost) {
            throw new Error("no post to be deleted");
        }

        return "Post deleted"


    }

}


const addComment = {
    type: CommentType,
    description: "add comment",
    args: {
        comment: { type: GraphQLString },
        postId: { type: GraphQLString }
    },
    resolve(parent, args, { verifiedUser }) {
        const comment = new Comment({
            userId: verifiedUser._id,
            postId: args.postId,
            comment: args.comment
        })

        return comment.save()

    }

}

module.exports = { register, login, addPost, addComment, updatePost, deletePost, currentUser }