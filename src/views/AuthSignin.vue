<template>
  <div>
    <h1>Anmelden</h1>
    <transition name="slide">
      <AlertBox icon="😢" type="error" v-if="authError">
        Deine E-Mail und oder das Passwort ist leider falsch.
      </AlertBox>
    </transition>
      
    <form @submit.prevent="handleSubmit" class="auth-form">
      <input type="email" v-model="user.email" placeholder="E-Mail-Adresse" required>
      <input type="password" v-model="user.password" placeholder="Passwort" required>
      <router-link :to="{ name: 'AuthPasswordLost', params: { email: user.email } }" class="link--password-lost">Vergessen?</router-link>

      <Button type="submit" :isLoading="isLoading">Anmelden</Button>
    </form>

    <div class="link-with-text">
      Noch nicht registriert?
      <router-link :to="{ name: 'AuthSignup' }">Konto erstellen</router-link>
    </div>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import Button from '../components/Button'
  import AlertBox from '../components/AlertBox'

  export default {
    components: { Button, AlertBox },

    data: () => ({
      user: {
        email: '',
        password: ''
      },
      authError: false,
      isLoading: false,
      logoutSuccessful: null
    }),

    created() {
      this.user.email = this.$route.params?.email
    },

    methods: {
      async handleSubmit() {
        this.isLoading = true 
        this.logoutSuccessful = null

        try {
          const loginResponse = await auth.login(this.user.email, this.user.password, true)
          this.$router.push({ name: 'Dashboard' })
            
        } catch (error) {
          this.authError = true
        }

        this.isLoading = false
      }
    }
  }
</script>