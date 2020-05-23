<template>
  <div>
    <h1>Konto erstellen</h1>
    
    <transition name="slide">
      <AlertBox icon="❌" type="error" v-if="signupStatus === 'error'">
        Fehler bei der Registrierung, versuch es mit einer anderen E-Mail-Adresse!
      </AlertBox>
      <AlertBox icon="❌" type="error" v-if="signupStatus === 'emailsNotEqual'">
        Die angegebenen E-Mail-Adressen stimmen nicht überein.
      </AlertBox>
      <AlertBox icon="🙈" type="error" v-if="signupStatus === 'passwordTooShort'">
        Dein Passwort sollte mindestens 8 Zeichen enthalten.
      </AlertBox>
    </transition>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <input type="email" v-model="user.email" placeholder="E-Mail-Adresse" required>
      <input type="email" v-model="user.emailRepeat" placeholder="E-Mail-Adresse wiederholen" required>
      <input type="password" v-model="user.password" placeholder="Passwort" required>

      <Button type="submit" :isLoading="isLoading">Konto erstellen</Button>
    </form>

    <div class="link-with-text">
      Du hast schon ein Konto?
      <router-link :to="{ name: 'AuthSignin' }">Anmelden</router-link>
    </div>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import Button from '../components/Button'
  import AlertBox from '../components/AlertBox'

  export default {
    name: 'AuthSignup',

    components: { Button, AlertBox },

    data: () => ({
      user: {
        email: '',
        password: '',
        emailRepeat: ''
      },
      isLoading: false,
      signupStatus: 'inProgress'
    }),

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.signupStatus = 'inProgress'

        validresponse: try {
          if (this.user.email !== this.user.emailRepeat) {
            this.signupStatus = 'emailsNotEqual'
            break validresponse
          }

          if (this.user.password.length < 8) {
            this.signupStatus = 'passwordTooShort'
            break validresponse
          }

          await auth.signup(this.user.email, this.user.password)

          this.$router.push({ name: 'AuthSignup__verifyToken', params: { user: this.user } })

        } catch (error) {
          console.error(error)
          this.signupStatus = 'error'
        }

        this.isLoading = false
      }
    }
  }
</script>