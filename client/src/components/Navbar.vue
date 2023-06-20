<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
<nav>
    <div class="nav-content">
      <div class="logo">
        <a href="#">Inspect</a>
      </div>

      <ul class="nav-links">
        <RouterLink to="/" >Home</RouterLink>
        <RouterLink to="/about" >About</RouterLink>
        <a href="" @click="logout" class="logout">Log Out</a>
      </ul>
    </div>
</nav>


</template>

<script>
export default {
  methods: {
    async logout() {
      const response = await fetch(import.meta.env.VITE_APP_API + "/logout",
        {
          method: 'POST',
          headers: {
            'token': localStorage.getItem('token'),
            'refresh_token': localStorage.getItem('refresh_token')
          }
        })

      if (response.status === 200) {
        this.$store.commit('setAuth', false)
        localStorage.clear();
        this.$router.push('/login');
      }
      else {
        location.reload()
      };
    }
  }
}
</script>
