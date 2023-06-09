const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const cors = require('cors')
const jwt = require('jsonwebtoken')

// Infos the DataBase
const _PORT = 5000
const USERNAME = "hamdihajji"
const PASSWORD = "WZvrPFkMHEjB5WBz"
const DB = "login"
const SECRET = "SECRET"

// Create App 
const app = express()
app.use(cors())
app.use(express.json())

// Import Models
const Users = require('./Models/Users')

// Connect to DB
mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.ff7hmmq.mongodb.net/${DB}?retryWrites=true&w=majority`)

// Get the data
app.get('/users', async (req, res) => {
    try {
        await Users.find({})
        .then(result => {
            res.send(result)
        })
        
    } catch (error) {
        res.send(error)
        
    }
})



// Register 
app.post('/register', async (req, res) => {

    
        let {username, password, ip} = req.body
        
        const User = await Users.findOne({username})
        if(User) {
            res.json({message : "Cet nom d'Utilisateur  existe déja"}) 
        }   

        const hashed_password = bcrypt.hashSync(password, 10)
        const newUser = new Users({
            username,
            password : hashed_password,
            ip,

            
        })
        await newUser.save()
        return res.json({message : `${username} est ajouté avec succés !`})
    
    
})

// Login 
app.post("/login", async (req, res) => {
    const {username, password, ip} = req.body

    const user = await Users.findOne({username, ip})
    if(!user){
        return res.json({message : "Cet nom d'Utilisateur n'existe pas"})
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password)
    if(!isPasswordValid){
        return res.json({message : "username ou password est incorrect!"})
    } else{
        return res.json({message : `Bienvenu ${username}`})
    }

   
    const token =jwt.sign({id: user._id,}, SECRET)
    return res.json({token, userID: user._id})

})




// Listen the port
app.listen(_PORT, ()=> {
    console.log('Server is connected !')
})