<template>
  <div>
    <h1>Sign in!</h1>
    
    <form @submit.prevent="handleSubmit">
      Email<br>
      <input type="email" v-model="user.email">
      <br><br>
      Password<br>
      <input type="password" v-model="user.password">
      <br><br>
      <button type="submit">Sign in</button>
    </form>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  export default {
    name: 'AuthSignin',

    data: () => ({
      user: {
        email: '',
        password: ''
      }
    }),

    methods: {
      async handleSubmit() {
        try {
          auth.login(this.user.email, this.user.password, true)
            .then(signinResponse => {
              this.$router.push({ name: 'Default' })
            })
            .catch(error => {
              console.error(error)
            })
        } catch (error) {
          console.log('Error while trying to sign in:')
          console.error(error)
        }
      }
    }
  }
</script>

<style>

</style>