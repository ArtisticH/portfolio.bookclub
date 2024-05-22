class Search {
  constructor() {
    this.$searchForm = document.querySelector('.search-box');
    this.$searchForm.onsubmit = this.search.bind(this);
    this.$searchInput = document.querySelector('.search-input-box__input');
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
    this._subject = this.$search.dataset.subject;
    this._lists = [];
    this.$folders = document.getElementById('folders');
    this.$folderEmpty = document.querySelector('.folders-main-empty');
    this.$folderCancels = document.querySelectorAll('.folders-cancel-box');
    [...this.$folderCancels].forEach(item => {
      item.onclick = this.folderCancel.bind(this);
    });
    this.$addFolders = document.querySelectorAll('.folders-add-folder');
    [...this.$addFolders].forEach(item => {
      item.onclick = this.showAddForm.bind(this);
    });
    this.$folderForm = document.querySelector('.folders-main-form');
    this.$labelClone = document.querySelector('.folders-main-label.clone');
    this.$labelBox = document.querySelector('.label-box');
    this.$add = document.getElementById('add');
    // 새로운 폴더 등록
    this.$add.onsubmit = this.addFolder.bind(this);
    this.$folders.onsubmit = this.existingFolder.bind(this);
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
  async wishlist(e) {
    if(!this._userId) {
      const answer = confirm('로그인 후 이용 가능합니다. 로그인 화면으로 이동할까요?');
      if(answer) {
        window.location.href = '/';
      } else {
        return;
      }
    }
    const target = e.target.closest('.results-box');
    this._lists[this._lists.length] = {
      img: target.querySelector('.results-img').src,
      author: target.querySelector('.results-author').textContent,
      title: target.querySelector('.results-info-title').textContent,
    };
    [...this.$labelBox.children].forEach(item => {
      item.remove();
    })  
    this.$folders.hidden = false;
    const res = await axios.get(`/open/wishlist/${this._userId}`);
    const folders = JSON.parse(res.data.folders);
    if(folders.length === 0) {
      this.$folderEmpty.hidden = false;
      this.$folderForm.hidden = true;
    } else {  
      this.$folderForm.hidden = false;
      this.$folderEmpty.hidden = true;
      folders.forEach(item => {
        this.$labelBox.append(this.labelDOM(this.$labelClone.cloneNode(true), item));
      });
    }
  }
  folderCancel(e) {
    const form = e.target.closest('.root');
    if(form.id === 'add') {
      form.querySelector('.folder-add-form-input').value = '';
      const labels = form.querySelectorAll('label > input');
      [...labels].forEach(item => {
        item.checked = false;
      });
    }
    form.hidden = true;
  }
  showAddForm() {
    this.$add.hidden = false;
    this.$folders.hidden = true;
  }
  labelDOM(c, obj) {
    c.className = 'folders-main-label';
    c.hidden = false;
    c.querySelector('span').textContent = obj.title;
    c.querySelector('.folders-main-count').textContent = obj.count;
    c.querySelector('.folders-main-title > input').value = obj.id;
    return c;
  }
  async addFolder(e) {
    e.preventDefault();
    const title = e.target.folder.value;
    const isPublic = e.target.isPublic.value;
    // 폴더 추가 후 거기에 저장
    const res = await axios.post('/open/folder', {
      MemberId: this._userId,
      title,
      isPublic,
      lists: JSON.stringify(this._lists),
    });
    this.$add.querySelector('.folder-add-form-input').value = '';
    const labels = this.$add.querySelectorAll('label > input');
    [...labels].forEach(item => {
      item.checked = false;
    });
    this.$add.hidden = true;
    alert('등록이 완료되었습니다!');
    this.cancel();
    this.$searchInput.value = '';
    this.$select.selectedIndex = 0;
  }
  async existingFolder(e) {
    e.preventDefault();
    const FolderId = e.target.folder.value;
    const res = await axios.post('/open/exist', {
      lists: JSON.stringify(this._lists),
      FolderId,
      MemberId: this._userId,
    });
    [...this.$labelBox.children].forEach(item => {
      item.remove();
    })  
    this.$folders.hidden = true;
    alert('등록이 완료되었습니다!');
    this.cancel();
    this.$searchInput.value = '';
    this.$select.selectedIndex = 0;
  }
}

new Search();