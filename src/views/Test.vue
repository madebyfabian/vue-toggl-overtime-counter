<template>
  <div>
    Test
  </div>
</template>

<script>
  import makeRequest from '@/plugins/makeRequest'
  import auth from '@/plugins/GotrueAuth'

  export default {
    async created() {
      // console.log(await makeRequest('/auth', {
      //   method: 'POST',
      //   provider: { 
      //     name: 'papierkram', 
      //     subdomain: 'madebyfabian'
      //   },
      //   params: { 
      //     email: '' 
      //     password: ''
      //   },
      //   debug: true
      // }))

      // console.log(await makeRequest('/contact/companies.json', {
      //   provider: 'papierkram',
      //   debug: true,
      //   requiresAuth: true
      // }))

      console.log('togglAuth', await makeRequest('/me', {
        provider: 'toggl',
        params: {
          email: '',
          password: ''
        },
        debug: true
      }))

      console.log('togglWorkspaces', await makeRequest('/workspaces', {
        provider: 'toggl',
        requiresAuth: true,
        debug: true
      }))
    }
  }
</script>

<style lang="scss" scoped>
  .button {
    background: grey;
  }
</style>