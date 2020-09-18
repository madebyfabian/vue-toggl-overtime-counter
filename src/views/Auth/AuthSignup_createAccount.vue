<template>
  <div>
    <h1>Hej, {{ this.user.name || 'du' }}!</h1>

    <AlertBox icon="✅" type="success" v-if="signupStatus === 'connectionToProviderSuccessful'">
      Die Verbindung zu deinem {{ this.$route.params['connectionToProvider'].niceName }}-Account wurde erfolgreich hergestellt.
    </AlertBox>

    <div v-if="!showVerifyTokenView">
      <p>Vergib ein sicheres Passwort, <br>bevor es los gehen kann 🚀</p>

      <transition name="slide">
        <AlertBox icon="❌" type="error" v-if="signupStatus === 'error'">
          Fehler bei der Registrierung, versuch es mit einer anderen E-Mail-Adresse!
        </AlertBox>
        <AlertBox icon="🙈" type="error" v-if="signupStatus === 'passwordTooShort'">
          Dein Passwort sollte mindestens 8 Zeichen enthalten.
        </AlertBox>
      </transition>

      <form @submit.prevent="handleSubmitAccountCreation" class="auth-form">
        <InputField type="name" v-model.trim="user.name" />
        <InputField type="email" v-model.trim="user.email" />
        <InputField type="password" v-model.trim="user.password" />

        <Button type="submit" :isLoading="isLoading">Konto erstellen</Button>
      </form>
    </div>

    <div v-else>
      <transition name="slide">
        <AlertBox icon="📧" type="info" v-if="signupStatus === 'awaitingVerify'">
          Vielen Dank! Du hast soeben einen Bestätigungs-Code per E-Mail erhalten.
        </AlertBox>
        <AlertBox icon="❌" type="error" v-if="signupStatus === 'verifyFailed'">
          Fehler bei der Verifizierung des Bestätigungs-Codes. <br><br>
          <router-link :to="{ name: 'AuthSignup' }">Erneut versuchen</router-link>
        </AlertBox>
      </transition>

      <form @submit.prevent="handleSubmitTokenVerify" class="auth-form">
        <InputField v-model.trim="userConfirmation.token" placeholder="Bestätigungs-Code" />
        <Button type="submit" :isLoading="isLoading">Bestätigen & Weiter &rarr;</Button>
      </form>
    </div>
  </div>
</template>

<script>
  import auth from '@/plugins/GotrueAuth'

  import Button from '@/components/Button'
  import AlertBox from '@/components/AlertBox'
  import TextDivider from '@/components/TextDivider'
  import InputField from '@/components/InputField'

  export default {
    components: { Button, AlertBox, TextDivider, InputField },

    data: () => ({
      user: {
        name: '',
        email: '',
        password: ''
      },
      userConfirmation: {
        token: ''
      },
      isLoading: false,
      signupStatus: 'connectionToProviderSuccessful',
      showVerifyTokenView: false
    }),

    created() {
      this.user = { ...this.user, ...this.$store.temp.user }
    },

    methods: {
      async handleSubmitAccountCreation() {
        this.isLoading = true
        this.signupStatus = 'inProgress'

        validresponse: try {
          if (this.user.password.length < 8) {
            this.signupStatus = 'passwordTooShort'
            break validresponse
          }

          // Create account
          await auth.signup(this.user.email, this.user.password, { 
            full_name: this.user.name,
            data: {
              providers: this.$store.temp.providers
            }
          })

          this.signupStatus = 'awaitingVerify'
          this.showVerifyTokenView = true

        } catch (error) {
          console.error(error)
          this.signupStatus = 'error'
        }

        this.isLoading = false
      },


      async handleSubmitTokenVerify() {
        this.isLoading = true
        this.$Progress.start()

        // Now confirm user's email via the token he provided
        try {
          await auth.confirm(this.userConfirmation.token, true)

          // Reset store
          this.$store.temp = null

          // Now redirect to timer.
          this.$router.push({ name: 'Dashboard' })
          
        } catch (error) {
          console.error(error)
          this.signupStatus = 'verifyFailed'
          this.$Progress.fail()
        }

        this.isLoading = false
      }
    }
  }
</script>