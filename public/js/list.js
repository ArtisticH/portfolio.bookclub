class List {
  constructor() {
    // 1. 박스 클릭 시 색깔 변화
    this.$listBoxes = document.querySelectorAll('.list-box');
    this.fucBoxClick = this.fucBoxClick.bind(this);
    [...this.$listBoxes].forEach(box => {
      box.addEventListener('click', this.fucBoxClick);
    });
  }
  // 1. 박스 클릭 시 색깔 변화
  fucBoxClick(e) {
    const target = e.currentTarget;
    const imgBox = target.querySelector('.list-img-box');
    imgBox.classList.toggle('clicked', !imgBox.classList.contains('clicked'));
  }

}

new List();