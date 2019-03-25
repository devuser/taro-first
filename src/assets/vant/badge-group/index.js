import { VantComponent } from '../common/component';
import { isnumber } from '../common/utils';
VantComponent({
  relation: {
    name: 'badge',
    type: 'descendant',
    linked: function linked(target) {
      this.badges.push(target);
      this.setActive();
    },
    unlinked: function unlinked(target) {
      this.badges = this.badges.filter(function (item) {
        return item !== target;
      });
      this.setActive();
    }
  },
  props: {
    active: {
      type: number,
      value: 0
    }
  },
  watch: {
    active: 'setActive'
  },
  beforeCreate: function beforeCreate() {
    this.badges = [];
    this.currentActive = -1;
  },
  methods: {
    setActive: function setActive(badge) {
      var active = this.data.active;
      var badges = this.badges;

      if (badge && !isnumber(badge)) {
        active = badges.indexOf(badge);
      }

      if (active === this.currentActive) {
        return;
      }

      if (this.currentActive !== -1 && badges[this.currentActive]) {
        this.$emit('change', active);
        badges[this.currentActive].setActive(false);
      }

      if (badges[active]) {
        badges[active].setActive(true);
        this.currentActive = active;
      }
    }
  }
});