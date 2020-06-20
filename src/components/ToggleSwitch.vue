<template>
  <div>
    <label>
      <input type="checkbox" :checked="value">
      <div class="switch" ref="switch">
        <div 
          class="knob" 
          @click.prevent="clicked"
          @mousedown.prevent="startDrag" 
          @mousemove.prevent="doDrag"
          @mouseup.prevent="stopDrag"
          :class="{ 'has-transform-transition': hasTransition }"
          :style="{ 'transform': `translateX(${cssTransform}px)` }" 
          :isChecked="value"
        />
      </div>
    </label>

    <pre>{{ {...this.$data, value} }}</pre>
  </div>
</template>

<script>
  // 

  export default {
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },

    data: () => ({
      dragging: false,
      x: 0,
      initialX: 0,
      cssTransform: 0,
      hasTransition: true
    }),

    created() {
      this.cssTransform = this.value ? 24 : 0
    },

    methods: {
      clicked(e) {
        return {}
        console.log(e.type)
      },

      switchOff() {
        console.log('switchOff()')

        this.$emit('input', false)
        this.cssTransform = 0
      },

      switchOn() {
        console.log('switch on')

        this.$emit('input', true)
        this.cssTransform = 24
      },

      startDrag( e ) {
        console.log('startDrag', e.type)

        this.dragging = true
        this.x = 0
        this.initialX = e.clientX
        this.hasTransition = false
        // console.log(this.$refs.switch.getBoundingClientRect().left)
      },

      stopDrag( e ) {
        console.log('startDrag', e.type)
        this.dragging = false
        this.initialX = 0

        // If user clicked on it instead of dragging it
        if (this.x <= 2) 
          if (!!this.value) 
            // It was on, so turn it off
            this.switchOff()
          else 
            // It was off, so turn it on
            this.switchOn()
          
        // else {
        //   if (this.x >= 12) {
        //     // User moved it so wide that it actually should change now 
        //     if (!!this.value)
        //       // It was on, so turn it off
        //       this.switchOff()
        //     else
        //       // It was off, so turn it on
        //       this.switchOn()
            
        //   } else {
        //     // User moved it, but not enough
        //     if (!!this.value) 
        //       // It was on, let it on
        //       this.switchOn()

        //     else 
        //       // It was off, let it off
        //       this.switchOff()
            
        //   }
        // }

        this.hasTransition = true
        this.x = 0
      },

      doDrag( e ) {
        if (this.dragging) {
          console.log('doDrag', e.type)

          const val = this.initialX - e.clientX
          
          this.x = !!this.value ? val : val * -1

          // // this.cssTransform = this.x <= 24 ? this.x : 24
          // const cssTransformPreVal = val * -1
          // const cssTransform = !!this.value ? 24 + cssTransformPreVal : cssTransformPreVal
          // this.cssTransform = cssTransform <= 24 ? cssTransform : 24
        }
      }
    },

    // mounted() {
    //   this.$refs.switch.addEventListener('mouseup', this.stopDrag);
    // }
  }
</script>

<style lang="scss" scoped>
  label {
    height: 40px;
    width: 64px;
    display: block;
    user-select: none;
    position: relative;
    cursor: pointer;

    input {
      box-shadow: none!important;
      height: 0;
      width: 0;
      position: absolute;

      &:checked ~ .switch .knob {
        // transform: translateX(24px);
        background-color: #2EAADC;
      }

      // &:active ~ .switch .knob {
      //   width: 36px;
      // }

      // &:checked:active ~ .switch .knob {
      //   transform: translateX(20px);
      // }

      @at-root .using-keyboard label input:focus ~ .switch {
        box-shadow: 0 0 0 3px rgba(#2EAADC, .5)
      }
    }

    .switch {
      border-radius: 40px;
      background: #2F3437;
      height: 100%;
      width: 100%;
      overflow: hidden;

      .knob {
        display: block;
        height: 32px;
        width: 32px;
        border-radius: 32px;
        position: absolute;
        left: 4px;
        top: 4px;
        background-color: #788287;

        &.has-transform-transition {
          transition: all 150ms ease;
        }
      }
    }
  }
</style>