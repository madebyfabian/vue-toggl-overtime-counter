<template>
  <div>
    <img 
      class="toggl-img"
      src="@/assets/toggl-logo-white-red-big.png" 
      srcset="@/assets/toggl-logo-white-red-big@2x.png 2x">

    <!-- <transition name="slide">
      <AlertBox icon="😢" type="error" v-if="authError">
        Deine E-Mail und oder das Passwort ist leider falsch.
      </AlertBox>
    </transition>
      
    <form @submit.prevent="handleSubmit" class="auth-form">
      <input type="password" v-model="user.password" placeholder="Passwort" required>
      <router-link :to="{ name: 'AuthPasswordLost', params: { email: user.email } }" class="link--password-lost">Vergessen?</router-link>

      <div class="button-stack">
        <Button type="submit" :isLoading="isLoading">Anmelden</Button>
        <Button buttonType="secondary" @click.native="$router.push({ name: 'Auth' })">Zurück</Button>
      </div>
    </form> -->
    Under construction
  </div>
</template>

<style lang="scss" scoped>
  .toggl-img {
    height: 40px;
    margin-bottom: 40px;
  }
</style>

<script>
  import auth from '../functions/gotrue-auth'

  import Button from '../components/Button'
  import AlertBox from '../components/AlertBox'

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

    created() {
      this.user.email = this.$route.params?.email
    },

    methods: {
      async handleSubmit() {
        this.isLoading = true

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