<template>
  <div>
    <div
      :isChecked="value"
      :style="styleVariables.css"
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
      value: { type: Boolean, required: true }
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
        console.log(this.draggability.offset, this.styleVariables.obj.triggerSize)
        return this.css.transform > this.styleVariables.obj.triggerSize
      },
      cssTransformString() {
        return this.draggability.dragging ? `translateX(${this.css.transform}px)` : null
      },
      styleVariables() {
        const data = {
          __width: 72,
          __knobSize: 32,
          __knobSpace: 4,
          __knobResizeOnDrag: 4
        }
        data['__knobSpaceToOtherSide'] = data.__width - data.__knobSize - (data.__knobSpace * 2)

        return {
          css: {
            '--width': data.__width + 'px',
            '--knob-size': data.__knobSize + 'px',
            '--knob-space': data.__knobSpace + 'px',
            '--knob-resize-on-drag': data.__knobResizeOnDrag + 'px',
            '--knob-space-to-other-side': data.__knobSpaceToOtherSide + 'px'
          },
          obj: {
            ...data,

            // The amount of pixels before it starts to get from true to false and vice verca
            triggerSize: data.__width / 2 - data.__knobSize / 2
          }
        }
      },
    },

    mounted() {
      document.addEventListener('mouseup', () => { this.dragEnd() })
      document.addEventListener('mousemove', ( e ) => { this.drag(e) })

      if (!!this.value) 
        this.switchValue('on')

      console.log(this.styleVariables.obj.triggerSize)
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
            this.css.transform = this.styleVariables.obj.__knobSpaceToOtherSide
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

        const spaceToOtherSide = this.styleVariables.obj.__knobSpaceToOtherSide

        offset = this.draggability.offsetInitial - e.clientX
        this.draggability.offset = this.value ? offset : offset * -1

        transform = this.value ? spaceToOtherSide - this.draggability.offset : this.draggability.offset

        // limit between 0 and x (depends on width of knob & switch)
        this.css.transform = Math.min(Math.max(parseInt(transform), 0), spaceToOtherSide) 
      },

      dragEnd() {
        if (!this.draggability.dragging)
          return 

        if (this.draggability.offset >= 0) 
          if (this.draggability.offset <= 2) 
            // User clicked on it instead of dragging it. Toggle state.
            this.switchValue()

          else if (this.draggability.offset <= this.styleVariables.obj.triggerSize)
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
    border-radius: 100px;
    background: #2F3437;
    position: relative;
    height: calc(var(--knob-size) + (var(--knob-space) * 2));
    width: var(--width);
    display: block;
    user-select: none;
    cursor: pointer;

    &:active .knob {
      right: var(--knob-space-to-other-side);

      &.is-active {
        left: 0px;
        right: calc(var(--knob-space-to-other-side) + var(--knob-resize-on-drag))
      }
    }

    .knob {
      display: block;
      height: var(--knob-size);
      border-radius: 100px;
      position: absolute;
      left: var(--knob-space);
      right: calc(var(--knob-space-to-other-side) + var(--knob-resize-on-drag));
      top: var(--knob-space);
      background-color: #788287;
      transition-duration: 300ms;
      transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transition-property: background-color, width, right, left;

      &.is-not-dragging {
        transition-property: all;
      }

      &.is-active {
        background-color: #2EAADC;
        transform: translateX(var(--knob-space-to-other-side));
      }
    }
  }
</style>