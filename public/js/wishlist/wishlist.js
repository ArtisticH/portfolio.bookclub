class Wishlist {
  constructor() {
    this._memberId = new URL(location.href).pathname.split('/')[2];
    this.$wishlist = document.getElementById('wishlist');
    this._userId = this.$wishlist.dataset.userId;
    // 오른쪽 마우스 클릭 => 폴더 생성 혹은 정렬에 대한 메뉴 보여줄건지
    this.$area = document.querySelector('.wishlist');
    this.$folderMenu = document.getElementById('folder-menu');
    this.$areaMenu = document.getElementById('area-menu');
    // 폴더에 오른쪽 마우스를 클릭한 경우 그 폴더가 할당된다.
    this.$current = null;
    this.$area.oncontextmenu = this.contextmenu.bind(this);
    // 컨텍스트메뉴를 클릭할때
    this.$wishlist.onclick = this.click.bind(this);
    // 정렬 메뉴 보여주기
    this.$sortMenu = document.getElementById('sort-menu');
    this.$sortElem = document.querySelector('[data-menu="sort"]');
    this.$sortElem.onpointerenter = this.sort.bind(this);
    // 폴더 더블클릭 시 이동
    this.$area.ondblclick = this.dblclick.bind(this);
    // 폴더 생성 창
    this.$add = document.getElementById('add');
    this.$addLength = document.querySelector('.add-length');
    this.$addInput = document.querySelector('.add-input');
    this.$public = document.getElementById('public');
    this.$private = document.getElementById('private');
    this.countText = this.countText.bind(this);
    this._addCheck = false;
    this._nameCheck = false;
    this.$addInput.oninput = (e) => {
      this.countText(e, this.$addLength, 'add');
    }
    this.$addForm = document.querySelector('.add-form');
    this.submitAdd = this.submitAdd.bind(this);
    this.$addForm.addEventListener('submit', this.submitAdd);
    this.$name = document.getElementById('change');
    this.$nameLength = document.querySelector('.change-length');
    this.$nameInput = document.querySelector('.change-input');
    this.$nameInput.oninput = (e) => {
      this.countText(e, this.$nameLength, 'name');
    }
    this.$nameForm = document.querySelector('.change-form');
    this.submitName = this.submitName.bind(this);
    this.$nameForm.addEventListener('submit', this.submitName);
    this.$cancelBtns = document.querySelectorAll('.cancel');
    this.cancel = this.cancel.bind(this);
    [...this.$cancelBtns].forEach(btn => {
      btn.addEventListener('click', this.cancel);
    })
    // 전체 폴더 수, 만약 가장 처음에 폴더 수를 추가하면 0에서 1로 업그레이드
    // 그리고 0에서 1이 되면 this.$empty없애고 "첫번째 폴더 + done폴더" 활성화
    this._totalFolder = this.$wishlist.dataset.totalFolder;
    this._doneCount = this.$wishlist.dataset.doneCount;
    this.$empty = document.querySelector('.empty');
    this.$clone = document.querySelector('.folder.clone');
    this.$done = document.querySelector('.folder.done');
  }
  contextmenu(e) {
    // 폴더를 클릭한 경우와 폴더 외 영역을 클릭한 경우로 나눈다. 
    const folder = e.target.closest('.folder');
    if(folder) {
      // 폴더를 클릭한 경우
      // 폴더 삭제, 폴더 이름 변경, 폴더 열기, 공개/비공개
      this.$current = folder;
      this.$folderMenu.hidden = false;
      this.$areaMenu.hidden = true;
      this.locate(e, this.$folderMenu,);
    } else {
      // 그 외의 영역
      // 폴더 추가, 폴더 정렬 - 이름순, 생성일순
      this.$areaMenu.hidden = false;
      this.$folderMenu.hidden = true;
      this.locate(e, this.$areaMenu);
    } 
    // 기존 브라우저의 컨텍스트 메뉴 안 보이게
    return false;
  }
  locate(e, elem) {
    elem.style.left = e.clientX + 'px';
    elem.style.top = e.clientY + 'px';
  }
  gone() {
    this.$folderMenu.hidden = true;
    this.$areaMenu.hidden = true;
  }
  // 클릭 이벤트
  click(e) {
    const type = e.target.dataset.menu;
    switch(type) {
      case 'open':
        // 비공개라면 내가 아닌 다른 사람에게 금지
        if(this._userId != this._memberId && this.$current.dataset.public === 'true') {
          alert('비공개 폴더입니다.');
          this.gone();
          return;
        }      
        this.open();
        break;
      case 'name':
        if(this.$current.classList[1] == 'done') {
          alert('이 폴더는 폴더명을 변경할 수 없습니다.');
          this.gone();
          return;    
        }
        if(this._userId != this._memberId) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.name();
        break;
      case 'delete':
        if(this.$current.classList[1] == 'done') {
          alert('이 폴더는 삭제할 수 없습니다.');
          this.gone();
          return;    
        }
        if(this._userId != this._memberId) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.delete();
        break;
      case 'public':
        if(this._userId != this._memberId) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.public();
        break;
      case 'add':
        if(this._userId != this._memberId) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.add();
        break;
      case 'sort-name':
        if(this._userId != this._memberId) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.sortName();
        break;
      case 'sort-updated':
        if(this._userId != this._memberId) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.sortUpdatedAt();
        break;
      case 'sort-created':
        if(this._userId != this._memberId) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.sortCreatedAt();
        break;
    }
    this.gone();
  }
  // 정렬 요소 호버
  sort(e) {
    this.$sortMenu.hidden = false;
    e.currentTarget.onpointerleave = () => {
      this.$sortMenu.hidden = true;
    }
  }
  // 폴더 더블클릭 시 이동
  dblclick(e) {
    const folder = e.target.closest('.folder');
    if(!folder) return;
    this.$current = folder;
    this.open();
  }
  // '읽은 것들'폴더와 보통 폴더 구분
  open() {
    const MemberId = this._memberId;
    if(this.$current.classList.contains('done')) {
      const url = `/list/true/null/${MemberId}`;
      window.location.href = url;  
    } else {
      const FolderId = this.$current.dataset.folderId;
      const url = `/list/false/${FolderId}/${MemberId}`;
      window.location.href = url;  
    }
  }  
  /* ------------------------------------------------------------------------------------------------ */
  // 폴더 생성 창 띄우기
  // 14개 이상 못 만들게끔
  add() {
    if(this._totalFolder === 14) {
      alert('폴더는 14개까지만 만들 수 있습니다.');
      return;
    }
    this.$add.hidden = false;
  }
  cancel(e) {
    const root = e.target.closest('.root');
    if(root.id === 'add') {
      this.cancelAdd();
    } else if(root.id === 'change') {
      this.cancelName();
    }
  }
  // 입력 글자 수 표기
  countText(e, elem, type) {
    elem.textContent = e.target.value.length;
    if(e.target.value.length > 15) {
      alert('15자 이내로 입력하세요');
      e.target.value = e.target.value.slice(0, 15);
      elem.textContent = e.target.value.length;
    }
    if(type === 'add' && e.target.value.length > 0) {
      this._addCheck = true;
    } else if(type === 'name' && e.target.value.length > 0) {
      this._nameCheck = true;
    } else if (type === 'add' && e.target.value.length === 0) {
      this._addCheck = false;
    } else if (type === 'name' && e.target.value.length === 0) {
      this._nameCheck = false;
    }
  }
  cancelAdd() {
    this.$add.hidden = true;
    this.$addInput.value = '';
    this.$addLength.textContent = 0;
    this.$private.checked = false;
    this.$public.checked = true;  
  }
  cancelName() {
    this.$name.hidden = true;
    this.$nameInput.value = '';
    this.$nameLength.textContent = 0;  
  }
  // 폴더 서버에 전송
  async submitAdd(e) {
    e.preventDefault();
    if(!this._addCheck) {
      alert('폴더명을 입력하세요');
      return;
    }
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
    if(this._totalFolder == 1) {
      const done = res.data.done;
      // 가장 처음에 폴더를 생성할때
      this.$empty.hidden = true;
      this.$area.classList.add('grid');
      this.$done.hidden = false;
      this.$done.dataset.public = done.public;
      this.$done.querySelector('.folder-count').textContent = done.count;
      this._doneCount = done.count;
      this.$done.before(this.folderDOM(this.$clone.cloneNode(true), folder));
    } else {
      this.$done.before(this.folderDOM(this.$clone.cloneNode(true), folder));
    }
  }
  folderDOM(c, obj) {
    c.className = `folder`;
    c.hidden = false;
    c.dataset.folderId = obj.id;
    c.dataset.public = obj.public;
    c.dataset.createdat = obj.createdAt;
    c.dataset.updatedat = obj.updatedAt;
    c.querySelector('.folder-count').textContent = obj.count;
    c.querySelector('.folder-title').textContent = obj.title;
    c.ondblclick = this.dblclick;
    return c;
  }
  // 폴더 이름 변경
  name() {
    this.$name.hidden = false;
    // 원래 이름 표기해주기
    const oldTitle = this.$current.querySelector('.folder-title').textContent;
    this.$name.querySelector('.change-input').value = oldTitle;
    this.$name.querySelector('.change-length').textContent = oldTitle.length;
    this._nameCheck = true;
  }
  async submitName(e) {
    e.preventDefault();
    if(!this._nameCheck) {
      alert('폴더명을 입력하세요');
      return;
    }
    const id = this.$current.dataset.folderId;
    const title = e.target.title.value;
    const res = await axios.patch('/wishlist/folder', {
      id,
      title,
    });
    this.$name.hidden = true;
    const folder = res.data.folder;
    this.$current.querySelector('.folder-title').textContent = folder.title;
    this.$current.dataset.updatedat = folder.updatedAt;
  }
  // 삭제
  async delete() {
    const answer = confirm('폴더 내 모든 독서 리스트가 삭제됩니다. 그래도 폴더를 삭제하시겠습니까?');
    if(!answer) return;
    const id = this.$current.dataset.folderId;
    await axios.delete(`/wishlist/${id}/${this._memberId}`);
    this._totalFolder--;
    this.$current.remove();
    this.$current = null;
    if(this._totalFolder === 0 && this._doneCount === 0) {
      this.$empty.hidden = false;
      this.$area.classList.remove('grid');
      this.$done.hidden = true;
    }
  }
  // 공개 / 비공개 전환
  async public() {
    const current = this.$current.dataset.public === 'true' ? '공개' : '비공개';
    const change = current === '공개' ? '비공개' : '공개';
    const answer = confirm(`현재 ${current}상태입니다. ${change}상태로 바꾸시겠습니까?`);
    if(!answer) return;
    const isPublic = change === '비공개' ? false : true;
    // done폴더일때와 아닐때 구분
    if(this.$current.classList[1] == 'done') {
      const MemberId = this._memberId;
      const res = await axios.patch('/wishlist/public', {
        id: MemberId,
        public: isPublic,
        done: true,
      }); 
      const done = res.data.done;
      this.$current.dataset.public = done.public;
    } else {
      const id = this.$current.dataset.folderId;
      const res = await axios.patch('/wishlist/public', {
        id,
        public: isPublic,
        done: false,
      });  
      const folder = res.data.folder;
      this.$current.dataset.public = folder.public;
      this.$current.dataset.updatedat = folder.updatedAt;  
    }
  }
  // 폴더 정렬 - 이름순
  async sortName() {
    // done, clone 걸러내기
    let $folders = document.querySelectorAll('.folder');
    $folders = [...$folders].filter(item => item.classList.length === 1);
    const names = [];
    // [이름, 원래 인덱스]
    [...$folders].forEach((item, index) => {
      names[names.length] = [
        item.querySelector('.folder-title').textContent,
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
      updated: false,
    });
  }
  // 생성일 - 오름차순으로
  async sortCreatedAt() {
    let $folders = document.querySelectorAll('.folder');
    $folders = [...$folders].filter(item => item.classList.length === 1);
    const createdAt = [];
    [...$folders].forEach((item, index) => {
      createdAt[createdAt.length] = [
        item.dataset.createdat,
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
      updated: false,
    });
  }
  // 수정일 - 내림차순
  // 수정일은 기존의 것을 활용하는게아니라
  // 기존 것 없애고 새로 서버에서 받은 데이터로 채우기
  async sortUpdatedAt() {
    let $folders = document.querySelectorAll('.folder');
    $folders = [...$folders].filter(item => item.classList.length === 1);
    const res = await axios.post('/wishlist/sort', { 
      sort: 'updatedAt', 
      MemberId: this._memberId,
      order: 'DESC',
      updated: true,
    });
    const folders = res.data.folders;
    [...$folders].forEach((fol) => {
      fol.remove();
    });
    folders.forEach(folder => {
      this.$done.before(this.folderDOM(this.$clone.cloneNode(true), folder));
    });
  }  
}

new Wishlist();