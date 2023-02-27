const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const { connectDB } = require('./db/index.js')
const schema = require('./graphql/schema')
const { createJwtToken } = require('./util/auth')
const { authenticate } = require('./middlewares/auth')





const app = express()
dotenv.config();


connectDB()
app.use(cors())
app.use(authenticate)


app.get('/', (req, res) => {
    if (req.verifiedUser) {
        console.log(req.verifiedUser)
    }
    res.json({ name: 'good' })
})
app.get('/authtest', (req, res) => {
    res.json(createJwtToken({
        username: "yob",
        email: "yo@mail.com",
        displayName: "eyob",
        password: "123456",
        admin: false
    }))
})






app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(process.env.PORT, () => {
    console.log("server is running on " + process.env.PORT)
})