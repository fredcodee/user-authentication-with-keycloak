<template>
<div class="container">
  <div class="row">
    <div class="Absolute-Center is-Responsive">
      <div id="logo-container"></div>
      <div class="col-sm-12 col-md-10 col-md-offset-1">
        <form @submit.prevent="login" id="loginForm">
          <div class="form-group input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input class="form-control" type="text" name='username' required placeholder="Username" v-model = "username" />
          </div>
          <div class="form-group input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
            <input class="form-control" type="password" name='password'  required placeholder="Password"  v-model = "password" />
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox" required> I agree to the <a href="#">Terms and Conditions</a>
            </label>
          </div>
          <div class="form-group text-center">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
          <div class="form-group text-center">
            <RouterLink to="/register">Create a new account</RouterLink>&nbsp;|&nbsp;<a href="#">Support</a>
          </div>
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>
  
<script>
import axios from 'axios'

export default {
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',
      error: null
    };
  },
  methods: {
     login() {
        let User = {
          username: this.username,
          password: this.password
        };
        axios.post(import.meta.env.VITE_APP_API + "/login", User)
        .then(res => {
          if (res.status === 200){
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('refresh_token', res.data.refresh_token)
            this.$router.push('/');
          }
        }, err => {
          console.log(err.response)
          this.error = err.response.data.title
        })
    }
  }
};
</script>
  
<style scoped>
  @import '../assets/loginPage.css';
</style>
  