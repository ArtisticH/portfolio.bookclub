class Memebr {
  constructor() {
    this.$bookElem = document.querySelector('.member__info__numbers__books');
    this.$attendanceElem = document.querySelector('.member__info__numbers__attendance');
    this.$tooltip = null;
    this.showTooltip = this.showTooltip.bind(this);
    this.disappearTooltip = this.disappearTooltip.bind(this);
    this.$bookElem.addEventListener('pointerenter', this.showTooltip);
    this.$attendanceElem.addEventListener('pointerenter', this.showTooltip);
  }

  showTooltip(e) {
    this.$tooltip = document.querySelector(`.${e.currentTarget.dataset.type}-tooltip`);
    this.$tooltip.hidden = false;
    e.currentTarget.addEventListener('pointerleave', this.disappearTooltip);
  }

  disappearTooltip(e) {
    this.$tooltip.hidden = true;
  }
}

new Memebr();