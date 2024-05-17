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
    this.$listMain = document.querySelector('.api-main');
    this.$api = document.getElementById('api');
    this._lastPage = +this.$api.dataset.last;
    // 소장자료조회는 open.html과 연결
    this.$searchBox = document.querySelector('.open-box.search');
    this.$searchForm = document.getElementById('search');
    this.$searchBox.onclick = this.search.bind(this);
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
    [...this.$listMain.children].forEach(item => {
      item.remove();
    })
    // 새로운 열두개 투입
    lists.forEach(list => {
      this.$listMain.append(this.listDOM(this.$clone.cloneNode(true), list));
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
    [...this.$listMain.children].forEach(item => {
      item.remove();
    })
    // 새로운 열두개 투입
    lists.forEach(list => {
      this.$listMain.append(this.listDOM(this.$clone.cloneNode(true), list));
    })
    this.$current.value = this._currentPage;
  }
  // 소장자료 조회
  search() {
    this.$searchForm.hidden = false;
  }
}

new API();