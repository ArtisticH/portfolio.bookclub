class Favorite {
  constructor() {
    this.$favorite = document.getElementById('favorite');
    // 클릭 시 라운드 상자 보여준다. 
    this.$favoritGrid = document.querySelector('.favorite-grid');
    this.$favoritGrid.onclick = this.showRound.bind(this);
    this.$roundForm = document.getElementById('round-box');
    // 토너먼트로 넘어간다.
    this.$roundForm.onsubmit = this.clickRound.bind(this);
    this._round = null;
    this._id = null;
    // 취소 버튼
    this.$cancel = document.querySelector('.round-cancel');
    this.$cancel.onclick = this.cancelForm.bind(this);
    this.$radios = Array.from(document.getElementsByName('round'));
  }
  // 몇번 카테고리인지 저장
  // 라운드 폼 보여주기
  showRound(e) {
    const target = e.target.closest('.favorite');
    if(!target) return;
    this._id = target.dataset.id;
    this.$roundForm.hidden = false;
  }
  clickRound(e) {
    e.preventDefault();
    let selected = false;
    for(let radio of this.$radios) {
      if(radio.checked) {
        selected = true;
      }
    }
    if(!selected) {
      alert('라운드를 선택해주세요.');
      return;
    }
    // 라운드 저장
    this._round = e.target.round.value;
    this.resetForm();
    // 토너먼트로 넘어가기
    window.location.href = `/favorite/${this._id}/${this._round}`
  }
  cancelForm() {
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