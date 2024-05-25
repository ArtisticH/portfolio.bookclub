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
    this.$cancel = document.querySelectorAll('.cancel');
    // 폼 취소
    [...this.$cancel].forEach(item => {
      item.onclick = this.cancel.bind(this);
    });
    // 위시리스트 버튼 클릭
    this.$wishlist = document.querySelector('.api-wishlist');
    this.$wishlist.onclick = this.wishlist.bind(this);
    this.$clicked = null;
    this.$folders = document.getElementById('folders');
    this.$add = document.getElementById('add');
    this.$addBtn = document.querySelector('.add-folder');
    this.$addBtn.onclick = this.showAddForm.bind(this);
    this.$empty = document.querySelector('.empty-text');
    this.$label = document.querySelector('.label');
    this.$labelClone = document.querySelector('.label-box.clone');
    this.$formFolder = document.querySelector('.folders-form');
    this.$formAdd = document.querySelector('.add-form');
    this.$folderSubmit = this.$formFolder.querySelector('.submit');
    this._lists = [];
    // 기존 폴더에 추가
    this.$formFolder.onsubmit = this.addFolder.bind(this);
    // 새로운 폴더에 추가
    this.$formAdd.onsubmit = this.newFolder.bind(this);
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
  cancel(e) {
    const form = e.target.closest('.root');
    if(form.id === 'add') {
      form.querySelector('.add-input').value = '';
      const radios = document.getElementsByName('isPublic');
      for (const radio of radios) {
        radio.checked = false;
      }
    }
    form.hidden = true;
  }
  async wishlist() {
    if(!this._userId) {
      alert('로그인 후 이용 가능합니다');
      return;
    }
    // 클릭 된 애들만 골라
    this.$clicked = [...this.$main.children].filter(item => {
      return item.classList.contains('clicked');
    });
    if(this.$clicked.length == 0) {
      alert('도서를 클릭해주세요.');
      return;
    }
    this._lists = [];
    this.$clicked.forEach(item => {
      this._lists[this._lists.length] = {
        title: item.querySelector('.list-title').textContent,
        author: item.querySelector('.list-author').textContent,
        img: item.querySelector('.list-img').src,
      }
    });
    // 우선 폴더 목록과 새로운 폴더 생성 폼 보여주기
    // 폴더 목록 가져오기
    const res = await axios.get(`/open/folders/${this._userId}`);
    const folders = res.data.folders;
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
    c.querySelector('.label-count').textContent = `${obj.count}개`;
    return c;
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
    this.$folders.hidden = true;
    [...this.$label.children].forEach(item => {
      item.remove();
    });    
    [...this.$clicked].forEach(item => {
      item.classList.remove('clicked');
    });
    this.$clicked = null;
    alert('등록이 완료되었습니다!');
  }
  // 폴더 선택 폼 사라지고 폴더 추가 후 등록 폼 등장
  showAddForm() {
    this.$folders.hidden = true;
    this.$add.hidden = false;
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
    [...this.$clicked].forEach(item => {
      item.classList.remove('clicked');
    });
    this.$clicked = null;
    alert('등록이 완료되었습니다!');
  }
}
new API();

