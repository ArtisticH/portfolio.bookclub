class Memebr {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. tooltip
    this.$numbers = document.querySelector('.member__numbers');
    this.$tooltip = null;
    this.tooltip = this.tooltip.bind(this);
    this.$numbers.addEventListener('pointerover', this.tooltip);
    /* --------------------------------------------------------------------------------------------------------- */
    // 2. wishlist, quotes, favorite은 로그인 후 이용 가능
    this.$member = document.getElementById('member');
    this.userId = this.$member.dataset.userId;
    this.$links = document.querySelectorAll('.member__link');
    this.checkLogin = this.checkLogin.bind(this);
    [...this.$links].forEach(link => {
      link.addEventListener('click', this.checkLogin);
    })
  }
  tooltip(e) {
    const target = e.target.closest('.tooltip-elem');
    if(!target) return;
    const type = target.dataset.type;
    this.$tooltip = document.querySelector(`.${type}-tooltip`);
    this.$tooltip.hidden = false;
    target.addEventListener('pointerout', () => {
      this.$tooltip.hidden = true;
    });
  }
  async checkLogin(e) {
    e.preventDefault();
    const target = e.currentTarget;
    const href = target.href;
    if(!this.userId) {
      // 로그인 안 한 상태라면
      alert('로그인 후 이용 가능합니다');
      return;
    } else {
      await axios.get(`${href}`);
    }
  }
}

new Memebr();