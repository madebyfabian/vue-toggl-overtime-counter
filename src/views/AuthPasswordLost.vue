<template>
  <div>
    <h1>Passwort vergessen?</h1>

    <transition name="slide">
      <AlertBox icon="😢" type="error" v-if="errorSendingRecoveryPIN">
        Fehler beim Senden der Wiederherstellungs-PIN. Bist du mit dieser E-Mail-Adresse registriert?
      </AlertBox>
      <AlertBox icon="👌" type="info" v-if="recoveryPINSent && !allOperationsFinished">
        Du hast soeben eine Bestätigungs-PIN per E-Mail an <strong>{{ user.email }}</strong> erhalten.
      </AlertBox>
    </transition>

    <transition name="slide">
      <AlertBox icon="❌" type="error" v-if="errorWhileRecoveringAccount === 'passwordsNotEqual'">
        Die angegebenen Passwörter stimmen nicht überein.
      </AlertBox>
      <AlertBox icon="🙈" type="error" v-if="errorWhileRecoveringAccount === 'passwordTooShort'">
        Dein Passwort sollte mindestens 8 Zeichen enthalten.
      </AlertBox>
      <AlertBox icon="❌" type="error" v-if="errorWhileRecoveringAccount === 'apiError'">
        Fehler beim Versuch dein Passwort zurückzusetzen. Vielleicht ein Tippfehler bei der Pin?
      </AlertBox>
      <AlertBox icon="❌" type="error" v-if="errorWhileRecoveringAccount === 'apiErrorWhilePasswordChange'">
        Fehler beim Versuch dein Passwort zurückzusetzen. Versuch es bitte noch einmal.
      </AlertBox>
      <AlertBox icon="🥳" type="success" v-if="allOperationsFinished">
        Dein Passwort wurde erfolgreich geändert und du wurdest angemeldet.<br><br>
        <router-link :to="{ name: 'Dashboard' }">Zur Übersicht</router-link>
      </AlertBox>
    </transition>

    <div v-if="!recoveryPINSent">
      <form @submit.prevent="handleSubmitOfRecoveryPINEmail" class="auth-form" id="recoveryPINEmailForm">
        <input type="email" v-model="user.email" placeholder="Deine E-Mail-Adresse" required>

        <Button type="submit" :isLoading="isLoading">Wiederherstellungs-PIN anfordern</Button>
      </form>

      <div class="link-with-text">
        Du weißt es wieder?
        <router-link :to="{ name: 'AuthSignin', params: { email: user.email } }">Anmelden</router-link>
      </div>
    </div>

    <div v-if="recoveryPINSent && !allOperationsFinished">
      <form @submit.prevent="handleSubmitOfPasswordChange" class="auth-form">
        <input type="text" v-model="userRecoveryData.token" placeholder="Wiederherstellungs-Pin" required>
        <input type="password" v-model="userRecoveryData.newPassword" placeholder="Neues Passwort" required>
        <input type="password" v-model="userRecoveryData.newPasswordRepeat" placeholder="Neues Passwort wiederholen" required>

        <Button type="submit" :isLoading="isLoading">Neues Passwort speichern</Button>
      </form>
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
      // 1st view
      user: {
        email: ''
      },
      isLoading: false,
      errorSendingRecoveryPIN: false,
      recoveryPINSent: false,
      
      // 2nd view
      userRecoveryData: {
        token: '',
        newPassword: '',
        newPasswordRepeat: ''
      },
      errorWhileRecoveringAccount: false,
      successfullyRecoveredAccount: false,
      successfullyChangedPassword: false
    }),

    computed: {
      allOperationsFinished() {
        return !this.errorWhileRecoveringAccount && this.successfullyChangedPassword
      }
    },

    created() {
      this.user.email = this.$route.params?.email
    },

    methods: {
      async handleSubmitOfRecoveryPINEmail() {
        this.isLoading = true 
        this.errorSendingRecoveryPIN = false

        // Send password recovery link...
        auth.requestPasswordRecovery(this.user.email)
          .then(response => {
            this.recoveryPINSent = true
          })
          .catch(error => {
            this.errorSendingRecoveryPIN = true
          })
          .then(() => {
            this.isLoading = false
          })
      },

      async handleSubmitOfPasswordChange() {
        recoverAccount: try {
          this.isLoading = true
          this.errorWhileRecoveringAccount = false

          // Check, if both passwords are equal
          if (this.userRecoveryData.newPassword !== this.userRecoveryData.newPasswordRepeat) {
            this.errorWhileRecoveringAccount = 'passwordsNotEqual'
            break recoverAccount
          }

          // Check if the length of the passwords is good
          if (this.userRecoveryData.newPassword.length < 8) {
            this.errorWhileRecoveringAccount = 'passwordTooShort'
            break recoverAccount
          }

          // Now, recover the account with the token
          if (!this.successfullyRecoveredAccount) {
            await auth.recover(this.userRecoveryData.token, true)
            this.successfullyRecoveredAccount = true
          }

          // That seems successful. Now finally change the passwords
          changePassword: try {
            const user = auth.currentUser()
            await user.update({ password: this.userRecoveryData.newPassword })
            this.successfullyChangedPassword = true
          } catch (error) {
            this.errorWhileRecoveringAccount = 'apiErrorWhilePasswordChange'
          }
         

        } catch (error) {
          // Failed to recover the account
          this.errorWhileRecoveringAccount = 'apiError'

        } finally {
          this.isLoading = false

        }
      }
    }
  }
</script>