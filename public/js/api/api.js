class API {
  constructor() {
    this.$api = document.getElementById('api');
    // 위시리스트 버튼 클릭 막는 용도
    // 위시리스트에 추가할때 유저아이디 필요
    this._userId = this.$api.dataset.userId;
    // 페이지네이션 페이커, 도서관, 알라딘을 구분하는 용도
    this._type = this.$api.dataset.type;
    // 서버에서 권수가 정해진 채로 오기 때문에, 
    // 그리고 내가 추가하거나 삭제하는 작업이 없이 때문에 마지막 페이지는 고정된다.
    this._lastPage = +this.$api.dataset.last;
    // 리스트 박스 클릭
    this.$listBoxes = document.querySelectorAll('.list-box');
    this.clickBox = this.clickBox.bind(this);
    // 초록색으로 변하는 효과
    [...this.$listBoxes].forEach(item => {
      item.addEventListener('click', this.clickBox);
    });
    // 현재 페이지
    this._current = 1;
    // 원하는 페이지
    this._target = null;
    this.$pagenation = document.querySelector('.pagenation');
    // <, <<, >, >> 버튼 클릭 시 페이지 변경
    this.$pagenation.onclick = this.pagenation.bind(this);
    this.$current = document.querySelector('.page-current');
    // 원하는 페이지 변경
    this.$current.oninput = this.targetPage.bind(this);
    // 이동 버튼 클릭 시 페이지 변경
    this.$moveBtn = document.querySelector('.page-move');
    this.$moveBtn.onclick = this.movePage.bind(this);
    // 페이지네이션에서 리스트 박스들을 담는 요소
    this.$main = document.querySelector('.api-main');
    // 페이지네이션할때 필요한 리스트 박스 클론
    this.$clone = document.querySelector('.list-box.clone');
    // 폼들의 취소 버튼
    this.$cancel = document.querySelectorAll('.cancel');
    this.$folders = document.getElementById('folders');
    this.$add = document.getElementById('add');
    // 폼들을 취소하고 그 안의 내용 다시 리셋
    [...this.$cancel].forEach(item => {
      item.onclick = this.cancel.bind(this);
    });
    // 위시리스트 버튼 클릭하면
    // 선택된 애들을 따로 저장하고
    // 폴더 선택지 보여준다.
    this.$wishlist = document.querySelector('.api-wishlist');
    this.$wishlist.onclick = this.wishlist.bind(this);
    this.$empty = document.querySelector('.empty-text');
    // 폴더 선택지 담는 요소
    this.$label = document.querySelector('.label');
    this.$formFolder = document.querySelector('.folders-form');
    this.$folderSubmit = this.$formFolder.querySelector('.submit');
    // 폴더 선택지 클론
    this.$labelClone = document.querySelector('.label-box.clone');
    // 폴더를 선택하거나 추가할때 서버에 보낼
    // 내가 선택한 리스트 박스들의 내용을 가공해 담은 배열
    this._lists = [];
    // 새롭게 폴더 추가 누르면 폴더 선택 폼 사라지고 폴더 추가 폼 등장
    this.$addBtn = document.querySelector('.add-folder');
    this.$addBtn.onclick = this.showAddForm.bind(this);
    this.$formAdd = document.querySelector('.add-form');
    // 기존 폴더에 추가
    this.$formFolder.onsubmit = this.addFolder.bind(this);
    // 새로운 폴더에 추가
    this.$formAdd.onsubmit = this.newFolder.bind(this);
  }
  // 로그인한 경우를 판별할때
  // 특히 위시리스트 버튼을 클릭할때 로그인 안 한 경우 허용하지 않는다. 
  checkMe() {
    return this._userId;
  }
  // 클릭하면 초록색 배경화면 효과
  clickBox(e) {
    const target = e.currentTarget;
    target.classList.toggle('clicked', !target.classList.contains('clicked'));
  }
  clickedBoxes() {
    return [...this.$listBoxes].filter(box => box.classList.contains('clicked'));
  }
  targetPage(e) {
    this._target = +e.target.value;
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
        this.movePage();
        break;
      case 'before':
        if(this._current === 1) {
          alert('첫 페이지입니다');
          return;
        }
        this._target = this._current - 1;
        this.movePage();
        break;
      case 'after':
        if(this._current === this._lastPage) {
          alert('마지막 페이지입니다');
          return;
        }
        this._target = this._current + 1;
        this.movePage();
        break;
      case 'last':
        if(this._current === this._lastPage) {
          alert('마지막 페이지입니다');
          return;
        }
        this._target = this._lastPage;
        this.movePage();
        break;
    }
  }
  pageArrange(lists) {
    this._current = this._target;
    this.$current.value = this._current;
    // 원래 있던 애들 다 지우고
    [...this.$main.children].forEach(item => {
      item.remove();
    });
    // 서버에서 받은 애들로 채우자
    lists.forEach(list => {
      this.$main.append(this.listDOM(this.$clone.cloneNode(true), list));
    });
    // 새롭게 만들어진 박스들을 기억해
    this.$listBoxes = document.querySelectorAll('.list-box');
  }
  async movePage() {
    // 직접 페이지를 입력해서 움직일때 현재 페이지를 입력한 경우
    if(this._current === this._target) {
      alert('현재 페이지입니다.');
      return;
    }
    const res = await axios.post('/open/list', {
      type: this._type,
      page: this._target,
    });
    const lists = JSON.parse(res.data.lists);
    this.pageArrange(lists);
  }
  // 페이지네이션할때 새로 채울 아이들
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
  cancel(e) {
    const form = e.target.closest('.root');
    if(form.id === 'add') {
      this.resetAdd();
    } else {
      this.resetFolder();
    }
    this.resetClicked(); 
  }
  // 폴더 추가 폼 초기화
  resetAdd() {
    this.$add.querySelector('.add-input').value = '';
    const radios = document.getElementsByName('isPublic');
    for (const radio of radios) {
      radio.checked = false;
    }
    this.$add.hidden = true;
  }
  // 책 클릭해서 초록색으로 만든것들 다 초기화
  resetClicked() {
    for(let item of this.clickedBoxes()) {
      item.classList.remove('clicked');
    }
  }
  // 폴더 선택 폼 초기화
  resetFolder() {
    const radios = document.getElementsByName('folder');
    for (const radio of radios) {
      radio.checked = false;
    }
    // 전시한 폴더 내용 다 삭제
    [...this.$label.children].forEach(item => {
      item.remove();
    });    
    this.$folders.hidden = true;
  }
  // 전에 만든 폴더가 없는 경우 
  // 먼저 폴더를 추가하라는 텍스트 전시
  zeroFolder() {
    this.$empty.hidden = false;
    this.$label.hidden = true;
    this.$folderSubmit.hidden = true;
  }
  // 이미 만든 폴더가 한 개 이상인 경우
  // 버튼과 함께 선택지 제시
  notZeroFolder() {
    this.$empty.hidden = true;
    this.$label.hidden = false;
    this.$folderSubmit.hidden = false;
  }
  // 폴더 내용을 담는 
  labelDOM(c, obj) {
    c.className = 'label-box';
    c.hidden = false;
    c.querySelector('.label-title > input').value = obj.id;
    c.querySelector('span').textContent = obj.title;
    c.querySelector('.label-count').textContent = `${obj.count}개`;
    return c;
  }
  async wishlist() {
    // 로그인 안 했으면 이용 불가
    if(!this.checkMe()) {
      alert('권한이 없습니다.');
      return;
    }
    // 클릭 된 애들만 골라
    const targets = this.clickedBoxes();
    if(targets.length == 0) {
      alert('도서를 클릭해주세요.');
      return;
    }
    // 위시리스트 클릭했을때 클릭한 친구들의 이미지, 타이틀, 저자 정보 저장
    this._lists = targets.map(item => {
      return {
        title: item.querySelector('.list-title').textContent,
        author: item.querySelector('.list-author').textContent,
        img: item.querySelector('.list-img').src,
      }
    });
    // 이 유저가 만든 폴더 목록들 가져오기
    const res = await axios.get(`/open/folders/${this._userId}`);
    const folders = res.data.folders;
    if(folders.length === 0) {
      this.zeroFolder();
    } else {
      this.notZeroFolder();
      // 폴더 선택지들 채우기
      folders.forEach(item => {
        this.$label.append(this.labelDOM(this.$labelClone.cloneNode(true), item));
      });
    }
    // 폴더 선택 폼 보여주기
    this.$folders.hidden = false;
  }
  // 기존 선택지에서 폴더를 선택한다면
  async addFolder(e) {
    e.preventDefault();
    // 아무것도 선택하지 않고 등록 버튼을 누르는 것을 방지
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
    // 선택한 폴더의 아이디
    const FolderId = e.target.folder.value;
    // 이 유저가 만든 특정 폴더에 리스트들을 추가한다. 
    await axios.post('/open/exist', {
      // 아까 위시리스트 버튼 클릭할때 선택된 아이들 정보들
      lists: JSON.stringify(this._lists),
      FolderId,
      MemberId: this._userId,
    });
    // 폴더 선택 폼 사라지고
    this.resetFolder();
    // 초록색으로 선택된 아이들 다시 원래대로 되돌려놓기
    this.resetClicked();
    alert('등록이 완료되었습니다!');
  }
  // 폴더 추가 버튼 클릭 시 폴더 선택 폼 사라진다.
  showAddForm() {
    this.resetFolder();
    this.$add.hidden = false;
  }    
  // 새롭게 폴더를 추가한다면
  async newFolder(e) {
    e.preventDefault();
    // 공개 / 비공개 여부 선택해야 하고
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
    // 폴더 이름도 꼭 입력해야 한다. 
    if(title.length === 0) {
      alert('폴더 이름을 입력해주세요.');
      return;
    }
    // 이 유저의 새로운 폴더를 추가하고, 거기에 리스트들을 저장할것
    await axios.post('/open/add', {
      MemberId: this._userId,
      title,
      isPublic,
      lists: JSON.stringify(this._lists),
    });
    this.resetAdd();
    this.resetClicked();
    alert('등록이 완료되었습니다!');
  }
}
new API();

