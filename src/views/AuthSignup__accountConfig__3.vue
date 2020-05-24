<template>
  <div>
    <h1>Deine Workspaces</h1>

    <p>Welchen deiner Workspaces <br>möchtest du tracken?</p>

    <transition name="slide">
      <AlertBox icon="😬" type="error" v-if="error">
        Fehler beim speichern der Daten. Versuch es bitte noch einmal.
      </AlertBox>
    </transition>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="checkbox-group" v-if="workspaces.length">
        <InputCheckboxCard 
          v-for="(workspace, i) of workspaces"
          v-model="selectedWorkspaces" 
          :key="i"
          :val="workspace.id">

          <template v-slot:label>{{ workspace.name }}</template>
          <template v-slot:sublabel><span style="opacity: .5">#</span><span>{{ workspace.id }}</span></template>
        </InputCheckboxCard>
      </div>
      
      <LoadingSpinner class="loading-spinner" v-else />

      <div class="button-group">
        <Button buttonType="secondary" @click.native="$router.push({ name: 'AuthSignup__accountConfig__2' })">&larr; Zurück</Button>
        <Button type="submit" :isLoading="isLoading">Weiter &rarr;</Button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .loading-spinner {
    margin: 0 auto;
  }
</style>

<script>
  import auth from '../functions/gotrue-auth'

  import AlertBox from '../components/AlertBox'
  import Button from '../components/Button'
  import LoadingSpinner from '../components/LoadingSpinner'
  import InputCheckboxCard from '../components/InputCheckboxCard'

  import TogglAPI from '../functions/TogglAPI'

  export default {
    name: 'AuthSignup__accountConfig__3',

    components: { Button, AlertBox, LoadingSpinner, InputCheckboxCard },

    data: () => ({
      isLoading: false,
      error: false,
      user: auth.currentUser(),
      workspaces: [],
      selectedWorkspaces: []
    }),

    async created() {
      try {
        // Get workspaces from step 2.
        let workspaces = this.$route.props?.workspaces
        if (!workspaces) {
          // Didn't got any workspaces as prop. So fetch them again then.
          const userData = await TogglAPI.getUserData()
          workspaces = userData?.data?.workspaces
        }

        this.workspaces = workspaces
        console.log(workspaces)

      } catch (error) {
        this.error = true
        console.error(error)
      }
    },

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.error = false

        try {
          const user = auth.currentUser()

          // Update user data to fill in the tracked workspaces
          user.update({ data: { trackedWorkspaces: this.selectedWorkspaces } })

          // Redirect to next view
          this.$router.push({ name: 'AuthSignup__accountConfig__5' })

        } catch (error) {
          this.error = true
          console.error(error)
        }

        this.isLoading = false
      }
    }
  }
</script>