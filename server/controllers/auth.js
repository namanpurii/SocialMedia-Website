import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import fs from "fs"
// REGISTER USER

export const register = async (req, res) => {
    try{
        const {
            firstName, 
            lastName, 
            email, 
            password,
            picturePath,
            friends, 
            location, 
            occupation
        } = req.body

        console.log(`${firstName} ${lastName} ${email} ${password} ${friends}`)
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName, 
            lastName, 
            email, 
            password: passwordHash,
            picturePath,
            friends, 
            location, 
            occupation,
            profileViews: Math.floor(Math.random() * 10000),
            postImpressions: Math.floor(Math.random() * 10000) 
        }) 
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch(err) {
        res.status(500).json({error : err.message })
    }
}

// LOGGING IN

export const login = async (req, res) => {
    try{
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if(!user) return res.status(400).json( {msg: "User does not exist."} )
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json( {msg: "Invalid Credentials."} )
        var privateKey = fs.readFileSync('private.key');
        const token = jwt.sign({ id: user._id}, privateKey, { algorithm: 'RS256' }) //the sensitive info is sent encrypted to frontend
        delete user.password 
        res.status(200).json({token, user}) 
    } catch(err){
        res.status(500).json({error : err.message })
    }
}
