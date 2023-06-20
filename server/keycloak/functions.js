const axios = require('axios');

async function connectToAdminCLI() {
  const keycloakUrl = `${process.env.KEYCLOAK_SERVER_URL}/realms/master/protocol/openid-connect/token`
  const data = new URLSearchParams({
    'username': process.env.KEYCLOAK_ADMIN_USERNAME,
    'password': process.env.KEYCLOAK_ADMIN_PASSWORD,
    'grant_type': "password",
    'client_id': process.env.KEYCLOAK_ADMIN_CLIENT_ID,
    'client_secret': process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
  })
  const res = await connectToKeycloak(keycloakUrl, data);
  return res;
}

async function addUserToKeycloak(realm, username, firstname, lastname, email, password, token) {
  const keycloakUrl = `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${realm}/users`
  const user = {
    "username": username,
    "firstName": firstname,
    "lastName": lastname,
    "email": email,
    "enabled": true,
    "credentials": [
      {
        "temporary": false,
        "type": "password",
        "value": password
      }
    ]
  }

  const response = await axios.post(keycloakUrl, user,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  return response
}

async function getUserToken(realm, email, password, client_id, client_secret) {
  const keycloakUrl = `${process.env.KEYCLOAK_SERVER_URL}/realms/${realm}/protocol/openid-connect/token`
  const data = new URLSearchParams({
    'username': email,
    'password': password,
    'grant_type': 'password',
    'client_id': client_id,
    'client_secret': client_secret,
  })

  const res = await connectToKeycloak(keycloakUrl, data)
  return res
}


async function verifyToken(realmUrl, client_id, client_secret, token) {
  const keycloakUrl = `${realmUrl}/protocol/openid-connect/token/introspect`
  const data = new URLSearchParams({
    'client_id': client_id,
    'client_secret': client_secret,
    'token': token
  })

  const res = await connectToKeycloak(keycloakUrl, data)
  return res
}

async function refreshToken(realm, refreshToken, clientId){
  const keycloakUrl = `${realmUrl}/realms/${realm}/protocol/openid-connect/token`
  const data = "grant_type=refresh_token&refresh_token=" + refreshToken + `&client_id=${clientId}`

  const res = await connectToKeycloak(keycloakUrl, data)
  return res
}

async function logoutUser(realmUrl, client_id, client_secret, refresh_token) {
  const keycloakUrl = `${realmUrl}/protocol/openid-connect/logout`
  const data = new URLSearchParams({
    'client_id': client_id,
    'client_secret': client_secret,
    'refresh_token': refresh_token
  })
  const res = await connectToKeycloak(keycloakUrl, data)
  return res
}

async function asignRole(realm, username, role, token){
  //get keycloak userId
  const user =await adminGetUsersInfo(username,realm, token)
  const userId = user.data[0].id
  const data =JSON.stringify([role])

  const keycloakUrl = `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${realm}/users/${userId}/role-mappings/realm`
  const response = await axios.post(keycloakUrl,data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }
  );
  return response
};

//Authorizations && Permisions (roles)

//funcs
async function connectToKeycloak(keycloakUrl, data) {
  return await axios.post(keycloakUrl, data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
}

async function adminGetUsersInfo( username, realm, token){
  const keycloakUrl = `${process.env.KEYCLOAK_SERVER_URL}/admin/realms/${realm}/users?username=${username}`
  return await axios.get(keycloakUrl,{
    headers:{
      'Authorization': `Bearer ${token}`
    }
  })
}





module.exports = { connectToAdminCLI, addUserToKeycloak, getUserToken, verifyToken, logoutUser, asignRole, refreshToken }