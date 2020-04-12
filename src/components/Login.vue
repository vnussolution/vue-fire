<template>
  <aside>
    <h3>sign in anonymously</h3>
    <button @click="auth.signInAnonymously()">Sign in</button>

    <div v-if='newUser'>
      <h3>Sign up for a new account</h3>
      <a href="#" @click="newUser = false"> Returning user?</a>
    </div>

    <div v-else=''>
      <h3>Sign in with email</h3>
      <a href="#" @click="newUser = true"> New user ?</a>
    </div>
    <label for="email" >Email</label><br>
    <input type="email" placeholder="email" v-model="email" class="input">

    <label for="email" >Email</label><br>
    <input type="text" placeholder="password" v-model="password" class="input">
    {{email}} -- {{password}}

    <br />
    <button @click="signInOrCreateUser()" :class="{'is-loading':loading}">{{newUser?'Sign up':'Login'}}</button>
  
    <div class="has-text-danger" v-if="errorMessage"> {{errorMessage}}</div>
  </aside>
  
</template>

<script>

import {auth} from '../firebase';

export default {
  data(){
    return {
      email:'',
      password:'',
      newUser:false,
      auth,
      loading:false,
      errorMessage:''
    }
  },
  methods:{
    async signInOrCreateUser(){

      this.loading = true;

      try {
              if(this.newUser){
        await auth.createUserWithEmailAndPassword(this.email,this.password);
      } else {
        await auth.signInWithEmailAndPassword(this.email,this.password);
      }
      } catch (error) {
        this.errorMessage = error;
      }


      this.loading = false;
    }
  }
}
</script>


<style>

</style>