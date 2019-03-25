import { VantComponent } from '../common/component';
VantComponent({
  props: {
    show: Boolean,
    mask: Boolean,
    message: String,
    forbidClick: Boolean,
    zIndex: {
      type: number,
      value: 1000
    },
    type: {
      type: String,
      value: 'text'
    },
    loadingType: {
      type: String,
      value: 'circular'
    },
    position: {
      type: String,
      value: 'middle'
    }
  },
  methods: {
    clear: function clear() {
      this.set({
        show: false
      });
    },
    // for prevent touchmove
    noop: function noop() {}
  }
});