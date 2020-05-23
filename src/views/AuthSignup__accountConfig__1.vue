<template>
  <div>
    <h1>Hej!</h1>
    <p>Schön dass du da bist.<br>Lass uns direkt starten!</p>

    <transition name="slide">
      <AlertBox icon="😬" type="error" v-if="error">
        Fehler beim speichern des Namens. Versuch es bitte noch einmal.
      </AlertBox>
    </transition>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <input type="text" autocomplete="name" v-model.trim="configData.name" placeholder="Wie heißt du?" required>

      <Button type="submit" :isLoading="isLoading">Weiter &rarr;</Button>
    </form>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import AlertBox from '../components/AlertBox'
  import Button from '../components/Button'

  export default {
    name: 'AuthSignup__accountConfig__1',

    components: { Button, AlertBox },

    data: () => ({
      configData: {
        name: auth.currentUser().user_metadata?.full_name
      },
      isLoading: false,
      error: false
    }),

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.error = false

        try {
          // Update User, adding "full_name"
          const user = auth.currentUser()
          await user.update({ data: { full_name: this.configData.name }})

          this.$router.push({ name: 'AuthSignup__accountConfig__2' })

        } catch (error) {
          this.error = true
          console.error(error)
        }

        this.isLoading = false
      }
    }
  }
</script>