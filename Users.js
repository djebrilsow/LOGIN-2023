const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    ip : String
  
   
})

const Users = mongoose.model('user', UserSchema)
module.exports = Users