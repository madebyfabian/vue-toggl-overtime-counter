<template>
  <div>
    <div
      :isChecked="value"
      @keydown="onKeydown"
      @mousedown.prevent="dragStart"
      ref="switch"
      class="switch" 
      tabindex="0">

      <div 
        :class="{ 'is-active': isActive, 'is-not-dragging': !draggability.dragging }"
        :style="{ 'transform': cssTransformString }"
        class="knob" 
      />
    </div>

    <pre>{{ {...this.$data, value} }}</pre>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },

    data: () => ({
      css: {
        transform: 0
      },
      draggability: {
        dragging: false,
        offset: 0,
        offsetInitial: 0,
      }
    }),

    computed: {
      isActive() {
        return this.css.transform >= 12
      },
      cssTransformString() {
        return this.draggability.dragging ? `translateX(${this.css.transform}px)` : null
      },
      width() {
        const val = getComputedStyle(this.$refs.switch).getPropertyValue('--width')
        return parseInt(val.trim().replace('px', ''))
      }
    },

    created() {
      if (this.value) 
        this.css.transform = 24
    },

    mounted() {
      document.addEventListener('mouseup', () => { this.dragEnd() })
      document.addEventListener('mousemove', ( e ) => { this.drag(e) })

      console.log(this.width)
    },
    
    methods: {
      switchValue( type = null ) {
        if (!type)
          type = this.value ? 'off' : 'on'

        switch (type) {
          case 'off':
            this.$emit('input', false)
            this.css.transform = 0
            break
        
          case 'on':
            this.css.transform = 24
            this.$emit('input', true)
            break
        }
      },

      // Accessiblity
      onKeydown( e ) {
        switch (e.keyCode) {
          case 32: case 13: // Spacebar, Enter
            this.switchValue(); break
        
          case 37: // Arrow left
            this.switchValue('off'); break

          case 39: // Arrow right
            this.switchValue('on'); break
        }
      },

      // Draggability
      dragStart( e ) {
        this.draggability.dragging = true
        this.draggability.offset = 0
        this.draggability.offsetInitial = e.clientX
      },


      drag( e ) {
        let offset, transform
        if (!this.draggability.dragging)
          return

        offset = this.draggability.offsetInitial - e.clientX
        this.draggability.offset = this.value ? offset : offset * -1

        transform = this.value ? 24 - this.draggability.offset : this.draggability.offset
        this.css.transform = Math.min(Math.max(parseInt(transform), 0), 24) // limit between 0 and 24
      },


      dragEnd() {
        if (!this.draggability.dragging)
          return 

        if (this.draggability.offset >= 0) 
          if (this.draggability.offset <= 2) 
            // User clicked on it instead of dragging it. Toggle state.
            this.switchValue()

          else if (this.draggability.offset <= 12)
            // User dragged it, but not enough. Don't change it.
            if (this.value)
              this.switchValue('on') 
            else
              this.switchValue('off')

          else 
            // User dragged it. Toggle state.
            this.switchValue()
       
        this.draggability.dragging = false
        this.draggability.offset = 0
        this.draggability.offsetInitial = 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  .switch {
    --width: 64px;
    border-radius: 100px;
    background: #2F3437;
    position: relative;
    height: 40px;
    width: var(--width);
    display: block;
    user-select: none;
    cursor: pointer;

    // &:active .knob {
    //   width: calc(32px + 4px);
    // }

    .knob {
      --knob-size: 32px;
      --knob-space: 4px;
      display: block;
      height: var(--knob-size);
      width: var(--knob-size);
      border-radius: 100px;
      position: absolute;
      left: var(--knob-space);
      top: var(--knob-space);
      background-color: #788287;
      transition-duration: 300ms;
      transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transition-property: background-color, width;

      &.is-not-dragging {
        transition-property: all;
      }

      &.is-active {
        background-color: #2EAADC;
        transform: translateX(calc(var(--width) - var(--knob-size) - (var(--knob-space) * 2)));
      }
    }
  }
</style>