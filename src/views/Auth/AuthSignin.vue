<template>
  <div>
    <div v-if="doSignout && signoutSuccessful === null">
      <AlertBox icon="👋" type="success">Du wirst ausgeloggt. Bis zum nächsten mal!</AlertBox>
    </div>

    <div v-else>
      <h1>Anmelden</h1>

      <transition name="slide">
        <AlertBox icon="😢" type="error" v-if="authError">
          Deine E-Mail und oder das Passwort ist leider falsch.
        </AlertBox>
      </transition>
        
      <form @submit.prevent="handleSubmit" class="auth-form">
        <InputField type="email" v-model.trim="user.email" />
        <InputField type="password" v-model.trim="user.password" />

        <router-link :to="{ name: 'AuthPasswordLost', params: { email: user.email } }" class="link--password-lost">Vergessen?</router-link>

        <Button type="submit" :isLoading="isLoading">Anmelden</Button>
      </form>

      <div class="link-with-text">
        Noch nicht registriert?
        <router-link :to="{ name: 'AuthSignup' }">Konto erstellen</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import auth from '@/plugins/GotrueAuth'

  import Button from '@/components/Button'
  import AlertBox from '@/components/AlertBox'
  import InputField from '@/components/InputField'

  export default {
    components: { Button, AlertBox, InputField },

    data: () => ({
      user: {
        email: '',
        password: ''
      },
      authError: false,
      isLoading: false,
      doSignout: null,
      signoutSuccessful: null
    }),

    async created() {
      this.user.email = this.$route.params?.email

      // Check if the user was redirected here to sign out
      if (this.$route.query?.signout) {
        this.doSignout = this.$route.query?.signout

        try {
          const user = auth.currentUser()
          if (!user)
            throw new Error('No user is signed in that could be logged out!')
          
          await user.logout()
          this.signoutSuccessful = true

        } catch (error) {
          this.signoutSuccessful = false
          this.$router.push({ name: this.$route.name }) // Reload and remove ?signout=true
        }
      }
    },

    methods: {
      async handleSubmit() {
        this.isLoading = true 
        this.signout = null

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