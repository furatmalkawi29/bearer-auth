'use strict';

const base64 = require('base-64');
const User = require('../models/users-model.js');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        next('authorization header is not provided');
        return;
    }
    try {
        //Basic Y2E3OjEyMw==
        const basic = req.headers.authorization
            .split(' ').pop(); //basic = Y2E3OjEyMw==

            console.log('basic auth ' + basic);
            console.log(req.headers.authorization);
        const [username, password] =
            base64.decode(basic).split(':'); 
            //username=furat
            //password=123

            console.log(base64.decode(basic)); //furat:123

            
        const authenticatedUser = await User.authenticateBasic(username, password);
        req.user = authenticatedUser;

        next();
    } catch (error) {
        //invalid login (wrong password / username)
        res.status(403).send('Invalid Login');
    }
}