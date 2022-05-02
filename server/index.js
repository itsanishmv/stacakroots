
const express = require('express')
const { default: mongoose } = require('mongoose')
const {UserDataSchema} = require('./Schema')
const app = express()
const cors = require('cors')
const argon2 = require("argon2")
const jwt = require('jsonwebtoken')
const {authenticate} = require('./middleware')

require('dotenv').config()

const PORT = 8000

app.use(express.json())
app.use(cors())

const db = "mongodb+srv://anish:stackroots@cluster0.lcqmk.mongodb.net/stackroots-auth?retryWrites=true&w=majority"
mongoose.connect(db).then(() => console.log("connected to MongoDB"))

app.post('/signup', async (req, res) => {
    try {
        const users = new mongoose.model('User', UserDataSchema)
        const {name,email,password } = req.body
        const userExists = await users.findOne({ email })
        const hashedpassword = await argon2.hash(password)

        if (userExists) {
           return res.status(409).send("User exists , Please Sign-in")
        } else {
            const insertData = new users({
                name: name,
                email: email,
                password: hashedpassword
            })
            const result = await insertData.save()
            console.log(result)
            return res.status(200).send("successfully signed up")
        }
   
    } catch (err) {
        console.log(err)
    }

})

app.post("/signin", async (req, res) => {
    const users = new mongoose.model('User', UserDataSchema)
    const { email, password } = req.body
    const userExists = await users.findOne({ email })
    
    if (userExists && (await argon2.verify(userExists?.password, password))) {
        const Token = jwt.sign({
            email : email
        },"topsecret")
     
       return res.json({status:200 , token:Token})
    } else {
        return res.status(400).send("username or password is incorrect")
    }
})

app.get('/signout',authenticate, async(req, res) => {
    const users = new mongoose.model('User', UserDataSchema)
    const {email} = req?.payload
    const userExists = await users.findOne({email})
    if(userExists ){
        return res.json({status:200 , user:"logout"})
    }
})



app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})