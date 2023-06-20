const bcrypt = require('bcrypt');
const jwt_decode = require('jwt-decode');
const keycloak = require("../keycloak/functions");
const UserService = require("../services/userService")


const createUser = async (req, res) => {
    try {
        const newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            company: req.body.company,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        }
        //save user credentials to local db
        const saveUser = await UserService.AddUser(newUser)
        //send user credentials to keycloak server to add user
        const kcAdmin = await keycloak.connectToAdminCLI()//connect to keycloak admin
        const kcToken = kcAdmin.data.access_token;
        const realm = process.env.KEYCLOAK_REALM;
        const addUserToKc = await keycloak.addUserToKeycloak(realm, saveUser.username, newUser.firstname, newUser.lastname, newUser.email, req.body.password, kcToken)
        return res.status(200).json(`User Created Successfully`)

    } catch (error) {
        if (error.message === 'User Registration Error') {
            return res.status(409).json({
                title: 'User Registration Error',
                error: error.message
            });
        } else {
            return res.status(500).json({
                title: 'server error',
                error: error.message
            });
        }
    }
}


//login and send user token and refresh token to client
const loginUser = async (req, res) => {
    try {
        const user = await UserService.findAndVerifyUser(req.body.username, req.body.password);

        const companyName = user.company.charAt(0).toUpperCase() + user.company.substring(1); //uppercase senitive
        const email = user.email;
        const password = req.body.password;

        //realm details
        const realm = process.env.KEYCLOAK_REALM;
        const client_id = process.env.KEYCLOAK_CLIENT_ID
        const client_secret = process.env.KEYCLOAK_CLIENT_SECRET

        //keycloak login api call
        const tokens = await keycloak.getUserToken(realm, email, password, client_id, client_secret);
        return res.status(200).json({
            token: tokens.data.access_token,
            refresh_token: tokens.data.refresh_token, // to refresh or revoke access token
        });
    } catch (error) {
        if (error.message === 'user not found') {
            return res.status(404).json({
                title: 'user not found',
                error: error.message
            });
        } else if (error.message === 'invalid credentials') {
            return res.status(401).json({
                title: 'invalid credentials',
                error: error.message
            });
        } else {
            return res.status(500).json({
                title: 'server error',
                error: error.message
            });
        }
    }
}



//pass the token and refresh token to the headers in request
const logoutUser = async (req, res) => {
    try {
        let token = req.headers.token;
        let refresh_token = req.headers.refresh_token;
        let decoded = jwt_decode(token);//decode jwt token to get user client_id
        let realmUrl = decoded.iss; //keycloak hosted url
        let client_id = process.env.KEYCLOAK_CLIENT_ID

        const client_secret = process.env.KEYCLOAK_CLIENT_SECRET

        const response = await keycloak.logoutUser(realmUrl, client_id, client_secret, refresh_token)
        if (response.status === 204) {
            res.status(200).json('User has been logged out');
        } else {
            return res.status(response.status).json({
                title: 'logout error',
                error: response.data
            })
        }
    } catch (error) {
        if (error.message === 'Cant find User Company details') {
            return res.status(404).json({
                title: 'Cant find User Company details',
                error: error.message
            });
        } else {
            return res.status(500).json({
                title: 'server error',
                error: error.message
            });
        }
    }
}


//verify user keycloak access token
//pass token to the headers in request
const verifytoken = async (req, res) => {
    try {
        let token = req.headers.token;
        let decoded = jwt_decode(token);//decode jwt token to get user realm
        let realmUrl = decoded.iss; //keycloak server url with realm name
        let client_id = process.env.KEYCLOAK_CLIENT_ID

        const client_secret = process.env.KEYCLOAK_CLIENT_SECRET

        const check = await keycloak.verifyToken(realmUrl, client_id, client_secret, token);

        // Check the "active" property to determine if the token is valid
        if (check.data.active) {
            res.status(200).json('Access token is valid');
        } else {
            res.status(401).json('Access token is invalid or expired');
        }

    } catch (error) {
        if (error.message === 'Cant find User Company details') {
            return res.status(404).json({
                title: 'Cant find User Company details',
                error: error.message
            });
        } else {
            return res.status(500).json({
                title: 'server error',
                error: error.message
            });
        }
    }
}

//refresh user token
const refreshUserToken = async(req, res) =>{
    try {
        let refresh_token  = req.body.refresh_token
        let client_id = req.body.client_id
        let realm  = req.body.realm

        const refresh = keycloak.refreshToken(realm, refresh_token, client_id)
        res.send(refresh)


    } catch (error) {
        return res.status(500).json({
            title: 'server error',
            error: error.message
        })
    }
}


module.exports = { createUser, loginUser, logoutUser, verifytoken, refreshUserToken}