<template>
  <div>
    <h1>Hej, {{ user.user_metadata.full_name }}!</h1>

    <AlertBox icon="🌐" type="success" v-if="togglConnectionSuccessful">
      Die Verbindung zu Toggl wurde erfolgreich hergestellt.
    </AlertBox>

    <p>Trag hier ein, an welchen Wochentagen du wieviel arbeitest.</p>

    <transition name="slide">
      <AlertBox icon="😬" type="error" v-if="error">
        Fehler beim speichern der Wochentage. Versuch es bitte noch einmal.
      </AlertBox>
    </transition>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="input-group">
        <label for="business-day__monday">Montag:</label>
        <input type="number" name="business-day__monday" v-model.number="configData.businessDays.monday" placeholder="Keine Arbeit" min="0.5" max="16" step="0.5">
        <span>Stunden</span>
      </div>
      <div class="input-group">
        <label for="business-day__tuesday">Dienstag:</label>
        <input type="number" name="business-day__tuesday" v-model.number="configData.businessDays.tuesday" placeholder="Keine Arbeit" min="0.5" max="16" step="0.5">
        <span>Stunden</span>
      </div>
      <div class="input-group">
        <label for="business-day__wednesday">Mittwoch:</label>
        <input type="number" name="business-day__wednesday" v-model.number="configData.businessDays.wednesday" placeholder="Keine Arbeit" min="0.5" max="16" step="0.5">
        <span>Stunden</span>
      </div>
      <div class="input-group">
        <label for="business-day__thursday">Donnerstag:</label>
        <input type="number" name="business-day__thursday" v-model.number="configData.businessDays.thursday" placeholder="Keine Arbeit" min="0.5" max="16" step="0.5">
        <span>Stunden</span>
      </div>
      <div class="input-group">
        <label for="business-day__friday">Freitag:</label>
        <input type="number" name="business-day__friday" v-model.number="configData.businessDays.friday" placeholder="Keine Arbeit" min="0.5" max="16" step="0.5">
        <span>Stunden</span>
      </div>
      <div class="input-group">
        <label for="business-day__saturday">Samstag:</label>
        <input type="number" name="business-day__saturday" v-model.number="configData.businessDays.saturday" placeholder="Keine Arbeit" min="0.5" max="16" step="0.5">
        <span>Stunden</span>
      </div>
      <div class="input-group">
        <label for="business-day__sunday">Sonntag:</label>
        <input type="number" name="business-day__sunday" v-model.number="configData.businessDays.sunday" placeholder="Keine Arbeit" min="0.5" max="16" step="0.5">
        <span>Stunden</span>
      </div>

      <p class="counter"><strong>{{calculatedHours}}</strong> Stunden gesamt/Woche</p>

      <div class="button-group">
        <Button buttonType="secondary" @click.native="$router.push({ name: 'AuthSignup__accountConfig__2' })">&larr; Zurück</Button>
        <Button type="submit" :isLoading="isLoading" tabindex="1">Weiter &rarr;</Button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .input-group {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    label {
      width: 104px;
      text-align: right;
      
      font-size: 18px;
      line-height: 24px;
      color: rgba(#fff, 0.5);
    }

    input {
      width: 96px;
      flex-shrink: 0;
      margin: 0 16px 0 24px;
    }

    span {
      flex: 1;
      color: rgba(#fff, 0.25);
    }
  }

  .counter {
    text-align: center;
    margin: 16px 0;
  }
</style>

<script>
  import auth from '../functions/gotrue-auth'

  import AlertBox from '../components/AlertBox'
  import Button from '../components/Button'

  import TogglAPI from '../functions/toggl-api'

  export default {
    name: 'AuthSignup__accountConfig__3',

    components: { Button, AlertBox },

    data: () => ({
      configData: {
        businessDays: {
          monday: 8,
          tuesday: 8,
          wednesday: 8,
          thursday: 8,
          friday: 8,
          saturday: '',
          sunday: ''
        }
      },
      isLoading: false,
      error: false,
      togglConnectionSuccessful: true,
      user: auth.currentUser()
    }),

    computed: {
      calculatedHours() {
        const bd = Object.values(this.configData.businessDays)
        return bd.reduce((a, b) => a + b, 0)
      }
    },

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.error = false
        this.togglConnectionSuccessful = null

        try {
          const businessDays = Object.values(this.configData.businessDays).map(item => (item !== '') ? item : null)
          await auth.currentUser().update({ data: { businessDays } })

          this.$router.push({ name: 'Dashboard' })

        } catch (error) {
          this.error = true
          console.error(error)
        }

        this.isLoading = false
      }
    }
  }
</script>