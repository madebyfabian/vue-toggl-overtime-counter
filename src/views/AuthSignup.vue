<template>
  <div>
    <h1>Sign up!</h1>

    <form @submit.prevent="handleSubmit">
      Email<br>
      <input type="email" v-model="user.email">
      <br><br>
      Password<br>
      <input type="password" v-model="user.password">
      <br><br>
      <button type="submit">Sign up</button>
    </form>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  export default {
    name: 'AuthSignup',

    data: () => ({
      user: {
        email: '',
        password: ''
      }
    }),

    methods: {
      async handleSubmit() {
        try {
          const signupResponse = await auth.signup(this.user.email, this.user.password)
          console.log(signupResponse)
        } catch (error) {
          console.log('Error while trying to sign up:')
          console.error(error)
        }
      }
    }
  }
</script>

<style>

</style>