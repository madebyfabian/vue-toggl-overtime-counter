<template>
  <div>
    <h1>Konto erstellen</h1>

    <form class="auth-form">
      <section class="continue-with-toggl">
        <Button 
          class="continue-with-toggl__button" 
          @click.native="$router.push({ name: 'AuthSignup__toggl' })">

          Weiter mit
          <img
            src="@/static/toggl-logo--on-color.svg">
        </Button>
      </section>
    </form>

    <div class="link-with-text">
      Du hast schon ein Konto?
      <router-link :to="{ name: 'AuthSignin' }">Anmelden</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .continue-with-toggl {
    &__button {
      color: #fff;
      background: var(--color-toggl-brand);
      margin-top: 0;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    img {
      height: 24px;
      margin-left: 8px;
    }
  }
</style>

<script>
  import auth from '@/plugins/GotrueAuth'

  import Button from '@/components/Button'
  import AlertBox from '@/components/AlertBox'
  import TextDivider from '@/components/TextDivider'

  export default {
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