class Search {
  constructor() {
    this.$searchForm = document.querySelector('.search-box');
    this.$searchForm.onsubmit = this.search.bind(this);
    this.$select = document.getElementById('targets');
    this.$results = document.getElementById('results');
    this.$clone = document.querySelector('.results-box.clone');
    this.$main = document.querySelector('.results-main');
    this.$target = document.querySelector('.results-title-target');
    this.$kwd = document.querySelector('.results-title-kwd');
    this.$cancel = document.querySelector('.results-cancel-box');
    this.$cancel.onclick = this.cancel.bind(this);
    this.wishlist = this.wishlist.bind(this);
    this.$search = document.getElementById('apisearch');
    this._userId = this.$search.dataset.userId;
  }
  async search(e) {
    e.preventDefault();
    const target = this.$select.value;
    const kwd = e.target.kwd.value;
    const res = await axios.post('/open/search', {
      target,
      kwd,
    });
    const lists = res.data.lists;
    lists.forEach(item => {
      this.$main.append(this.cloneDOM(this.$clone.cloneNode(true), item));
    });
    this.$target.textContent = target;
    this.$kwd.textContent = kwd;
    this.$results.hidden = false;
  }
  cloneDOM(c, obj) {
    c.className = 'results-box';
    c.hidden = false;
    c.querySelector('.results-img').src = !obj.img ? '/img/open/book-default.png' : obj.img;
    c.querySelector('.results-info-title').innerHTML = obj.title;
    c.querySelector('.results-author').innerHTML = obj.author;
    c.querySelector('.results-pub').innerHTML = obj.pub;
    c.querySelector('.results-year').textContent = obj.year;
    c.querySelector('.results-call').textContent = obj.call;
    c.querySelector('.results-place').textContent = obj.place;
    c.querySelector('a.results-btn').href = obj.detail;
    c.querySelector('a.results-btn').target = '_blank';
    c.querySelector('.results-btn.wishlist').onclick = this.wishlist;
    return c;
  }
  cancel() {
    this.$results.hidden = true;
    [...this.$main.children].forEach(item => {
      item.remove();
    })
  }
  wishlist() {
    if(!this._userId) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
  }
}

new Search();