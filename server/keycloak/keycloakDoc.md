# Project's Keycloak Documentation

### connectToAdminCLI() 
This a function that connects to Keycloak's administrative command-line interface (CLI).The function uses environment variables KEYCLOAK_SERVER_URL, KEYCLOAK_ADMIN_USERNAME, KEYCLOAK_ADMIN_PASSWORD, KEYCLOAK_ADMIN_CLIENT_ID, and KEYCLOAK_ADMIN_CLIENT_SECRET to construct a URL for Keycloak's /realms/master/protocol/openid-connect/token endpoint, and then sends a POST request with a URLSearchParams object containing the username, password, grant type, client ID, and client secret. The response is then returned containing the admin acess tokens which we can be used as Authorization to add users and delete users from our keycloak server

### addUserToKeycloak(...params)
Adds a user to Keycloak. 
The function takes the following arguments:
realm: The name of the realm in which to create the user.
username: The username of the user to be created.
firstname: The first name of the user to be created.
lastname: The last name of the user to be created.
email: The email address of the user to be created.
password: The password of the user to be created.
token: An access token that grants the function permission to create a user in Keycloak. get token from **connectToAdminCLI() **

### getUserToken(...params)
Gets an access token for a user in Keycloak. 
The function takes the following arguments:

realm: The name of the realm in which the user is registered.
email: The email address of the user for whom to get an access token.
password: The password of the user for whom to get an access token.
client_id: The client ID of the application for which the access token is being requested.
client_secret: The client secret of the application for which the access token is being requested.

### verifyToken(...params)
Sends a request to a Keycloak server to verify a token.
The function takes the following arguments:

token: token to be checked
client_id: The client ID of the application for which the access token is being requested.
client_secret: The client secret of the application for which the access token is being requested.

### logoutUser(..params)
logs out a user from a Keycloak server. It constructs a URL using the realmUrl and keycloakUrl parameters, which it then uses to send a request containing client_id, client_secret, and refresh_token parameters.
The logoutUser function takes four arguments:

realmUrl: a string containing the URL of the Keycloak realm. 
client_id: a string containing the client ID of the application that is authenticating the user.
client_secret: a string containing the client secret of the application that is authenticating the user.
refresh_token: a string containing the refresh token that was issued to the user when they logged in.
These arguments are used to construct the request to the Keycloak server, which logs out the user by invalidating their refresh token.

### asignRole(..params)
The function takes four arguments:

realm: a string representing the Keycloak realm
username: a string representing the username of a Keycloak user
role: a string representing the name of the role to assign to the user
token: a string representing a Keycloak access token
The function first calls the adminGetUsersInfo function to retrieve information about the user with the specified username. It then uses the user's id property to construct a URL to the Keycloak API endpoint for assigning roles to users, and makes a POST request to that endpoint with the specified role in the request body. 

### connectToKeycloak(..params)
A helper function that sends a request to a Keycloak server. It takes two arguments:

keycloakUrl: a string containing the URL of the Keycloak server.
data: an object containing the parameters to be sent in the request.
The function uses the axios library to send a POST request to the Keycloak server at the specified URL, with the specified data and request headers. The function returns the response from the Keycloak server.

