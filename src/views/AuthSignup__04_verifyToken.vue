<template>
  <div>
    <h1>Konto erstellen</h1>
    
    <AlertBox icon="📧" type="info">
      Vielen Dank! Du hast soeben eine Bestätigungs-PIN per E-Mail erhalten.
    </AlertBox>

    <transition name="slide">
      <AlertBox icon="❌" type="error" v-if="tokenIsValid === false">
        Fehler bei der Verifizierung des PINs. <br><br>
        <router-link :to="{ name: 'AuthSignup', params: $route.param }">Erneut versuchen</router-link>
      </AlertBox>
    </transition>

    <form @submit.prevent="handleSubmitTokenVerify" class="auth-form">
      <input type="text" v-model="userConfirmation.token" placeholder="Bestätigungs-PIN" required>

      <Button type="submit" :isLoading="isLoading">Weiter &rarr;</Button>
    </form>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import AlertBox from '../components/AlertBox'
  import Button from '../components/Button'

  export default {
    components: { Button, AlertBox },

    data: () => ({
      userConfirmation: {
        token: ''
      },
      isLoading: false,
      tokenIsValid: null
    }),

    methods: {
      async handleSubmitTokenVerify() {
        this.isLoading = true

        // Now confirm user's email via the token he provided
        try {
          await auth.confirm(this.userConfirmation.token, true)
          this.$router.push({ name: 'AuthSignup__05_workspaces' })
          
        } catch (error) {
          console.error(error)
          this.tokenIsValid = false
        }

        this.isLoading = false
      }
    }
  }
</script>