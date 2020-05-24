<template>
  <div>
    <h1>Hej, {{ user.user_metadata.full_name }}!</h1>
    <p>Trag hier deinen Toggl API-Key ein. <br>Diesen findest du unter <a href="https://toggl.com/app/profile" target="_blank">https://toggl.com/app/profile</a></p>

    <transition name="slide">
      <AlertBox icon="😬" type="error" v-if="error">
        Fehler beim speichern des API-Keys. Versuch es bitte noch einmal.
      </AlertBox>
    </transition>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <input type="text" v-model.trim="configData.togglApiKey" placeholder="Toggl API-Key" required>

      <div class="button-group">
        <Button buttonType="secondary" @click.native="$router.push({ name: 'AuthSignup__accountConfig__1' })">&larr; Zurück</Button>
        <Button type="submit" :isLoading="isLoading" tabindex="1">Weiter &rarr;</Button>
      </div>
    </form>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import AlertBox from '../components/AlertBox'
  import Button from '../components/Button'

  import TogglAPI from '../functions/TogglAPI'

  export default {
    name: 'AuthSignup__accountConfig__2',

    components: { Button, AlertBox },

    data: () => ({
      configData: {
        togglApiKey: auth.currentUser().user_metadata?.togglApiKey
      },
      isLoading: false,
      error: false,
      user: auth.currentUser(),
    }),

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.error = false

        try {
          const user = auth.currentUser()

          // Save it into Identity DB.
          await user.update({ data: { togglApiKey: this.configData.togglApiKey } })

          // Check if API Key is Valid
          const userData = await TogglAPI.getUserData()
          console.log(userData)

          // Redirect to next view
          this.$router.push({ name: 'AuthSignup__accountConfig__3' })

        } catch (error) {
          this.error = true
          console.error(error)
        }

        this.isLoading = false
      }
    }
  }
</script>