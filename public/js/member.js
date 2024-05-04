class Memebr {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. tooltip
    this.$numbersElem = document.querySelector('.member__numbers');
    this.$tooltip = null;
    this.funShowTooltip = this.funShowTooltip.bind(this);
    this.$numbersElem.addEventListener('pointerover', this.funShowTooltip);
  }

  funShowTooltip(e) {
    const target = e.target.closest('.tooltip-elem');
    if(!target) return;
    console.log('in');
    const type = target.dataset.type;
    this.$tooltip = document.querySelector(`.${type}-tooltip`);
    this.$tooltip.hidden = false;
    target.addEventListener('pointerout', () => {
      console.log('out');
      this.$tooltip.hidden = true;
    });
  }
}

new Memebr();