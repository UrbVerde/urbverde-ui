<!-- src/components/Mapa/components/VmPopup.vue -->
<template>
  <div :style="{ maxHeight: myMaxHeight, overflow: 'auto' }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'VmPopup',
  inject: ['getMap', 'maplibregl', 'MaplibreVueInstance'],

  props: {
    color: {
      type: String,
      default: 'white'
    },
    textColor: {
      type: String,
      default: 'black'
    },
    maxHeight: {
      type: [String, Number],
      default: 'auto'
    },
    trackPointer: {
      type: Boolean,
      default: true
    },
    open: {
      type: Boolean,
      default: false
    },
    position: {
      type: Array,
      default: () => [0, 0]
    }
  },

  data() {
    return {
      popup: null
    };
  },

  watch: {
    open(newVal) {
      if (!this.popup) {return;}

      if (newVal) {
        if (!this.popup.isOpen()) {
          this.popup.addTo(this.getMap());
        }
      } else {
        this.popup.remove();
      }
    },

    position(newPos) {
      if (this.popup && this.popup.isOpen()) {
        this.popup.setLngLat(newPos);
      }
    }
  },

  computed: {
    myMaxHeight() {
      let h = this.maxHeight;
      if (typeof h === 'number') {
        h += 'px';
      }

      return h;
    }
  },

  mounted() {
    this.createPopup();
  },

  beforeUnmount() {
    if (this.popup) {
      this.popup.remove();
    }
  },

  methods: {
    createPopup() {
      const options = {
        closeButton: false,
        closeOnClick: false,
        className: '',
        trackPointer: this.trackPointer,
        offset: [0, -10]
      };

      const maplibregl = this.maplibregl();
      this.popup = new maplibregl.Popup(options)
        .setLngLat(this.position)
        .setDOMContent(this.$el);

      const popupElement = this.popup.getElement();
      if (popupElement) {
        const content = popupElement.querySelector('.maplibregl-popup-content');
        if (content) {
          content.style.backgroundColor = this.color;
          content.style.color = this.textColor;
        }
      }

      // If open is true initially, show popup
      if (this.open) {
        this.popup.addTo(this.getMap());
      }
    }
  }
};
</script>

<style>
.maplibregl-popup-content {
  padding: 8px;
  border-radius: 4px;
}

.maplibregl-popup {
  z-index: 9999;
}
</style>
