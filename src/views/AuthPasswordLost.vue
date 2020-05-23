<template>
  <div>
    <h1>Passwort vergessen?</h1>

    <transition name="slide">
      <AlertBox icon="😢" type="error" v-if="error">Fehler beim Senden des Links. Bist du mit dieser E-Mail-Adresse registriert?</AlertBox>
      <AlertBox icon="✅" type="success" v-if="recoveryLinkSent">Der Wiederherstellungs-Link wurde an <strong>{{ user.email }}</strong> gesendet!</AlertBox>
    </transition>

    <form @submit.prevent="handleSubmit" class="auth-form" v-if="!recoveryLinkSent">
      <input type="email" v-model="user.email" placeholder="Deine E-Mail-Adresse" required>

      <Button type="submit" :isLoading="isLoading">Wiederherstellungs-Link senden</Button>
    </form>

    <div class="link-with-text">
      Du weißt es wieder?
      <router-link :to="{ name: 'AuthSignin', params: { email: user.email } }">Anmelden</router-link>
    </div>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import Button from '../components/Button'
  import AlertBox from '../components/AlertBox'

  export default {
    name: 'AuthPasswordLost',

    components: { Button, AlertBox },

    data: () => ({
      user: {
        email: '',
        password: ''
      },
      isLoading: false,
      error: false,
      recoveryLinkSent: false
    }),

    created() {
      this.user.email = this.$route.params?.email
    },

    methods: {
      async handleSubmit() {
        this.isLoading = true 
        this.error = false

        // Send password recovery link...
        auth.requestPasswordRecovery(this.user.email)
          .then(response => {
            this.recoveryLinkSent = true
          })
          .catch(error => {
            this.error = true
          })

        this.isLoading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  input {
    margin: 0;
  }
</style>