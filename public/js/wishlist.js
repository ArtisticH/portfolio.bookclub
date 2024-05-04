class Wishlist {
  constructor() {
    this.memberId = new URL(location.href).pathname.split('/')[2];
    /* ------------------------------------------------------------------------------------------------ */
    // 1. 오른쪽 마우스 클릭할때 폴더에 대한 메뉴 보여줄건지 아니면
    // 폴더 생성 혹은 정렬에 대한 메뉴 보여줄건지
    this.$wishlistArea = document.querySelector('.wishlist-contents');
    this.$folderMenu = document.getElementById('folder-menu');
    this.$areaMenu = document.getElementById('area-menu');
    this.$wishlistArea.oncontextmenu = this.funContextmenu.bind(this);
    /* ------------------------------------------------------------------------------------------------ */
    // 2. 컨텍스트메뉴를 클릭할때
    // 이벤트 위임
    this.$wishlist = document.getElementById('wishlist');
    this.userId= this.$wishlist.dataset.userId ;
    this.$wishlist.onclick = this.funClick.bind(this);
    /* ------------------------------------------------------------------------------------------------ */
    // 3. 정렬 요소를 hover하면 정렬에 대한 서브 메뉴 보여주기
    this.$sortMenu = document.getElementById('sort-menu');
    this.$sortElem = document.querySelector('[data-menu="sort"]')
    this.$sortElem.onpointerenter = this.fucSort.bind(this);
    /* ------------------------------------------------------------------------------------------------ */
    // 4. 폴더 더블클릭 시 이동
    this.$folders = document.querySelectorAll('.wishlist-folder');
    this.funDblclick = this.funDblclick.bind(this);
    [...this.$folders].forEach(folder => {
      folder.addEventListener('dblclick', this.funDblclick);
    })
    /* ------------------------------------------------------------------------------------------------ */
    // 5. 폴더 생성 창 띄우기
    this.$addFolder = document.getElementById('add-folder');
    // 폴더 추가 창 취소
    this.$cancelFolders = document.querySelectorAll('.cancel');
    this.funCancelForm = this.funCancelForm.bind(this);
    [...this.$cancelFolders].forEach(btn => {
      btn.addEventListener('click', this.funCancelForm);
    })
    // 입력 글자 수 표기
    this.$addTextLength = document.querySelector('.add-folder__length');
    this.$addFolderInput = document.querySelector('.add-folder__input');
    this.$radioPublic = document.getElementById('public');
    this.$radioPrivate = document.getElementById('private');
    this.funCountTextLength = this.funCountTextLength.bind(this);
    this.$addFolderInput.oninput = (e) => {
      this.funCountTextLength(e, this.$addTextLength);
    }
    this.$addForm = document.querySelector('.add-folder__form');
    this.submitAddFolder = this.submitAddFolder.bind(this);
    this.$addForm.addEventListener('submit', this.submitAddFolder);
    // 전체 폴더 수, 만약 가장 처음에 폴더 수를 추가하면 0에서 1로 업그레이드
    // 그리고 0이 아니면 this.$empty없애고 폴더 + done폴더 활성화
    this.totalFolder = this.$wishlist.dataset.totalFolder;
    this.$empty = document.querySelector('.wishlist-empty');
    // 폴더를 생성할 클론
    this.$folderClone = document.querySelector('.wishlist-folder.clone');
    this.$doneFolder = document.querySelector('.wishlist-folder.done');
    /* ------------------------------------------------------------------------------------------------ */
    // 6. 폴더 이름 변경
    this.$currentFolder = null;
    this.$changeName = document.getElementById('change-name');
    this.$changeNameLength = document.querySelector('.change-name__length');
    this.$changeNameInput = document.querySelector('.change-name__input');
    this.$changeNameForm = document.querySelector('.change-name__form');
    this.$changeNameInput.oninput = (e) => {
      this.funCountTextLength(e, this.$changeNameLength);
    }
    this.submitChangeName = this.submitChangeName.bind(this);
    this.$changeNameForm.addEventListener('submit', this.submitChangeName);
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 1. 오른쪽 마우스 클릭할때 폴더에 대한 메뉴 보여줄건지 아니면
  // 폴더 생성 혹은 정렬에 대한 메뉴 보여줄건지
  funContextmenu(e) {
    if(this.userId != this.memberId) {
      alert('권한이 없습니다.');
      return false;
    }
    // 폴더를 클릭한 경우와 폴더 외 영역을 클릭한 경우로 나눈다. 
    const target = e.target;
    const folder = target.closest('.wishlist-folder');
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
  async funClick(e) {
    const target = e.target;
    const type = target.dataset.menu;
    if(type === 'open') {
      this.fucOpen();
    } else if(type === 'name') {
      if(this.$currentFolder.classList[1] == 'done') {
        alert('이 폴더는 폴더명을 변경할 수 없습니다.');
        this.$folderMenu.hidden = true;
        this.$areaMenu.hidden = true;
        return;    
      }
      this.fucChangeName();
    } else if(type === 'delete') {
      if(this.$currentFolder.classList[1] == 'done') {
        alert('이 폴더는 삭제할 수 없습니다.');
        this.$folderMenu.hidden = true;
        this.$areaMenu.hidden = true;
        return;    
      }
      this.fucDeleteFolder();
    } else if(type === 'public') {
      this.fucPublic();
    } else if(type === 'add') {
      this.fucAddFolder();
    } else if(type === 'sort-name') {
      this.fucSortName();
    } else if(type === 'sort-updated') {
      this.fucSortUpdatedAt();
    } else if(type === 'sort-created') {
      this.fucSortCreatedAt();
    } 
    this.$folderMenu.hidden = true;
    this.$areaMenu.hidden = true;
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 3. 정렬 요소를 hover하면 정렬에 대한 서브 메뉴 보여주기
  fucSort(e) {
    this.$sortMenu.hidden = false;
    e.currentTarget.onpointerleave = () => {
      this.$sortMenu.hidden = true;
    }
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 4. 폴더 더블클릭 시 이동
  funDblclick(e) {
    const folder = target.closest('.wishlist-folder');
    this.$currentFolder = folder;
    this.fucOpen();
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 5. 폴더 생성 창 띄우기
  fucAddFolder() {
    this.$addFolder.hidden = false;
  }
  // 폴더 추가 창 취소
  funCancelForm(e) {
    const root = e.target.closest('.root');
    if(root.id === 'add-folder') {
      this.$addFolder.hidden = true;
      this.$addFolderInput.value = '';
      this.$addTextLength.textContent = 0;
      this.$radioPrivate.checked = false;
      this.$radioPublic.checked = true;  
    } else if(root.id === 'change-name') {
      this.$changeName.hidden = true;
      this.$changeNameInput.value = '';
      this.$changeNameLength.textContent = 0;  
    }
  }
  // 입력 글자 수 표기
  funCountTextLength(e, elem) {
    elem.textContent = e.target.value.length;
    if(e.target.value.length > 10) {
      alert('10자 이내로 입력하세요');
      e.target.value = e.target.value.slice(0, 10);
      elem.textContent = e.target.value.length;
    }
  }
  // 폴더 서버에 전송
  async submitAddFolder(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const isPublic = e.target.isPublic.value;
    const res = await axios.post('/wishlist/folder', {
      id: this.memberId,
      title,
      isPublic
    });
    this.totalFolder++;
    this.$addFolder.hidden = true;
    this.$addFolderInput.value = '';
    this.$addTextLength.textContent = 0;
    this.$radioPrivate.checked = false;
    this.$radioPublic.checked = true;  
    const folder = res.data.folder;
    const doneFolder = res.data.doneFolder;
    if(this.totalFolder == 1) {
      // 가장 처음에 폴더를 생성할때
      this.$empty.hidden = true;
      this.$wishlistArea.classList.add('grid');
      this.$doneFolder.hidden = false;
      this.$doneFolder.querySelector('.wishlist-folder__count').textContent = doneFolder.count;
      this.$doneFolder.before(this.folderColne(this.$folderClone.cloneNode(true), folder));
    } else {
      // 이미 넌전스로 나열된 폴더가 1 이상일때
      // 근데 기존의 가장 처음 폴더에서 계속 폴더를 생성할 수도 있고, 
      // 넌적스로 나열된 폴더를 받은 후에 폴더를 계속 생성할 수도 있고,...
      this.$doneFolder.before(this.folderColne(this.$folderClone.cloneNode(true), folder));
    }
  }

  folderColne(c, obj) {
    c.className = `wishlist-folder`;
    c.hidden = false;
    c.dataset.folderId = obj.id;
    c.dataset.public = obj.public;
    c.dataset.createdAt = obj.createdAt;
    c.dataset.updatedAt = obj.updatedAt;
    c.querySelector('.wishlist-folder__count').textContent = obj.count;
    c.querySelector('.wishlist-folder__title').textContent = obj.title;
    return c;
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 6. 폴더 이름 변경
  fucChangeName() {
    this.$changeName.hidden = false;
    // 원래 이름 표기해주기
    const beforeTitle = this.$currentFolder.querySelector('.wishlist-folder__title').textContent;
    console.log(beforeTitle);
    this.$changeName.querySelector('.change-name__input').value = beforeTitle;
    this.$changeName.querySelector('.change-name__length').textContent = beforeTitle.length;
  }
  async submitChangeName(e) {
    e.preventDefault();
    const id = this.$currentFolder.dataset.folderId;
    console.log(this.$currentFolder);
    const title = e.target.name.value;
    console.log(id, title);
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
  async fucDeleteFolder() {
    const answer = confirm('폴더를 삭제하시겠습니까?');
    if(!answer) return;
    const id = this.$currentFolder.dataset.folderId;
    const res = await axios.delete(`/wishlist/${id}`);
    this.$currentFolder.remove();
    this.$currentFolder = null;
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 8. 폴더 정렬 - 이름순
  fucSortName() {
    const $folders = document.querySelectorAll('.wishlist-folder');
    const names = [];
    // [이름, 원래 인덱스]
    [...$folders].forEach((fol, index) => {
      names[names.length] = [
        fol.querySelector('.wishlist-folder__title').textContent,
        index
      ]
    });
    // 이름 오름차순으로
    names.sort((a, b) => a[0] - b[0]);
    const newFolders = [];
    // names[1]이 인덱스임
    names.forEach(name => {
      newFolders[newFolders.length] = [...$folders][name[1]]
    });
    // 원래꺼 삭제
    [...$folders].forEach((fol) => {
      fol.remove();
    });
    // 새로운 배열 삽입
    newFolders.forEach(item => {
      this.$doneFolder.before(item);
    });
  }
  // 8. 폴더 정렬 - 생성일순
  fucSortCreatedAt() {
    const $folders = document.querySelectorAll('.wishlist-folder');
    const createdAt = [];
    [...$folders].forEach((fol, index) => {
      createdAt[createdAt.length] = [
        fol.dataset.createdAt,
        index
      ]
    });
    // 생성날짜 오름차순으로
    createdAt.sort((a, b) => a[0].localeCompare(b[0]));
    const newFolders = [];
    createdAt.forEach(date => {
      newFolders[newFolders.length] = [...$folders][date[1]]
    });
    // 원래꺼 삭제
    [...$folders].forEach((fol) => {
      fol.remove();
    });
    // 새로운 배열 삽입
    newFolders.forEach(item => {
      this.$doneFolder.before(item);
    });
  }
  // 8. 폴더 정렬 - 수정일순
  fucSortUpdatedAt() {
    const $folders = document.querySelectorAll('.wishlist-folder');
    const updatedAt = [];
    [...$folders].forEach((fol, index) => {
      updatedAt[updatedAt.length] = [
        fol.dataset.updatedAt,
        index
      ]
    });
    // 생성날짜 오름차순으로
    createdAt.sort((a, b) => a[0].localeCompare(b[0]));
    const newFolders = [];
    updatedAt.forEach(date => {
      newFolders[newFolders.length] = [...$folders][date[1]]
    });
    // 원래꺼 삭제
    [...$folders].forEach((fol) => {
      fol.remove();
    });
    // 새로운 배열 삽입
    newFolders.forEach(item => {
      this.$doneFolder.before(item);
    });
  }  
  /* ------------------------------------------------------------------------------------------------ */
  // 9. 공개 / 비공개 전환
  async fucPublic() {
    const id = this.$cancelFolders.dataset.folderId;
    const current = this.$cancelFolders.dataset.public === 'true' ? '공개' : '비공개';
    const change = current === '공개' ? '비공개' : '공개';
    const answer = confirm(`현재 ${current}상태입니다./n${change}로 바꾸시겠습니까?`);
    if(!answer) return;
    const isPublic = change === '비공개' ? false : true;
    const res = await axios.patch('/wishlist/public', {
      id,
      isPublic,
    });
    const folder = res.data.folder;
    this.$currentFolder.dataset.public = folder.public;
    this.$currentFolder.dataset.updatedAt = folder.updatedAt;
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 10. 폴더 열기
  fucOpen() {
    const FolderId = this.$currentFolder.dataset.folderId;
    const MemberId = this.memberId;
    const url = `/list/${FolderId}/${MemberId}`;
    this.$currentFolder.href = url;
    window.open(url);
  }
}

new Wishlist();