<template>
  <div>
    <h1>Passwort vergessen?</h1>

    <transition name="slide">
      <AlertBox icon="😢" type="error" v-if="errorSendingRecoveryCode">
        Fehler beim Senden des Wiederherstellungs-Codes. Bist du mit dieser E-Mail-Adresse registriert?
      </AlertBox>
      <AlertBox icon="👌" type="info" v-if="recoveryCodeSent && !allOperationsFinished">
        Du hast soeben einen Bestätigungs-Code per E-Mail an <strong>{{ user.email }}</strong> erhalten.
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
        Fehler beim Versuch dein Passwort zurückzusetzen. Vielleicht ein Tippfehler beim Bestätigungs-Code?
      </AlertBox>
      <AlertBox icon="❌" type="error" v-if="errorWhileRecoveringAccount === 'apiErrorWhilePasswordChange'">
        Fehler beim Versuch dein Passwort zurückzusetzen. Versuch es bitte noch einmal.
      </AlertBox>
      <AlertBox icon="🥳" type="success" v-if="allOperationsFinished">
        Dein Passwort wurde erfolgreich geändert und du wurdest angemeldet.<br><br>
        <router-link :to="{ name: 'Dashboard' }">Zur Übersicht</router-link>
      </AlertBox>
    </transition>

    <div v-if="!recoveryCodeSent">
      <form @submit.prevent="handleSubmitOfRecoveryCodeEmail" class="auth-form" id="recoveryCodeEmailForm">
        <InputField type="email" v-model="user.email" />

        <Button type="submit" :isLoading="isLoading">Wiederherstellungs-Code anfordern</Button>
      </form>

      <div class="link-with-text">
        Du weißt es wieder?
        <router-link :to="{ name: 'AuthSignin', params: { email: user.email } }">Anmelden</router-link>
      </div>
    </div>

    <div v-if="recoveryCodeSent && !allOperationsFinished">
      <form @submit.prevent="handleSubmitOfPasswordChange" class="auth-form">
        <InputField type="text" v-model="userRecoveryData.token" placeholder="Wiederherstellungs-Code" />
        <InputField type="password" v-model="userRecoveryData.newPassword" placeholder="Neues Passwort" />
        <InputField type="password" v-model="userRecoveryData.newPasswordRepeat" placeholder="Neues Passwort wiederholen" />

        <Button type="submit" :isLoading="isLoading">Neues Passwort speichern</Button>
      </form>
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
      // 1st view
      user: {
        email: ''
      },
      isLoading: false,
      errorSendingRecoveryCode: false,
      recoveryCodeSent: false,
      
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
      async handleSubmitOfRecoveryCodeEmail() {
        this.isLoading = true 
        this.errorSendingRecoveryCode = false

        // Send password recovery link...
        auth.requestPasswordRecovery(this.user.email)
          .then(response => {
            this.recoveryCodeSent = true
          })
          .catch(error => {
            this.errorSendingRecoveryCode = true
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