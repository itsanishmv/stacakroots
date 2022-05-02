const { default: mongoose } = require('mongoose')
const { schema } = require('mongoose')

const UserDataSchema =  new mongoose.Schema({
    name: String,
    email: String,
    password: String
    
})
module.exports = {
    UserDataSchema
}