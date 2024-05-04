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
    this.$cancelFolder = document.querySelector('.add-folder__cancel');
    this.$cancelFolder.onclick = this.funCancelAdd.bind(this);
    // 입력 글자 수 표기
    this.$addTextLength = document.querySelector('.add-folder__length');
    this.$addFolderInput = document.querySelector('.add-folder__input');
    this.$addFolderInput.oninput = this.funCountTextLength.bind(this);
    this.$addForm = document.querySelector('.add-folder__form');
    this.submitAddFolder = this.submitAddFolder.bind(this);
    this.$addForm.addEventListener('submit', this.submitAddFolder);
    // 전체 폴더 수, 만약 가장 처음에 폴더 수를 추가하면 0에서 1로 업그레이드
    // 그리고 0이 아니면 this.$empty없애고 폴더 + done폴더 활성화
    this.totalFolder = this.$wishlistArea.dataset.totalFolder;
    this.$empty = document.querySelector('.wishlist-empty');
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 1. 오른쪽 마우스 클릭할때 폴더에 대한 메뉴 보여줄건지 아니면
  // 폴더 생성 혹은 정렬에 대한 메뉴 보여줄건지
  funContextmenu(e) {
    // 폴더를 클릭한 경우와 폴더 외 영역을 클릭한 경우로 나눈다. 
    const target = e.target;
    const folder = target.closest('.wishlist-folder');
    if(folder) {
      // 폴더를 클릭한 경우
      // 폴더 삭제, 폴더 이름 변경, 폴더 열기
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
    } else if(type === 'name') {
    } else if(type === 'delete') {
    } else if(type === 'add') {
      this.$areaMenu.hidden = true;
      this.fucAddFolder();
    } else if(type === 'sort-name') {
    } else if(type === 'sort-updated') {
    } else if(type === 'sort-created') {
    } else {
      // 빈칸클릭으로 메뉴들 닫기
      this.$folderMenu.hidden = true;
      this.$areaMenu.hidden = true;
    }
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
  }
  /* ------------------------------------------------------------------------------------------------ */
  // 5. 폴더 생성 창 띄우기
  fucAddFolder() {
    this.$addFolder.hidden = false;
  }
  // 폴더 추가 창 취소
  funCancelAdd() {
    this.$addFolder.hidden = true;
  }
  // 입력 글자 수 표기
  funCountTextLength(e) {
    this.$addTextLength.textContent = e.target.value.length;
    if(e.target.value.length > 10) {
      alert('10자 이내로 입력하세요');
      e.target.value = e.target.value.slice(0, 10);
      this.$addTextLength.textContent = e.target.value.length;
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
    this.funCancelAdd();
    const folder = res.data.folder;
    const doneFolder = res.data.doneFolder;
  }
}

new Wishlist();