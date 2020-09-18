<template>
  <div>
    <pre>{{ timer }}</pre>

    <main>
      <section class="tracker">
        <div class="tracker__timer">
          <div class="time-status">
            <div 
              v-for="(item, key) of timerStatus"
              :key="key"
              :class="`time-status__item time-status__item--${key}`">

              {{ (key !== 'hours') ? `:${item.toString().padStart(2, '0')}` : item }}
            </div>
          </div>
          <div class="timer-buttons">
            <button class="timer-button" 
              variant="save"
              v-if="timer.totalSeconds !== 0"
              @click="clickedSave">

              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 23V17H21V23H23V11.828L20.172 9H9V23H11ZM8 7H21L25 11V24C25 24.2652 24.8946 24.5196 24.7071 24.7071C24.5196 24.8946 24.2652 25 24 25H8C7.73478 25 7.48043 24.8946 7.29289 24.7071C7.10536 24.5196 7 24.2652 7 24V8C7 7.73478 7.10536 7.48043 7.29289 7.29289C7.48043 7.10536 7.73478 7 8 7ZM13 19V23H19V19H13Z" fill="white"/>
              </svg>
            </button>

            <button 
              class="timer-button" 
              variant="start"
              v-if="!timer.isRunning" 
              @click="clickedStart">

              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9999 11.3093V20.6907L20.0399 16L11.9999 11.3093ZM10.3359 7.25333L24.3466 15.4267C24.447 15.4854 24.5303 15.5695 24.5881 15.6704C24.646 15.7713 24.6765 15.8857 24.6765 16.002C24.6765 16.1183 24.646 16.2327 24.5881 16.3336C24.5303 16.4345 24.447 16.5186 24.3466 16.5773L10.3359 24.7507C10.2343 24.81 10.1188 24.8413 10.0012 24.8415C9.88355 24.8418 9.76794 24.8109 9.66611 24.7519C9.56427 24.693 9.47984 24.6082 9.42138 24.5061C9.36292 24.404 9.33252 24.2883 9.33327 24.1707V7.828C9.33323 7.71069 9.36415 7.59546 9.42289 7.49393C9.48164 7.39239 9.56614 7.30816 9.66785 7.24973C9.76956 7.1913 9.88489 7.16074 10.0022 7.16114C10.1195 7.16153 10.2346 7.19288 10.3359 7.252V7.25333Z" fill="white"/>
              </svg>
            </button>

            <button 
              class="timer-button" 
              variant="stop"
              v-if="timer.isRunning"
              @click="clickedStop">

              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6.66663H10.6667V25.3333H8V6.66663ZM21.3333 6.66663H24V25.3333H21.3333V6.66663Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>  

        <InputField variant="bottomLine" placeholder="Was machst du gerade?" v-model="timer.settings.taskName" />

        <div class="tracker__settings">
          <Button buttonType="dropdown">Projekt auswählen &darr;</Button>

          <div class="billable-switch">
            €
            <ToggleSwitch v-model="timer.settings.isBillable" />
          </div>
        </div>
      </section>
      
      <TimerEntryList v-if="entries" :entryData="entries" />
    </main>
  </div>
</template>

<script>
  import auth from '@/plugins/GotrueAuth'
  import { Papierkram, PapierkramHelpers } from '@/plugins/Papierkram'
  import TimerEntryList from '@/components/views/Timer/TimerEntryList'
  import ToggleSwitch from '@/components/ToggleSwitchV2'
  import InputField from '@/components/InputField'

  import Button from '@/components/Button'

  export default {
    components: { TimerEntryList, ToggleSwitch, Button, InputField },

    data: () => ({
      timer: {
        totalSeconds: 0,
        isRunning: false,
        interval: null,
        settings: {
          taskName: '',
          isBillable: true
        }
      },
      dataFromAPI: {
        projects: null,
        tasks: null,
        timerEntryGroups: null
      },
      entries: null
    }),

    computed: {
      timerStatus() {
        var hours   = Math.floor(this.timer.totalSeconds / 3600);
        var minutes = Math.floor((this.timer.totalSeconds - (hours * 3600)) / 60);
        var seconds = this.timer.totalSeconds - (hours * 3600) - (minutes * 60);

        return { hours, minutes, seconds }
      }
    },

    async created() {
      console.log(auth.currentUser().user_metadata.data.providers)
      const dataFromAPI = await this.collectDataFromAPI()
      if (!dataFromAPI)
        return

      // Add the specific task data to every entry.
      this.entries = dataFromAPI.timerEntryGroups.map(entryGroup => {
        let completeDuration = 0
        const entries = entryGroup.entries.map(entry => {
          completeDuration += entry.duration
          return { ...entry, task: dataFromAPI.tasks.find(task => task.id === entry.taskId) }
        })

        return { ...entryGroup, entries, completeDuration }
      })
    },

    methods: {
      async collectDataFromAPI() {
        const dataFromAPI = {
          projects: await Papierkram.getProjects() || null,
          tasks: await Papierkram.getTasks() || null,
          timerEntryGroups: await Papierkram.getTrackerEntries({ groupEntriesByDate: true }) || null,
        }

        if (!dataFromAPI.projects || !dataFromAPI.tasks || !dataFromAPI.timerEntryGroups)
          return false
      
        return dataFromAPI
      },

      clickedStart() {
        this.timer.isRunning = true
        this.interval = setInterval(() => {
          this.timer.totalSeconds = this.timer.totalSeconds + 1
        }, 1000)
      },

      clickedStop() {
        this.timer.isRunning = false

        clearInterval(this.interval)
      },

      clickedSave() {
        this.timer.isRunning = false
        this.timer.totalSeconds = 0

        clearInterval(this.interval)
      },
    }
  }
</script>

<style lang="scss" scoped>
  main {
    background: #2F3437;
    max-width: 414px;
    width: 100%;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
    border-radius: 24px;
    margin: 0 auto;

    // only dev
    margin-top: 100px;
  }

  .tracker {
    background: #363B3E;
    padding: 32px;
    border-radius: 24px;

    &__timer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .time-status {
        display: flex;
        user-select: none;

        &__item {
          font-size: 32px;
          line-height: 56px;
          letter-spacing: -1px;
          font-feature-settings: 'tnum' on, 'lnum' on;
        
          &--seconds {
            opacity: .5;
          }
        }
      }

      .timer-buttons {
        display: flex;
        justify-content: flex-end;
        
        button[class^=timer-button] {
          height: 56px;
          width: 56px;
          border-radius: 56px;
          border: none;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 150ms;

          &:not(:last-child) {
            margin-right: 8px;
          }

          &:hover {
            opacity: .75;
          }

          &[variant=start] {
            background: #2EAADC;
          }

          &[variant=stop] {
            background: #DC2E2E;
          }

          &[variant=save] {
            background: transparent;
            border: 2px solid #454B4E;
          }
        }
      }
    }

    &__settings {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .billable-switch {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .switch {
          margin-left: 8px;
        }
      }

      
    }
  }
</style>