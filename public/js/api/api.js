class API {
  constructor() {
    this.$api = document.getElementById('api');
    this._userId = this.$api.dataset.userId;
    // 리스트 박스 클릭
    this.$listBoxes = Array.from(document.querySelectorAll('.list-box'));
    this.clickBox = this.clickBox.bind(this);
    this.$listBoxes.forEach(item => {
      item.addEventListener('click', this.clickBox);
    });
    // 페이지네이션
    this._type = this.$api.dataset.type;
    this._current = 1;
    this._lastPage = +this.$api.dataset.last;
    this._target = null;
    this.$main = document.querySelector('.api-main');
    this.$current = document.querySelector('.page-current');
    this.$clone = document.querySelector('.list-box.clone');
    // <<, <, >, >> 클릭 시
    this.$pagenation = document.querySelector('.pagenation');
    this.$pagenation.onclick = this.pagenation.bind(this);
    // 직접 페이지 입력 후 이동 버튼
    // 페이지 입력하면 targetPage가 바뀐다.
    this.$current.oninput = this.targetPage.bind(this);
    this.$moveBtn = document.querySelector('.page-move');
    this.$moveBtn.onclick = this.inputPage.bind(this);
    // 위시리스트 버튼 클릭
    this.$wishlist = document.querySelector('.api-wishlist');
    this.$wishlist.onclick = this.wishlist.bind(this);
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
    this.searchParams = new URL(location.href).searchParams;
    this.alert = this.alert.bind(this);
    this.$clickedLists = null;
    this._lists = [];
    // 기존 폴더에 추가
    this.$folders.onsubmit = this.existingFolder.bind(this);
  }
  clickBox(e) {
    const target = e.currentTarget;
    target.classList.toggle('clicked', !target.classList.contains('clicked'));
  }
  pagenation(e) {
    const target = e.target.closest('.page-btn');
    if(!target) return;
    const type = target.dataset.dir;
    switch(type) {
      case 'first':
        if(this._current === 1) {
          alert('첫 페이지입니다');
          return;
        }
        this._target = 1;
        this.dirPage();
        break;
      case 'before':
        if(this._current === 1) {
          alert('첫 페이지입니다');
          return;
        }
        this._target = this._current - 1;
        this.dirPage();
        break;
      case 'after':
        if(this._current === this._lastPage) {
          alert('마지막 페이지입니다');
          return;
        }
        this._target = this._current + 1;
        this.dirPage();
        break;
      case 'last':
        if(this._current === this._lastPage) {
          alert('마지막 페이지입니다');
          return;
        }
        this._target = this._lastPage;
        this.dirPage();
        break;
    }
  }
  async dirPage() {
    // 해당 페이지 내용을 가져와줘
    const res = await axios.post('/open/list', {
      type: this._type,
      page: this._target,
    });
    // 내림차순(최신 => 오래된 순)으로 옴
    const lists = JSON.parse(res.data.lists);
    this._current = this._target;
    // 기존의 12개 삭제
    [...this.$main.children].forEach(item => {
      item.remove();
    })
    // 새로운 열두개 투입
    lists.forEach(list => {
      this.$main.append(this.listDOM(this.$clone.cloneNode(true), list));
    });
    this.$current.value = this._current;
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
    c.onclick = this.clickBox;
    return c;
  }
  // this._target 바꾸자.
  targetPage(e) {
    // +안하면 문자열로 인식되서 오류
    this._target = +e.target.value;
  }
  async inputPage() {
    if(this._current == this._target) {
      alert('현재 페이지입니다.');
      return;
    }
    const res = await axios.post('/open/list', {
      page: this._target,
      type: this._type,
    });
    const lists = JSON.parse(res.data.lists);
    this._current = this._target;
    // 기존의 12개 삭제
    [...this.$main.children].forEach(item => {
      item.remove();
    })
    // 새로운 열두개 투입
    lists.forEach(list => {
      this.$main.append(this.listDOM(this.$clone.cloneNode(true), list));
    })
  }
  async wishlist() {
    if(!this._userId) {
      alert('로그인 후 이용 가능합니다');
      return;
    }
    const children = [...this.$main.children];
    this.$clickedLists = children.filter(item => {
      return item.classList.contains('clicked');
    });
    if(this.$clickedLists.length == 0) {
      alert('도서를 클릭해주세요.');
      return;
    }
    this.$clickedLists.forEach(item => {
      this._lists[this._lists.length] = {
        title: item.querySelector('.list-title').textContent,
        author: item.querySelector('.list-author').textContent,
        img: item.querySelector('.list-img').src,
      }
    });
    // 데이터베이스에 반영
    // 우선 폴더 목록과 새로운 폴더 생성 폼 보여주기
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
    const children = [...this.$main.children];
    children.forEach(item => {
      if(item.classList.contains('clicked')) {
        item.classList.remove('clicked');
      };
    });
    alert('등록이 완료되었습니다!');
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
    const children = [...this.$main.children];
    children.forEach(item => {
      if(item.classList.contains('clicked')) {
        item.classList.remove('clicked');
      };
    });
    alert('등록이 완료되었습니다!');
  }
  alert() {
    if(this.searchParams.has('login')) {
      switch(this.searchParams.get('login')) {
        case 'need':
          alert('로그인이 필요합니다.');
          break;
      }
    } 
  }
}

const api = new API();
window.addEventListener('load', api.alert);

