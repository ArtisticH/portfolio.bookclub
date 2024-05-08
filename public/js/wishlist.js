class Wishlist {
  constructor() {
    this._memberId = new URL(location.href).pathname.split('/')[2];
    this.$wishlist = document.getElementById('wishlist');
    this._userId = this.$wishlist.dataset.userId ;
    /* ------------------------------------------------------------------------------------------------ */
    // 1. 오른쪽 마우스 클릭할때 폴더에 대한 메뉴 보여줄건지 아니면
    // 폴더 생성 혹은 정렬에 대한 메뉴 보여줄건지
    this.$area = document.querySelector('.wishlist-contents');
    this.$folderMenu = document.getElementById('folder-menu');
    this.$areaMenu = document.getElementById('area-menu');
    this.$area.oncontextmenu = this.contextmenu.bind(this);
    /* ------------------------------------------------------------------------------------------------ */
    // 2. 컨텍스트메뉴를 클릭할때
    // 이벤트 위임
    this.$wishlist.onclick = this.click.bind(this);
    /* ------------------------------------------------------------------------------------------------ */
    // 3. 정렬 요소를 hover하면 정렬에 대한 서브 메뉴 보여주기
    this.$sortMenu = document.getElementById('sort-menu');
    this.$sortElem = document.querySelector('[data-menu="sort"]')
    this.$sortElem.onpointerenter = this.sort.bind(this);
    /* ------------------------------------------------------------------------------------------------ */
    // 4. 폴더 더블클릭 시 이동
    this.$folders = document.querySelectorAll('.wishlist-folder');
    this.dblclick = this.dblclick.bind(this);
    [...this.$folders].forEach(folder => {
      folder.addEventListener('dblclick', this.dblclick);
    })
    /* ------------------------------------------------------------------------------------------------ */
    // 5. 폴더 생성 창 띄우기
    this.$addFolder = document.getElementById('add-folder');
    // 폴더 추가 창 취소
    this.$cancelBtns = document.querySelectorAll('.cancel');
    this.cancelForm = this.cancelForm.bind(this);
    [...this.$cancelBtns].forEach(btn => {
      btn.addEventListener('click', this.cancelForm);
    })
    // 입력 글자 수 표기
    this.$addText = document.querySelector('.add-folder__length');
    this.$addInput = document.querySelector('.add-folder__input');
    this.$public = document.getElementById('public');
    this.$private = document.getElementById('private');
    this.countText = this.countText.bind(this);
    this.$addInput.oninput = (e) => {
      this.countText(e, this.$addText);
    }
    this.$addForm = document.querySelector('.add-folder__form');
    this.submitAdd = this.submitAdd.bind(this);
    this.$addForm.addEventListener('submit', this.submitAdd);
    // 전체 폴더 수, 만약 가장 처음에 폴더 수를 추가하면 0에서 1로 업그레이드
    // 그리고 0에서 1이 되면 this.$empty없애고 폴더 + done폴더 활성화
    this._totalFolder = this.$wishlist.dataset.totalFolder;
    this.$empty = document.querySelector('.wishlist-empty');
    // 폴더를 생성할 클론
    this.$clone = document.querySelector('.wishlist-folder.clone');
    this.$done = document.querySelector('.wishlist-folder.done');
    /* ------------------------------------------------------------------------------------------------ */
    // 6. 폴더 이름 변경
    this.$currentFolder = null;
    this.$changeName = document.getElementById('change-name');
    this.$nameText = document.querySelector('.change-name__length');
    this.$nameInput = document.querySelector('.change-name__input');
    this.$nameForm = document.querySelector('.change-name__form');
    this.$nameInput.oninput = (e) => {
      this.countText(e, this.$nameText);
    }
    this.submitName = this.submitName.bind(this);
    this.$nameForm.addEventListener('submit', this.submitName);
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 1. 오른쪽 마우스 클릭할때 폴더에 대한 메뉴 보여줄건지 아니면
  // 폴더 생성 혹은 정렬에 대한 메뉴 보여줄건지
  contextmenu(e) {
    // 폴더를 클릭한 경우와 폴더 외 영역을 클릭한 경우로 나눈다. 
    const folder = e.target.closest('.wishlist-folder');
    if(folder) {
      // 폴더를 클릭한 경우
      // 폴더 삭제, 폴더 이름 변경, 폴더 열기
      this.$currentFolder = folder;
      this.$folderMenu.hidden = false;
      this.$areaMenu.hidden = true;
      this.$folderMenu.style.left = e.clientX + 'px';
      this.$folderMenu.style.top = e.clientY + 'px';
    } else {
      // 그 외의 영역
      // 폴더 추가, 폴더 정렬 - 이름순, 생성일순
      this.$areaMenu.hidden = false;
      this.$folderMenu.hidden = true;
      this.$areaMenu.style.left = e.clientX + 'px';
      this.$areaMenu.style.top = e.clientY + 'px';
    } 
    // 기존 브라우저의 컨텍스트 메뉴 안 보이게
    return false;
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 2. 컨텍스트메뉴를 클릭할때
  async click(e) {
    const type = e.target.dataset.menu;
    if(type === 'open') {
      this.open();
    } else if(type === 'name') {
      if(this.$currentFolder.classList[1] == 'done') {
        alert('이 폴더는 폴더명을 변경할 수 없습니다.');
        this.$folderMenu.hidden = true;
        this.$areaMenu.hidden = true;
        return;    
      }
      if(this._userId != this._memberId) {
        alert('권한이 없습니다.');
        return;
      }  
      this.changeName();
    } else if(type === 'delete') {
      if(this.$currentFolder.classList[1] == 'done') {
        alert('이 폴더는 삭제할 수 없습니다.');
        this.$folderMenu.hidden = true;
        this.$areaMenu.hidden = true;
        return;    
      }
      if(this._userId != this._memberId) {
        alert('권한이 없습니다.');
        return;
      }  
      this.delete();
    } else if(type === 'public') {
      if(this._userId != this._memberId) {
        alert('권한이 없습니다.');
        return;
      }  
      this.public();
    } else if(type === 'add') {
      if(this._userId != this._memberId) {
        alert('권한이 없습니다.');
        return;
      }  
      this.add();
    } else if(type === 'sort-name') {
      if(this._userId != this._memberId) {
        alert('권한이 없습니다.');
        return;
      }  
      this.sortName();
    } else if(type === 'sort-updated') {
      if(this._userId != this._memberId) {
        alert('권한이 없습니다.');
        return;
      }  
      this.sortUpdatedAt();
    } else if(type === 'sort-created') {
      if(this._userId != this._memberId) {
        alert('권한이 없습니다.');
        return;
      }  
      this.sortCreatedAt();
    } 
    this.$folderMenu.hidden = true;
    this.$areaMenu.hidden = true;
  }

  /* ------------------------------------------------------------------------------------------------ */
  // 3. 정렬 요소를 hover하면 정렬에 대한 서브 메뉴 보여주기
  sort(e) {
    this.$sortMenu.hidden = false;
    e.currentTarget.onpointerleave = () => {
      this.$sortMenu.hidden = true;
    }
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 4. 폴더 더블클릭 시 이동
  dblclick(e) {
    const folder = target.closest('.wishlist-folder');
    this.$currentFolder = folder;
    this.open();
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 5. 폴더 생성 창 띄우기
  add() {
    this.$addFolder.hidden = false;
  }
  // 폴더 추가 창 취소
  // 폴더 이름 변경 취소
  cancelForm(e) {
    const root = e.target.closest('.root');
    if(root.id === 'add-folder') {
      this.cancelAdd();
    } else if(root.id === 'change-name') {
      this.cancelName();
    }
  }
  cancelAdd() {
    this.$addFolder.hidden = true;
    this.$addInput.value = '';
    this.$addText.textContent = 0;
    this.$private.checked = false;
    this.$public.checked = true;  
  }

  cancelName() {
    this.$changeName.hidden = true;
    this.$nameInput.value = '';
    this.$nameText.textContent = 0;  
  }
  // 입력 글자 수 표기
  countText(e, elem) {
    elem.textContent = e.target.value.length;
    if(e.target.value.length > 10) {
      alert('10자 이내로 입력하세요');
      e.target.value = e.target.value.slice(0, 10);
      elem.textContent = e.target.value.length;
    }
  }
  // 폴더 서버에 전송
  async submitAdd(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const isPublic = e.target.isPublic.value;
    const res = await axios.post('/wishlist/folder', {
      id: this._memberId,
      title,
      isPublic
    });
    this._totalFolder++;
    this.cancelAdd();
    const folder = res.data.folder;
    const done = res.data.done;
    if(this._totalFolder == 1) {
      // 가장 처음에 폴더를 생성할때
      this.$empty.hidden = true;
      this.$area.classList.add('grid');
      this.$done.hidden = false;
      this.$done.dataset.public = done.public;
      this.$done.querySelector('.wishlist-folder__count').textContent = done.count;
      this.$done.before(this.folderDOM(this.$clone.cloneNode(true), folder));
    } else {
      this.$done.before(this.folderDOM(this.$clone.cloneNode(true), folder));
    }
  }

  folderDOM(c, obj) {
    c.className = `wishlist-folder`;
    c.hidden = false;
    c.dataset.folderId = obj.id;
    c.dataset.public = obj.public;
    c.dataset.createdat = obj.createdAt;
    c.dataset.updatedat = obj.updatedAt;
    c.querySelector('.wishlist-folder__count').textContent = obj.count;
    c.querySelector('.wishlist-folder__title').textContent = obj.title;
    c.ondblclick = this.dblclick;
    return c;
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 6. 폴더 이름 변경
  changeName() {
    this.$changeName.hidden = false;
    // 원래 이름 표기해주기
    const oldTitle = this.$currentFolder.querySelector('.wishlist-folder__title').textContent;
    this.$changeName.querySelector('.change-name__input').value = oldTitle;
    this.$changeName.querySelector('.change-name__length').textContent = oldTitle.length;
  }
  async submitName(e) {
    e.preventDefault();
    const id = this.$currentFolder.dataset.folderId;
    const title = e.target.name.value;
    const res = await axios.patch('/wishlist/folder', {
      id,
      title,
    });
    const folder = res.data.folder;
    this.$currentFolder.querySelector('.wishlist-folder__title').textContent = folder.title;
    this.$currentFolder.dataset.updatedAt = folder.updatedAt;
    this.$changeName.hidden = true;
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 7. 폴더 삭제
  async delete() {
    const answer = confirm('폴더를 삭제하시겠습니까?');
    if(!answer) return;
    const id = this.$currentFolder.dataset.folderId;
    await axios.delete(`/wishlist/${id}`);
    this.$currentFolder.remove();
    this.$currentFolder = null;
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 8. 폴더 정렬 - 이름순
  async sortName() {
    // done, clone 걸러내기
    let $folders = document.querySelectorAll('.wishlist-folder');
    $folders = [...$folders].filter(item => item.classList.length === 1);
    const names = [];
    // [이름, 원래 인덱스]
    [...$folders].forEach((fol, index) => {
      names[names.length] = [
        fol.querySelector('.wishlist-folder__title').textContent,
        index
      ]
    });
    // 이름 오름차순으로
    names.sort();
    const newFolders = [];
    names.forEach(name => {
      newFolders[newFolders.length] = [...$folders][name[1]]
    });
    // 원래꺼 삭제
    [...$folders].forEach((fol) => {
      fol.remove();
    });
    // 새로운 배열 삽입
    newFolders.forEach(item => {
      this.$done.before(item);
    });
    await axios.post('/wishlist/sort', { 
      sort: 'title', 
      MemberId: this._memberId,
      order: 'ASC',
    });
  }
  // 8. 폴더 정렬 - 생성일순
  // 오름차순으로
  async sortCreatedAt() {
    let $folders = document.querySelectorAll('.wishlist-folder');
    $folders = [...$folders].filter(item => item.classList.length === 1);
    const createdAt = [];
    [...$folders].forEach((fol, index) => {
      createdAt[createdAt.length] = [
        fol.dataset.createdat,
        index
      ]
    });
    // 오름차순
    function compareDates(date1, date2) {
      // Date 객체로 변환
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      // getTime() 메서드를 사용하여 날짜를 밀리초 단위의 숫자로 변환한 후 비교
      if (d1.getTime() < d2.getTime()) {
        return -1;
      } else if (d1.getTime() > d2.getTime()) {
        return 1;
      } else {
        return 0;
      }
    }
    createdAt.sort(compareDates);
    const newFolders = [];
    createdAt.forEach(date => {
      newFolders[newFolders.length] = [...$folders][date[1]];
    });
    [...$folders].forEach((fol) => {
      fol.remove();
    });
    newFolders.forEach(item => {
      this.$done.before(item);
    });
    await axios.post('/wishlist/sort', { 
      sort: 'createdAt', 
      MemberId: this._memberId,
      order: 'ASC',
    });
  }
  // 8. 폴더 정렬 - 수정일순
  async sortUpdatedAt() {
    let $folders = document.querySelectorAll('.wishlist-folder');
    $folders = [...$folders].filter(item => item.classList.length === 1);
    const updatedAt = [];
    [...$folders].forEach((fol, index) => {
      updatedAt[updatedAt.length] = [
        fol.dataset.updatedat,
        index
      ]
    });
    // 내림차순
    function compareDates(date1, date2) {
      // Date 객체로 변환
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      // getTime() 메서드를 사용하여 날짜를 밀리초 단위의 숫자로 변환한 후 비교
      if (d1.getTime() < d2.getTime()) {
        return 1;
      } else if (d1.getTime() > d2.getTime()) {
        return -1;
      } else {
        return 0;
      }
    }
    updatedAt.sort(compareDates);
    const newFolders = [];
    updatedAt.forEach(date => {
      newFolders[newFolders.length] = [...$folders][date[1]];
    });
    // 원래꺼 삭제
    [...$folders].forEach((fol) => {
      fol.remove();
    });
    // 새로운 배열 삽입
    newFolders.forEach(item => {
      console.log(item);
      this.$done.before(item);
    });
    await axios.post('/wishlist/sort', { 
      sort: 'updatedAt', 
      MemberId: this._memberId,
      order: 'DESC',
    });
  }  
  /* ------------------------------------------------------------------------------------------------ */
  // 9. 공개 / 비공개 전환
  async public() {
    const current = this.$currentFolder.dataset.public === 'true' ? '공개' : '비공개';
    const change = current === '공개' ? '비공개' : '공개';
    const answer = confirm(`현재 ${current}상태입니다. ${change}상태로 바꾸시겠습니까?`);
    if(!answer) return;
    const isPublic = change === '비공개' ? false : true;
    // done폴더일때와 아닐때 구분
    if(this.$currentFolder.classList[1] == 'done') {
      const MemberId = this._memberId;
      const res = await axios.patch('/wishlist/public', {
        id: MemberId,
        public: isPublic,
        done: true,
      }); 
      const done = res.data.done;
      this.$currentFolder.dataset.public = done.public;
    } else {
      const id = this.$currentFolder.dataset.folderId;
      const res = await axios.patch('/wishlist/public', {
        id,
        public: isPublic,
        done: false,
      });  
      const folder = res.data.folder;
      this.$currentFolder.dataset.public = folder.public;
      this.$currentFolder.dataset.updatedAt = folder.updatedAt;  
    }
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 10. 폴더 열기
  open() {
    const FolderId = this.$currentFolder.dataset.folderId;
    const MemberId = this._memberId;
    const url = `/list/${FolderId}/${MemberId}`;
    this.$currentFolder.href = url;
    window.open(url);
  }
}

new Wishlist();