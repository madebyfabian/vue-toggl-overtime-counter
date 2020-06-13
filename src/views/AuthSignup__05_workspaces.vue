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
        <InputRadioCard 
          v-for="(workspace, i) of workspaces"
          v-model="selectedWorkspace" 
          :key="i"
          :val="workspace.id">

          <template v-slot:label>{{ workspace.name }}</template>
          <template v-slot:sublabel><span style="opacity: .5">#</span><span>{{ workspace.id }}</span></template>
        </InputRadioCard>
      </div>
      
      <LoadingSpinner class="loading-spinner" v-else />

      <Button type="submit" :isLoading="isLoading">Weiter &rarr;</Button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .loading-spinner {
    margin: 0 auto;
  }
</style>

<script>
  import auth from '@/plugins/GotrueAuth'
  import TogglAPI from '@/plugins/Toggl.API'
  import LocalStorageSignupData from '@/functions/localstorage-signup-data'

  import AlertBox from '@/components/AlertBox'
  import Button from '@/components/Button'
  import LoadingSpinner from '@/components/LoadingSpinner'
  import InputRadioCard from '@/components/InputRadioCard'


  export default {
    components: { Button, AlertBox, LoadingSpinner, InputRadioCard },

    data: () => ({
      isLoading: false,
      error: false,
      user: auth.currentUser(),
      workspaces: [],
      selectedWorkspace: auth.currentUser()?.user_metadata?.trackedWorkspace
    }),

    async created() {
      try {
        let workspaces = LocalStorageSignupData.get()?.togglUserData?.workspaces
        if (!workspaces) {
          // Didn't got any workspaces. So fetch them again then.
          const userData = await TogglAPI.getUserData()
          workspaces = userData?.data?.workspaces
        } 

        this.workspaces = workspaces

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

          const dataToUpdate = { 
            trackedWorkspace: this.selectedWorkspace
          }

          // If the selected and the workspace in DB are the same, don't remove them
          const currentlyTrackedWorkspace = user.user_metadata?.trackedWorkspace
          if (currentlyTrackedWorkspace !== this.selectedWorkspace)
            dataToUpdate.trackedProjects = []

          // Update user data to fill in the tracked workspace
          await user.update({ data: dataToUpdate })

          // Redirect to next view
          this.$router.push({ name: 'AuthSignup__06_projects' })

        } catch (error) {
          this.error = true
          console.error(error)
        }

        this.isLoading = false
      }
    }
  }
</script>