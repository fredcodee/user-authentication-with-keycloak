<template >
    
<div id='AppendHere'></div>
<form @submit.prevent="signUp">
	<p><a href="#" target="_blank"> written by fredcode</a></p>
    
    <div class="input-info">
        <input type="text" placeholder="First Name" v-model = "firstname" required>
        <input type="text" placeholder="Last Name" v-model ="lastname" required>
        <input type="text" placeholder="User-Name" v-model ="username">
        <input type="email" placeholder="E-mail" required autocomplete="off" validate v-model ="email">
        <input type="password" placeholder="Password" v-model = "password" required>
        <input type="checkbox">
        <span style="padding-left: 10px;">Remember Me</span><br>
    </div>

    <div class="log-sign">
        <button class="signup" type="submit">Register</button>
    </div>

	<p class="forget-password" style="padding-top: 2rem;">If you forget your password please <a href="#">click here</a></p>
    <p ><RouterLink to="/login" style="color: blue;">Already Have An Account click here</RouterLink></p>
    <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
    </div>
</form>


</template>
<script>
    import axios from 'axios'
    export default{
        name:'register',
        data() {
            return{
                firstname:'',
                lastname:'',
                username: '',
                email:'',
                password: '',
                error:null

            }
        },
        methods:{
            signUp(){
                let User = {
                    firstname: this.firstname,
                    lastname: this.lastname,
                    username:this.username,
                    email: this.email,
                    password: this.password,
                    role:'2'
                }
                //console.log(User)
                axios.post(import.meta.env.VITE_APP_API + "/register", User)
                .then(res => {
                    this.$router.push('/login')
                }, err =>{
                    console.log(err.response)
                    this.error = err.response.data.title
                })
            }
        }
    }
</script>
<style scoped>
    @import '../assets/signupPage.css';
</style>