import { createStore } from 'vuex'


export default createStore({
    state:{
        credentials: {
            username:null,
            email: null,
            password: null
        },
        authentication:{
            valid:false
        }
    },
     mutations:{
        saveCredentials(state, credentials) {
            state.credentials.email= credentials.email;
            state.credentials.username= credentials.username;
            state.credentials.password = credentials.password;
        },

        setAuth(state,authentication){
            state.authentication.valid=authentication
        }
    }
})