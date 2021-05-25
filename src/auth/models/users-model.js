'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!
users.virtual('token').get(function () {
  let tokenObject = {
    username: this.username,
  }
  return jwt.sign(tokenObject,process.env.SECRET)
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// BASIC AUTH
users.statics.authenticateBasic =
    async function (username, password) {
        try {
            const user = await this.findOne({ username });
            // if username was wrong / findOne return nothing
            // user = null 

            const isValid =
                await bcrypt.compare(password, user.password);
                //if username passwrod in database is different 
                //from entered password --> isValid =false

            if (isValid) {
                return user;
            } else {
                //wrong password
                throw new Error('Invalid user!!!');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Bearer AUTH
users.statics.authenticateBearer =
    async function (token) {
    
        try {
            console.log(process.env.SECRET);
            
            const payload = jwt.verify(token, process.env.SECRET, {expiresIn:'15m'});
            console.log('payload', payload);

            const user = await this.findOne({
                username: payload.username
            });
            console.log('user', user);

            if (user) {
                return user;
            } else {
                throw new Error('invalid username from token');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }


module.exports = mongoose.model('users', users);
