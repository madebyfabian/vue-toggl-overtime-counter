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
      <section class="continue-with-toggl">
        <Button buttonType="continue-with-toggl" @click.native="$router.push({ name: 'AuthWithToggl', query: { test: true }  })" />
        <TextDivider>oder</TextDivider>
      </section>

      <input type="email" v-model="user.email" placeholder="E-Mail-Adresse" required>
      <input type="password" v-model="user.password" placeholder="Passwort" required>

      <Button type="submit" buttonType="secondary" :isLoading="isLoading">Konto erstellen</Button>
    </form>

    <div class="link-with-text">
      Du hast schon ein Konto?
      <router-link :to="{ name: 'Auth' }">Anmelden</router-link>
    </div>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import Button from '../components/Button'
  import AlertBox from '../components/AlertBox'
  import TextDivider from '../components/TextDivider'

  export default {
    name: 'AuthSignup',

    components: { Button, AlertBox, TextDivider },

    data: () => ({
      user: {
        email: '',
        password: ''
      },
      isLoading: false,
      signupStatus: 'inProgress'
    }),

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.signupStatus = 'inProgress'

        validresponse: try {
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