class API {
  constructor() {
    // 페이지네이션
    // this.$pagenation은 first, before, after, last 버튼 담당
    this.$pagenation = document.querySelector('.api-pagenation');
    this.$pagenation.onclick = this.pagenation.bind(this);
    this._currentPage = 1;
    // 직접 페이지 입력
    this.$moveBtn = document.querySelector('.api-page-move');
    this.$current = document.querySelector('.api-page-current');
    this._targetPage = null;
    this.$current.onchange = this.targetPage.bind(this);
    this.$moveBtn.onclick = this.changePage.bind(this);
    this.$clone = document.querySelector('.list-box.clone');
    this.$main = document.querySelector('.api-main');
    this.$api = document.getElementById('api');
    this._userId = this.$api.dataset.userId;
    this._lastPage = +this.$api.dataset.last;
    // 리스트 박스 여러 개 클릭 후 => wishlist에 추가작업
    this.$listBoxes = Array.from(document.querySelectorAll('.list-box'));
    this.clickBox = this.clickBox.bind(this);
    this.$listBoxes.forEach(item => {
      item.addEventListener('click', this.clickBox);
    });
    this.$wishlist = document.querySelector('.api-wishlist');
    this.$wishlist.onclick = this.wishlist.bind(this);
  }
  pagenation(e) {
    const target = e.target.closest('.api-page-btn');
    if(!target) return;
    const type = target.dataset.dir;
    switch(type) {
      case 'first':
        if(this._currentPage === 1) {
          alert('첫 페이지입니다');
          return;
        }
        this._targetPage = 1;
        this.btnChangePage();
        break;
      case 'before':
        if(this._currentPage === 1) {
          alert('첫 페이지입니다');
          return;
        }
        this._targetPage = this._currentPage - 1;
        this.btnChangePage();
        break;
      case 'after':
        if(this._currentPage === this._lastPage) {
          alert('마지막 페이지입니다');
          return;
        }
        this._targetPage = this._currentPage + 1;
        this.btnChangePage();
        break;
      case 'last':
        if(this._currentPage === this._lastPage) {
          alert('마지막 페이지입니다');
          return;
        }
        this._targetPage = this._lastPage;
        this.btnChangePage();
        break;
    }
  }
  // this._targetPage 바꾸자.
  targetPage(e) {
    this._targetPage = e.target.value;
  }
  async changePage() {
    if(this._currentPage == this._targetPage) return;
    const res = await axios.post('/open/nat/rec', {
      page: this._targetPage,
    });
    // 내림차순(최신 => 오래된 순)으로 옴
    const lists = JSON.parse(res.data.lists);
    this._currentPage = this._targetPage;
    // 기존의 12개 삭제
    [...this.$main.children].forEach(item => {
      item.remove();
    })
    // 새로운 열두개 투입
    lists.forEach(list => {
      this.$main.append(this.listDOM(this.$clone.cloneNode(true), list));
    })
  }
  listDOM(c, obj) {
    c.className = 'list-box';
    c.hidden = false;
    c.querySelector('.list-title').textContent = obj.title;
    c.querySelector('.list-author').textContent = obj.author;
    c.querySelector('.list-publisher').textContent = obj.publisher;
    c.querySelector('.list-date').textContent = obj.date;
    c.querySelector('.list-codename').textContent = obj.codeName;
    c.querySelector('.list-img').src = obj.img;
    return c;
  }
  async btnChangePage() {
    const res = await axios.post('/open/nat/rec', {
      page: this._targetPage,
    });
    // 내림차순(최신 => 오래된 순)으로 옴
    const lists = JSON.parse(res.data.lists);
    this._currentPage = this._targetPage;
    // 기존의 12개 삭제
    [...this.$main.children].forEach(item => {
      item.remove();
    })
    // 새로운 열두개 투입
    lists.forEach(list => {
      this.$main.append(this.listDOM(this.$clone.cloneNode(true), list));
    })
    this.$current.value = this._currentPage;
  }
  clickBox(e) {
    const target = e.currentTarget;
    target.classList.toggle('clicked', !target.classList.contains('clicked'));
  }
  wishlist() {
    if(!this._userId) {
      alert('로그인 후 이용 가능합니다');
      return;
    }
    const children = [...this.$main.children];
    const lists = children.filter(item => {
      return item.classList.contains('clicked');
    });
    // 데이터베이스에 반영
  }
}

new API();
