<template>
  <div v-if="provider">
    <img :src="require(`@/static/images/logo--${ provider.name }--default.svg`)">
    <p>Melde dich mit deinem <br>{{ provider.niceName }}-Account an.</p>

    <transition name="slide">
      <AlertBox icon="😢" type="error" v-if="authError">
        Deine {{provider.name === 'papierkram' ? 'Subdomain,' : ''}} E-Mail oder das Passwort ist leider falsch.
      </AlertBox>
    </transition>
      
    <form @submit.prevent="handleSubmit" class="auth-form">
      <InputField 
        v-if="provider.name === 'papierkram'"
        v-model.trim="user.papierkram__subdomain"
        valueAppend=".papierkram.de"
        placeholder="subdomain"
        autocomplete="off"
        :disable-password-managers="true"
      />

      <InputField type="email" v-model.trim="user.email" autocomplete="off" :disable-password-managers="true" />
      <InputField type="password" v-model.trim="user.password" autocomplete="off" :disablePasswordManagers="true" />

      <div class="button-stack">
        <Button 
          type="submit" 
          :style="{ background: `var(--color--brand-${provider.name})`, color: '#fff' }" 
          :isLoading="isLoading">
          Anmelden
        </Button>

        <Button
          buttonType="secondary"
          @click.native="$router.push({ name: 'AuthSignup' })">
          Zurück
        </Button>
      </div>
    </form>
  </div>
</template>

<script>
  import auth from '@/plugins/GotrueAuth'

  import Button from '@/components/Button'
  import AlertBox from '@/components/AlertBox'
  import InputField from '@/components/InputField'

  import { Papierkram } from '@/plugins/Papierkram'
  import Toggl from '@/plugins/Toggl.API'

  import { providers } from '@/config'

  export default {
    components: { Button, AlertBox, InputField },

    data: () => ({
      user: {
        email: '',
        password: '',
        papierkram__subdomain: ''
      },
      authError: false,
      isLoading: false,
      provider: null
    }),

    created() {
      let provider = providers.find(provider => provider.name === this.$route.params?.provider)
      if (!provider)
        this.$router.push({ name: 'AuthSignup' })
      
      this.provider = provider
    },

    methods: {
      async handleSubmit() {
        this.isLoading = true
        this.authError = false
        this.$Progress.start()

        try {
          // Authenticate at the provider.
          switch (this.provider.name) {
            case 'papierkram': {
              const authRes = await Papierkram.authenticate(this.user.papierkram__subdomain, this.user.email, this.user.password)
              this.$store.temp.user.name = authRes.name
              this.$store.temp.providers['papierkram'] = { authToken: authRes.authToken, subdomain: authRes.subdomain }
              break
            }
            
            case 'toggl': {
              const authRes = await Toggl.authenticate(this.user.email, this.user.password)
              this.$store.temp.user.name = authRes.name
              this.$store.temp.providers['toggl'] = { authToken: authRes.authToken }
              break
            }
          }

          this.$store.temp.user.email = this.user.email

          this.$router.push({ name: 'AuthSignup_createAccount', params: { connectionToProvider: { 
            niceName: this.provider.niceName,
            successful: true }
          } })
          this.isLoading = false
            
        } catch (error) {
          this.authError = true
          this.isLoading = false
          this.$Progress.fail()
          
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  img {
    height: 40px;
    margin: 0 auto 40px;
  }
</style>