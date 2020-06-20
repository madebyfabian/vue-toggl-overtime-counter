<template>
  <div>
    <h1>Konto erstellen</h1>

    <form class="auth-form">
      <section class="continue-with-toggl">
        <div class="button-stack">
          <Button
            v-for="(provider, id) of providers" 
            :key="id"
            :class="`branded-button--${provider.name}`"
            class="branded-button" 
            @click.native="$router.push({ name: 'AuthSignup_withProvider', params: { provider: provider.name } })">

            Weiter mit <img :src="require(`@/static/images/logo--${provider.name}--on-dark.svg`)">
          </Button>
        </div>
      </section>
    </form>

    <div class="link-with-text">
      Du hast schon ein Konto?
      <router-link :to="{ name: 'AuthSignin' }">Anmelden</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .branded-button {
    color: #fff;
    margin-top: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &--toggl {
      background: var(--color--brand-toggl);
    }

    &--papierkram {
      background: var(--color--brand-papierkram);
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

  import { providers } from '@/config'

  export default {
    components: { Button },

    data: () => ({
      providers
    })
  }
</script>

