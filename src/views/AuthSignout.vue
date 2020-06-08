<template>
  <div>
    <AlertBox icon="👋" type="success">Erfolgreich ausgeloggt. Bis zum nächsten mal!</AlertBox>
    <router-link :to="{ name: 'AuthSignin' }">Login</router-link>
  </div>
</template>

<script>
  import AlertBox from '../components/AlertBox'

  export default {
    components: { AlertBox }
  }
</script>