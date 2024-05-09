class Favorite {
  constructor() {
    // 1. 버튼 클릭 시 상자 보여주기, 이벤트 위임
    this.$favoritGrid = document.querySelector('.favorite-grid');
    this.$favoritGrid.onclick = this.clickBox.bind(this);
    this.$roundForm = document.getElementById('round-box');
  }
  async clickBox(e) {

  }
}

new Favorite();