import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from "../store"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/ProfileView.vue'),
      meta:{
        requiresAuth: true
      }
    },
    {
      path:'/login',
      name:'login',
      component: ()=> import("../views/Loginview.vue")
    },
    {
      path:'/register',
      name:'register',
      component: ()=> import("../views/RegisterView.vue")
    }
  ]
})

router.beforeEach(async(to,from,next)=>{
  if (to.matched.some(record => record.meta.requiresAuth)){
    // Authentication check
    const token = localStorage.getItem('token');
    if (token){
      //check if token is valid
      const response =  await fetch(import.meta.env.VITE_APP_API + "/verifytoken", 
      {
        method: 'POST',
        headers: {
          'token': token
        }
      })
      
      if (response.status === 200){
          store.commit('setAuth', true)
          return next()
        }
      else{
          store.commit('setAuth', false)
          console.log("expired access token")
          return next('/login')
        };
    }
    return next('/login')
  }
  next()
})
export default router
