<template>
  <div>
    <h1>Hej, {{ renderName }}!</h1>

    <AlertBox icon="✅" type="success" v-if="signupStatus === 'inProgress'">
      Die Verbindung zu deinem toggl-Account wurde erfolgreich hergestellt.
    </AlertBox>

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
      <input type="text" v-model="user.name" placeholder="Dein Name" required>
      <input type="email" v-model="user.email" placeholder="E-Mail-Adresse" required>
      <input type="password" v-model="user.password" placeholder="Passwort" required>

      <Button type="submit" :isLoading="isLoading">Konto erstellen</Button>
    </form>
  </div>
</template>

<script>
  import auth from '@/plugins/GotrueAuth'
  import LocalStorageSignupData from '@/functions/localstorage-signup-data'

  import Button from '@/components/Button'
  import AlertBox from '@/components/AlertBox'
  import TextDivider from '@/components/TextDivider'

  export default {
    components: { Button, AlertBox, TextDivider },

    data: () => ({
      user: {
        name: '',
        email: '',
        password: ''
      },
      togglUserData: null,
      isLoading: false,
      signupStatus: 'inProgress'
    }),

    created() {
      const signupData = LocalStorageSignupData.get()
      if (!signupData?.togglUserData)
        return this.$router.push({ name: 'AuthSignup' })

      this.togglUserData = signupData.togglUserData

      this.user.name = signupData.togglUserData?.fullname
      this.user.email = signupData.togglUserData?.email
    },

    computed: {
      renderName() {
        return this.user.name.length ? this.user.name : 'du'
      }
    },

    methods: {
      async handleSubmit() {
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
            togglApiKey: this.togglUserData.api_token
          })

          this.$router.push({ name: 'AuthSignup__verifyToken' })

        } catch (error) {
          console.error(error)
          this.signupStatus = 'error'
        }

        this.isLoading = false
      }
    }
  }
</script>