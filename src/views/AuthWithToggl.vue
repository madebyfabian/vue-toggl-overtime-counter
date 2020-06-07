<template>
  <div>
    <img src="@/static/toggl-logo--on-dark.svg">

    <p>Melde dich mit deinem <br>toggl-Account an.</p>

    <transition name="slide">
      <AlertBox icon="😢" type="error" v-if="authError">
        Deine E-Mail und oder das Passwort ist leider falsch.
      </AlertBox>
    </transition>
      
    <form @submit.prevent="handleSubmit" class="auth-form">
      <input type="email" v-model="user.email" placeholder="Toggl-E-Mail-Adresse" required>
      <input type="password" v-model="user.password" placeholder="Toggl-Passwort" required>

      <div class="button-stack">
        <Button type="submit" class="button--toggl-branded" :isLoading="isLoading">Weiter &rarr;</Button>
        <Button buttonType="secondary" @click.native="$router.push({ name: 'Auth' })">Zurück</Button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  img {
    height: 40px;
    margin: 0 auto 40px;
  }

  .button--toggl-branded {
    color: #fff;
    background: var(--color-toggl-brand);
  }
</style>

<script>
  import auth from '../functions/gotrue-auth'

  import Button from '../components/Button'
  import AlertBox from '../components/AlertBox'

  import TogglAPI from '../functions/TogglAPI'
  import LocalStorageSignupData from '../functions/localstorage-signup-data'

  export default {
    name: 'AuthSigin',

    components: { Button, AlertBox },

    data: () => ({
      user: {
        email: '',
        password: ''
      },
      authError: false,
      isLoading: false
    }),

    methods: {
      async handleSubmit() {
        this.isLoading = true

        try {
          const data = await TogglAPI.getUserData({ username: this.user.email, password: this.user.password })

          const apiToken = data?.data?.api_token
          if (!apiToken)
            throw new Error('Error authenticating you at Toggl.')

          // Now check, if the current account is already singed up


          // LocalStorageSignupData.set({ togglUserData: data.data })

          // console.log(LocalStorageSignupData.get())

          // this.$router.push({ name: 'Dashboard' })
            
        } catch (error) {
          console.error(error)
          this.authError = true
        }

        this.isLoading = false
      }
    }
  }
</script>