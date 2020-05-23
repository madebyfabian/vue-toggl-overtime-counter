<template>
  <div>
    <AlertBox icon="👋" type="success">Erfolgreich ausgeloggt. Bis zum nächsten mal!</AlertBox>
    <router-link :to="{ name: 'AuthSignin' }">Login</router-link>
  </div>
</template>

<script>
  import auth from '../functions/gotrue-auth'

  import AlertBox from '../components/AlertBox'

  export default {
    name: 'AuthSignout',

    components: { AlertBox }
  }
</script>