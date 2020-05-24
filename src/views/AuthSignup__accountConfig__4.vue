<template>
  <div>
    <h1>Deine Projekte</h1>

    <p>Und welche deiner Projekte <br>möchtest du tracken?</p>

    <transition name="slide">
      <AlertBox icon="😬" type="error" v-if="error">
        Fehler beim speichern der Daten. Versuch es bitte noch einmal.
      </AlertBox>
      <AlertBox icon="😬" type="error" v-if="errorNoProjectsInWorkspace">
        Keine Projekte in diesem Workspace gefunden. Versuche es mit einem anderen!
      </AlertBox>
    </transition>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <div style="margin: 0 auto" v-if="!errorNoProjectsInWorkspace">
        <div class="checkbox-group" v-if="projects">
          <InputCheckboxCard 
            v-for="(project, i) of listProjects"
            v-model="selectedProjects" 
            :key="i"
            :val="project.id"
            class="project">

            <template v-slot:label>
              {{ project.name }} 
              <span class="project__color-dot" :style="{ backgroundColor: project.hex_color }"></span>

              <span class="client" v-if="project.__client_data">{{ project.__client_data.name }}</span>
            </template>

            <template v-slot:sublabel><i>{{ project.actual_hours }} Stunden insgesamt</i></template>
          </InputCheckboxCard>

          <a icon="↓" icon-position="start" class="truncate-link" @click.prevent="truncateProjects = false" v-if="truncateProjects">Alle anzeigen</a>
          <a icon="↑" icon-position="start" class="truncate-link" @click.prevent="truncateProjects = true" v-else>Weniger anzeigen</a>
        </div>
        
        <LoadingSpinner v-else />
      </div>

      <div class="button-group">
        <Button buttonType="secondary" @click.native="$router.push({ name: 'AuthSignup__accountConfig__3' })">&larr; Zurück</Button>
        <Button type="submit" :isLoading="isLoading">Weiter &rarr;</Button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .project {
    .client {
      font-weight: 400;
      color: rgba(#fff, .75);
      margin: 4px 0 8px;
      display: block;
    }

    &__color-dot {
      height: 12px;
      width: 12px;
      display: inline-block;
      margin-left: 4px;
      border-radius: 100%;
    }
  }

  .truncate-link {
    margin: 24px auto 0;
    display: table;
    text-align: center;
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
    name: 'AuthSignup__accountConfig__4',

    components: { Button, AlertBox, LoadingSpinner, InputCheckboxCard },

    data: () => ({
      isLoading: false,
      error: false,
      user: auth.currentUser(),
      projects: null,
      truncateProjects: true,
      clients: [],
      errorNoProjectsInWorkspace: false,
      selectedProjects: auth.currentUser()?.user_metadata?.trackedProjects || []
    }),

    computed: { 
      listProjects() { 
        const projects = this.projects
        if (!projects)
          return null

        // Sort projects by the actual hours
        projects.sort((a, b) => { return b.actual_hours - a.actual_hours })

        // Get the client for every project
        this.projects = projects.map(project => {
          const client = this.clients.find(client => client.id === project.cid)

          return { ...project, __client_data: client || null }
        })

        return this.truncateProjects ? this.projects.slice(0, 3) : this.projects
      }
    },

    async created() {
      try {
        const workspaceID = this.user?.user_metadata?.trackedWorkspace

        // Get all projects inside selected workspace
        const projects = await TogglAPI.getWorkspaceProjects(workspaceID)
        if (!projects)
          return this.errorNoProjectsInWorkspace = true

        // Get all workspace's clients
        const clients = await TogglAPI.getWorkspaceClients(workspaceID)
        

        this.projects = projects
        this.clients = clients

      } catch (error) {
        this.error = true
        console.error(error)
      }
    },

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.error = false
        this.errorNoProjectsInWorkspace = false

        try {
          const user = auth.currentUser()

          // Update user data to fill in the tracked workspace
          await user.update({ data: { trackedProjects: this.selectedProjects } })

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