const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    username: {
        unique: true,
        type: String
    },
    Realm:{
        type: String
    },
    email: {
        unique: true,
        type: String
    },
    password: String,
});

module.exports = mongoose.model('User', UserSchema);