<template>
  <div id="app" :class="a11yClass">
    <router-view/>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'App',

    data: () => ({
      'a11yClass': 'using-keyboard'
    }),

    methods: {
      a11yClassChange(usingKeyboard) {
        this.a11yClass = usingKeyboard ? 'using-keyboard' : 'using-mouse'
      }
    },

    created() {
      //  [App.vue specific] When App.vue is first loaded start the progress bar
      this.$Progress.start()
      //  hook the progress bar to start before we move router-view
      this.$router.beforeEach((to, from, next) => {
        //  does the page we want to go to have a meta.progress object
        if (to.meta.progress !== undefined) {
          let meta = to.meta.progress
          // parse meta tags
          this.$Progress.parseMeta(meta)
        }
        //  start the progress bar
        this.$Progress.start()
        //  continue to next page
        next()
      })
      //  hook the progress bar to finish after we've finished moving router-view
      this.$router.afterEach((to, from) => {
        //  finish the progress bar
        this.$Progress.finish()
      })
    },

    mounted() {
      //  [App.vue specific] When App.vue is finish loading finish the progress bar
      this.$Progress.finish()

      window.addEventListener('keydown', (e) => this.a11yClassChange(true))
      window.addEventListener('mousedown', (e) => this.a11yClassChange(false))
      window.addEventListener('touchstart', (e) => this.a11yClassChange(false))
    }
  }
</script>

<style lang="scss">
  :root {
    --color--brand-toggl: #E24F54;
    --color--brand-papierkram: #03A9F4;
  }

  body {
    margin: 0;
    padding: 0;
    background: #2F3437;
    color: #fff;
  }

  html, * { 
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    font-size: 16px;

    &:focus { 
      outline: none;
      box-shadow: none;
    }
  }

  @supports (font-variation-settings: normal) {
    html, * {
      font-family: 'Inter var', system-ui, sans-serif;
    }
  }

  .using-keyboard *:focus {
    box-shadow: 0 0 0 3px rgba(#2EAADC, .5)
  }

  h1, h2, h3, p {
    margin: 0;
  }

  h1 {
    font-weight: bold;
    font-size: 48px;
    line-height: 64px;
    min-height: 64px;
    margin: 0 0 40px;
    font-variant-numeric: diagonal-fractions;
  }

  h2 {
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 16px;
  }

  a {
    color: #2EAADC;
    text-decoration: none;
    transition: opacity 150ms ease;
    cursor: pointer;

    &:hover {
      opacity: .75;
    }

    &:active {
      opacity: .5;
    }


    /** Icons */
    &::after {
      content: ' →'
    }

    &[target=_blank]::after {
      content: ' ↗'
    }


    @mixin iconOnStart {
      &::before { content: attr(icon)" " }
      &::after { content: "" }
    }

    @mixin iconOnEnd {
      &::before { content: "" }
      &::before { content: attr(icon)" " }
    }

    &[icon] {
      @include iconOnEnd;
      &[icon-position=start] { @include iconOnStart }
      &[icon-position=end] {   @include iconOnEnd }
    }
  }

  p {
    color: rgba(#fff, .75);
    max-width: 328px;
    width: 100%;
    line-height: 24px;
    margin: 0 auto 40px;
  }

  .auth-form {
    max-width: 328px;
    width: 100%;
    margin: 0 auto;
    text-align: left;
    display: flex;
    flex-direction: column;

    .link--password-lost {
      margin: 12px 0 0;
      align-self: flex-end;
    }

    .input-field:last-of-type {
      margin: 0;
    }

    button {
      margin-top: 40px;
    }
  }

  .button-stack {
    button:not(:first-child) {
      margin-top: 24px;
    }
  }

  .button-group {
    display: flex;
    
    *:first-child {
      margin-right: 8px;
    }

    *:last-child {
      margin-left: 8px;
    }
  }

  .link-with-text {
    font-size: 18px;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 64px;

    a {
      margin-left: 12px;
      font-size: 18px;
    }
  }

  // Transitions
  .slide-enter-active {
    transition: all 450ms ease;
  }
  .slide-leave-active {
    transition: all 300ms cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-enter, .slide-fade-leave-to {
    // transform: translateX(-80px);
    opacity: 0;
  }
</style>
