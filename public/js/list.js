class List {
  constructor() {
    // 1. 다 읽었으면 책갈피 내려오고, 읽음 폴더로 이동
    this.$readBtns = document.querySelectorAll('.list-info-read');
    this.fucRead = this.fucRead.bind(this);
    [...this.$readBtns].forEach(btn => {
      btn.addEventListener('click', this.fucRead);
    });

  }

  // 1. 다 읽었으면 책갈피 내려오고, 읽음 폴더로 이동
  fucRead(e) {
    const list = e.target.closest('.list');
    const readElem = e.currentTarget;
    const bookmark = list.querySelector('.list-bookmark');
    readElem.classList.add('read');
    bookmark.hidden = false;
    bookmark.classList.add('show');

  }

}

new List();