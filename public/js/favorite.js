class Favorite {
  constructor() {
    this.$favorite = document.getElementById('favorite');
    this._memberId = this.$favorite.dataset.userId;
    // 1. 버튼 클릭 시 상자 보여주기, 이벤트 위임
    this.$favoritGrid = document.querySelector('.favorite-grid');
    this.$favoritGrid.onclick = this.showRound.bind(this);
    this.$roundForm = document.getElementById('round-box');
    this.$roundForm.onsubmit = this.clickRound.bind(this);
    this._round = null;
    this._id = null;
    // 2. 취소 버튼
    this.$cancel = document.querySelector('.round-cancel');
    this.$cancel.onclick = this.cancelForm.bind(this);
    this.$radios = Array.from(document.querySelectorAll('.radio-input'));
  }
  // 몇라운드 클릭했는지, 
  // 어떤 카테고리인지 저장, 
  showRound(e) {
    const target = e.target.closest('.favorite');
    if(!target) return;
    this._id = target.dataset.id;
    this.$roundForm.hidden = false;
  }

  clickRound(e) {
    e.preventDefault();
    this._round = e.target.round.value;
    this.resetForm();
    window.location.href = `/favorite/${this._id}/${this._round}/${this._memberId}`
  }
  // 2. 취소 버튼
  cancelForm(e) {
    this.resetForm();
  }

  resetForm() {
    for(let radio of this.$radios) {
      radio.checked = false;
    }
    this.$roundForm.hidden = true;
  }
}

new Favorite();