class Search {
  constructor() {
    this.$search = document.getElementById('apisearch');
    this._userId = this.$search.dataset.userId;
    this._subject = this.$search.dataset.subject;
    this.$kwdInput = document.querySelector('.kwd-input');
    this.$select = document.getElementById('targets');
    this.$main = document.querySelector('.results-main');
    // 검색
    this.$searchForm = document.querySelector('.search-box');
    this.$searchForm.onsubmit = this.search.bind(this);
    this.$results = document.getElementById('results');
    this.$clone = document.querySelector('.results-box.clone');
    this.$target = document.querySelector('.results-title-select');
    this.$kwd = document.querySelector('.results-title-kwd');
    // 리절트 취소 버튼
    this.$cancelResults = document.querySelector('.cancel');
    this.$cancelResults.onclick = this.cancelResults.bind(this);
    // 위시리스트 클릭
    this.wishlist = this.wishlist.bind(this);
    this._lists = [];
    this.$label = document.querySelector('.label');
    this.$folders = document.getElementById('folders');
    this.$empty = document.querySelector('.empty-text');
    this.$folderSubmit = this.$folders.querySelector('.submit');
    this.$labelClone = document.querySelector('.label-box.clone');
    this.$cancels = document.querySelectorAll('.cancel-box');
    this.cancel = this.cancel.bind(this);
    [...this.$cancels].forEach(item => {
      item.addEventListener('click', this.cancel);
    });
    this.$add = document.getElementById('add');
    this.$addBtn = document.querySelector('.add-folder');
    this.$addBtn.onclick = this.showAddForm.bind(this);
    this.$formFolder = document.querySelector('.folders-form');
    this.$formFolder.onsubmit = this.addFolder.bind(this);
    this.$formAdd = document.querySelector('.add-form');
    this.$formAdd.onsubmit = this.newFolder.bind(this);
  }
  async search(e) {
    e.preventDefault();
    const target = this.$select.value;
    const kwd = e.target.kwd.value;
    if(kwd.length === 0) {
      alert('검색어를 입력해주세요.');
      return;
    }
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
    c.querySelector('.results-img').src = obj.img;
    c.querySelector('.results-info-title').innerHTML = obj.title;
    c.querySelector('.results-author').innerHTML = obj.author;
    c.querySelector('.results-pub').innerHTML = obj.pub;
    c.querySelector('.results-year').textContent = obj.year;
    c.querySelector('.results-call').textContent = obj.call;
    c.querySelector('.results-place').textContent = obj.place;
    c.querySelector('.results-btn.detail').href = obj.detail;
    c.querySelector('.results-btn.wishlist').onclick = this.wishlist;
    return c;
  }
  cancelResults() {
    this.$results.hidden = true;
    [...this.$main.children].forEach(item => {
      item.remove();
    });
    this.$kwdInput.value = '';
    this.$select.selectedIndex = 0;
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
    this._lists = [];
    this._lists[this._lists.length] = {
      img: target.querySelector('.results-img').src,
      author: target.querySelector('.results-author').textContent,
      title: target.querySelector('.results-info-title').textContent,
    };
    this.cancelResults();
    const res = await axios.get(`/open/folders/${this._userId}`);
    const folders = res.data.folders
    if(folders.length === 0) {
      this.$empty.hidden = false;
      this.$label.hidden = true;
      this.$folderSubmit.hidden = true;
    } else {
      this.$empty.hidden = true;
      this.$label.hidden = false;
      this.$folderSubmit.hidden = false;
      folders.forEach(item => {
        this.$label.append(this.labelDOM(this.$labelClone.cloneNode(true), item));
      });
    }
    this.$folders.hidden = false;
  }
  labelDOM(c, obj) {
    c.className = 'label-box';
    c.hidden = false;
    c.querySelector('.label-title > input').value = obj.id;
    c.querySelector('span').textContent = obj.title;
    c.querySelector('.label-count').textContent = obj.count;
    return c;
  }
  cancel(e) {
    const form = e.target.closest('.root');
    if(form.id === 'add') {
      form.querySelector('.add-input').value = '';
      const radios = document.getElementsByName('isPublic');
      for (const radio of radios) {
        radio.checked = false;
      }
    } else {
      [...this.$label.children].forEach(item => {
        item.remove();
      });      
    }
    form.hidden = true;
  }
  showAddForm() {
    this.$add.hidden = false;
    this.$folders.hidden = true;
    this.$add.querySelector('.add-input').value = '';
    const radios = document.getElementsByName('isPublic');
    for (const radio of radios) {
      if(radio.id === 'public') {
        radio.checked = true;
      } else {
        radio.checked = false;
      }
    }
  }
  async addFolder(e) {
    e.preventDefault();
    const radios = document.getElementsByName('folder');
    let isSelected = false;
    for (const radio of radios) {
      if (radio.checked) {
          isSelected = true;
          break;
      }
    }
    if(!isSelected) {
      alert('이동할 폴더를 선택해 주세요.');
      return;
    }
    const FolderId = e.target.folder.value;
    const res = await axios.post('/open/exist', {
      lists: JSON.stringify(this._lists),
      FolderId,
      MemberId: this._userId,
    });
    [...this.$label.children].forEach(item => {
      item.remove();
    });      
    this.$folders.hidden = true;
    alert('등록이 완료되었습니다!');
  }
  async newFolder(e) {
    e.preventDefault();
    const radios = document.getElementsByName('isPublic');
    let isSelected = false;
    for (const radio of radios) {
      if (radio.checked) {
          isSelected = true;
          break;
      }
    }
    if(!isSelected) {
      alert('공개여부를 선택해주세요.');
      return;
    }
    const title = e.target.title.value;
    const isPublic = e.target.isPublic.value;
    if(title.length === 0) {
      alert('폴더 이름을 입력해주세요.');
      return;
    }
    // 폴더 추가 후 거기에 저장
    await axios.post('/open/add', {
      MemberId: this._userId,
      title,
      isPublic,
      lists: JSON.stringify(this._lists),
    });
    this.$add.hidden = true;
    alert('등록이 완료되었습니다!');
  }
}

new Search();