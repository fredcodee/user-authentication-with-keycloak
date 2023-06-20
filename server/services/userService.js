const User = require('../models/User');
const bcrypt = require('bcrypt');

async function AddUser(userCredentials) {
    try {
        const newUser = new User(userCredentials)
        await newUser.save();
        return newUser
    } catch (err) {
        throw new Error('User Registration Error');
    }
}


async function findAndVerifyUser(username, password) {
    const user = await User.findOne({ username: username });
    if (!user) {
        throw new Error('user not found');
    }

    //password check
    if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('invalid credentials');
    }

    return user;
}

module.exports = { findAndVerifyUser, AddUser }