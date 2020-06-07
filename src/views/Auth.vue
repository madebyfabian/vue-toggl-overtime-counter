<template>
  <div>
    <h1>Hej du!</h1>
    
    <transition name="slide">
      <AlertBox icon="❌" type="error" v-if="error">
        Netzwerk-fehler, bitte versuche es erneut!
      </AlertBox>
    </transition>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <section class="continue-with-toggl">
        <Button 
          class="continue-with-toggl__button" 
          @click.native="$router.push({ name: 'AuthWithToggl' })">

          Weiter mit
          <img
            src="@/static/toggl-logo--on-color.svg">
        </Button>
        <TextDivider>oder</TextDivider>
      </section>

      <input type="email" v-model="user.email" placeholder="E-Mail-Adresse" required>
    
      <Button type="submit" buttonType="secondary" :isLoading="isLoading">Weiter &rarr;</Button>
    </form>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import Button from '../components/Button'
  import AlertBox from '../components/AlertBox'
  import TextDivider from '../components/TextDivider'

  export default {
    name: 'AuthSignin',

    components: { Button, AlertBox, TextDivider },

    data: () => ({
      user: {
        email: ''
      },
      isLoading: false,
      error: false,
    }),

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.error = false

        try {
          // So the user entered an email and submitted it.
          // Now check, if this email is already registered, or not.

          await auth.login(this.user.email, 'x') // 'x' because we don't have a password yet ;)
            .catch(e => {
              switch (e.message.toUpperCase()) {
                case 'INVALID_GRANT: INVALID PASSWORD':
                  // User is registered, so also show the password field.
                  this.$router.push({ name: 'AuthSignin', params: { email: this.user.email } })
                  break
              
                case 'INVALID_GRANT: NO USER FOUND WITH THIS EMAIL':
                  // No user found with this email
                  this.$router.push({ name: 'AuthSignup' })
                  break

                default:
                  // Something else broke up
                  this.error = true
                  throw new Error('Network error')
                  break
              }
            })

        } catch (error) {
          console.error(error)
          this.error = true
        }

        this.isLoading = false
      }
    }
  }
</script>

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