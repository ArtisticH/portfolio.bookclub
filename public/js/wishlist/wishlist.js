class Wishlist {
  constructor() {
    this._memberId = new URL(location.href).pathname.split('/')[2];
    this.$wishlist = document.getElementById('wishlist');
    // 폴더 추가, 이름 변경 등의 권한을 구별할때
    this._userId = this.$wishlist.dataset.userId;
    // 폴더 개수 14개 제한하기 위해, "읽은 것들"까지 합하면 총 15개
    // 그리고 만약 폴더 수가 0에서 1이 되거나 1에서 0이 된다면 변화가 필요
    // 0에서 1이라면 "첫번째 폴더 + done폴더" 활성화
    // 1에서 0이 될때 "읽은 것들"리스트도 없다면 empty 보여주기
    this._totalFolder = +this.$wishlist.dataset.totalFolder;
    // 하나남은 폴더 삭제할때 읽은 것들도 리스트가 0개라면 화면을 바꿔야 한다.
    this._doneCount = +this.$wishlist.dataset.doneCount;
    // 오른쪽 마우스 클릭 => 폴더 생성 혹은 정렬에 대한 메뉴 보여줄건지
    // this.$area는 전체에서 nav를 제외한 영역
    // 여기에서 마우스 오른쪽 버튼 클릭 시 주체가 폴더냐, 빈 영역이냐에 따라서
    this.$area = document.querySelector('.wishlist');
    // 폴더에 대한 변경 메뉴
    this.$folderMenu = document.getElementById('folder-menu');
    // 폴더 추가 혹은 정렬 메뉴
    this.$areaMenu = document.getElementById('area-menu');
    // 폴더에 오른쪽 마우스를 클릭한 경우 그 폴더가 할당된다.
    this.$current = null;
    this.$area.oncontextmenu = this.contextmenu.bind(this);
    // 컨텍스트메뉴를 클릭할때, 모든 클릭 이벤트 
    this.$wishlist.onclick = this.click.bind(this);
    // 정렬에 마우스 호버하면 정렬 선택지 또 보여주기
    this.$sortMenu = document.getElementById('sort-menu');
    this.$sortElem = document.querySelector('[data-menu="sort"]');
    this.$sortElem.onpointerenter = this.sort.bind(this);
    // 폴더 더블클릭 시 open과 같은 효과
    // 이때 따로 this.$current를 지정해야 한다. 
    this.$area.ondblclick = this.dblclick.bind(this);
    // 폴더 생성 창
    this.$add = document.getElementById('add');
    // 폴더 이름 글자 수
    this.$addLength = document.querySelector('.add-length');
    // 폴더 이름 입력칸
    this.$addInput = document.querySelector('.add-input');
    // 글자 수 세고 표기하는 함수
    this.countText = this.countText.bind(this);
    // 아래 조건이 true여야 폼이 전송되게끔
    this._addCheck = false;
    this._nameCheck = false;
    // 입력 시 글자 수 표기하고, 넘으면 제재를 가하는
    this.$addInput.oninput = (e) => {
      this.countText(e, this.$addLength, 'add');
    }
    this.$addForm = document.querySelector('.add-form');
    this.$addForm.onsubmit = this.submitAdd.bind(this);
    // 폴더 이름 변경 폼
    this.$name = document.getElementById('change');
    this.$nameLength = document.querySelector('.change-length');
    this.$nameInput = document.querySelector('.change-input');
    this.$nameInput.oninput = (e) => {
      this.countText(e, this.$nameLength, 'name');
    }
    this.$nameForm = document.querySelector('.change-form');
    this.$nameForm.onsubmit = this.submitName.bind(this);
    // 폼 취소 버튼
    this.$cancelBtns = document.querySelectorAll('.cancel');
    this.cancel = this.cancel.bind(this);
    [...this.$cancelBtns].forEach(btn => {
      btn.addEventListener('click', this.cancel);
    });
    this.$empty = document.querySelector('.empty');
    // 폴더 추가 클론
    this.$clone = document.querySelector('.folder.clone');
    // 읽은 것들 폴더
    this.$done = document.querySelector('.folder.done');
  }
  // 전체 - nav인 영역에서 오른쪽 버튼 클릭 시 
  // 클릭 주체가 폴더냐, 빈 영역이냐에 따라 보여주는 선택지가 다르다. 
  contextmenu(e) {
    // 폴더를 클릭한 경우와 빈 영역을 클릭한 경우로 나눈다. 
    const folder = e.target.closest('.folder');
    if(folder) {
      // 오른쪽 마우스 버튼 클릭의 주체가 폴더인 경우 "this.$current에 폴더 할당"
      // 후에 this.$current가 쓰인다.
      // 폴더 클릭 시! this.$current가 특정된다!
      // 폴더 삭제, 폴더 이름 변경, 폴더 열기, 공개/비공개
      this.$current = folder;
      // 선택지 보여주기
      this.folderMenu();
      // 그 선택지가 어디에 위치해야 되는지
      this.locate(e, this.$folderMenu);
    } else {
      // 그 외의 영역
      // 폴더 추가, 폴더 정렬 - 이름순, 생성일순
      this.areaMenu();
      this.locate(e, this.$areaMenu);
    } 
    // 기존 브라우저의 마우스 오른쪽 버튼 효과 제거를 위해
    return false;
  }
  locate(e, elem) {
    elem.style.left = e.clientX + 'px';
    elem.style.top = e.clientY + 'px';
  }
  // 둘 다 사라져
  gone() {
    this.$folderMenu.hidden = true;
    this.$areaMenu.hidden = true;
  }
  areaMenu() {
    this.$areaMenu.hidden = false;
    this.$folderMenu.hidden = true;
  }
  folderMenu() {
    this.$folderMenu.hidden = false;
    this.$areaMenu.hidden = true;
  }
  // 클릭한 폴더가 "읽은 것들"이라면
  checkDone() {
    return this.$current.classList[1] == 'done';
  }
  // 현재 로그인한 유저와 이 폴더 영역의 유저가 같은지
  checkMe() {
    return this._userId != this._memberId;
  }
  // 이 폴더가 비공개인지
  checkPrivate() {
    return this.$current.dataset.public === 'false';
  }
  // 컨텍스트이벤트로 선택지를 제시했으면
  // 사용자는 클릭하고
  // 그 클릭 이벤트를 잡는 함수
  click(e) {
    const type = e.target.dataset.menu;
    switch(type) {
      // 폴더 영역
      // 열기를 제외한 모든 선택지들은 폴더 소유 유저만이 가능하다. 
      case 'open':
        // 이 폴더가 "비공개"인데, 
        // 너가 이 폴더의 유저가 아니라면 입장 불가
        // 공개폴더 + 폴더의 유저가 아님 => 입장 가능
        // 비공개 폴더 + 폴더의 유저임 => 입장 가능
        if(this.checkPrivate() && this.checkMe()) {
          alert('비공개 폴더입니다.');
          this.gone();
          return;
        }      
        this.open();
        break;
      case 'name':
        // "읽은 것들"은 폴더 이름 변경할 수 없음
        if(this.checkDone()) {
          alert('이 폴더는 폴더명을 변경할 수 없습니다.');
          this.gone();
          return;    
        }
        if(this.checkMe()) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.name();
        break;
      case 'delete':
        if(this.checkDone()) {
          alert('이 폴더는 삭제할 수 없습니다.');
          this.gone();
          return;    
        }
        if(this.checkMe()) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.delete();
        break;
      case 'public':
        if(this.checkMe()) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.public();
        break;
      // 여기서부터 빈 영역
      case 'add':
        if(this.checkMe()) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.add();
        break;
      case 'sort-name':
        if(this.checkMe()) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.sortName();
        break;
      case 'sort-updated':
        if(this.checkMe()) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.sortUpdatedAt();
        break;
      case 'sort-created':
        if(this.checkMe()) {
          alert('권한이 없습니다.');
          this.gone();
          return;
        }      
        this.sortCreatedAt();
        break;
    }
    // 선택지가 아닌 빈 영역을 선택하면 선택지가 사라지는 효과
    this.gone();
  }
  // 정렬 요소 호버하면 정렬 선택지 보여주고
  // 정렬 요소 "pointerleave"하면 정렬 선택지 사라짐
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
    // 이 과정을 꼭 해줘야
    this.$current = folder;
    if(this.checkPrivate() && this.checkMe()) {
      alert('비공개 폴더입니다.');
      this.gone();
      return;
    }  
    this.open();
  }
  // '읽은 것들'폴더와 보통 폴더 구분
  open() {
    let url;
    if(this.checkDone()) {
      // 폴더 아이디가 null인 이유는 읽은 것들 리스트는
      // 여러 폴더에서 오기 때문에 FolderId가 다양하다. 
      url = `/list/true/null/${this._memberId}`;
    } else {
      const FolderId = this.$current.dataset.folderId;
      url = `/list/false/${FolderId}/${this._memberId}`;
    }
    window.location.href = url;  
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
    if(e.target.value.length > 15) {
      alert('15자 이내로 입력하세요');
      e.target.value = e.target.value.slice(0, 15);
    }
    elem.textContent = e.target.value.length;
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
    this.$addInput.value = '';
    this.$addLength.textContent = 0;
    const radios = document.getElementsByName('isPublic');
    for(let radio of radios) {
      radio.checked = false;
    }
    this.$add.hidden = true;
  }
  cancelName() {
    this.$nameInput.value = '';
    this.$nameLength.textContent = 0;  
    this.$name.hidden = true;
  }
  // 폴더 새롭게 생성
  async submitAdd(e) {
    e.preventDefault();
    const radios = document.getElementsByName('isPublic');
    let selected = false;
    for(let radio of radios) {
      if(radio.checked) {
        selected = true;
      }
    }
    if(!this._addCheck || !selected) {
      alert('모든 입력 요소를 채워주세요.');
      return;
    }
    const title = e.target.title.value;
    const isPublic = e.target.isPublic.value;
    const res = await axios.post('/wishlist/folder', {
      id: this._memberId,
      title,
      isPublic
    });
    // 폴더 하나 추가
    this._totalFolder++;
    // 폼 사라져
    this.cancelAdd();
    const folder = res.data.folder;
    if(this._totalFolder == 1) {
      // 0에서 1로 증가했다면 "읽은 것들"도 만들어야 한다.
      const done = res.data.done;
      // 가장 처음에 폴더를 생성할때
      // 읽은 것들 폴더도 만들어주기
      this.$empty.hidden = true;
      // 폴더들을 보여주기 위해 grid로 바꾸고
      this.$area.classList.add('grid');
      // 숨겨져있는 읽은 것들 폴더 활성화
      this.showDone(done);
    } 
    // 폴더 추가되서 보여진다.
    // 항상 읽은 것들 폴더 앞에
    this.$done.before(this.folderDOM(this.$clone.cloneNode(true), folder));
  }
  showDone(obj) {
    this.$done.hidden = false;
    this.$done.dataset.public = obj.public;
    this.$done.querySelector('.folder-count').textContent = obj.count;
    // 나중에 삭제할때 empty를 보일 것인가 말 것인가를 결정
    this._doneCount = +obj.count;
  }
  folderDOM(c, obj) {
    c.className = `folder`;
    c.hidden = false;
    c.dataset.folderId = obj.id;
    c.dataset.public = obj.public;
    c.dataset.createdat = obj.createdAt;
    // updatedAt은 서버와 통신해서 정렬하기 때문에 받을 필요가 없음.
    c.querySelector('.folder-count').textContent = obj.count;
    c.querySelector('.folder-title').textContent = obj.title;
    return c;
  }
  // 폴더 이름 변경
  name() {
    this.$name.hidden = false;
    // 원래 이름을 그대로 일단 보여주기
    const oldTitle = this.$current.querySelector('.folder-title').textContent;
    this.$name.querySelector('.change-input').value = oldTitle;
    this.$name.querySelector('.change-length').textContent = oldTitle.length;
    this._nameCheck = true;
  }
  async submitName(e) {
    e.preventDefault();
    // 만약 다시 이름을 지우거나 쓰면서 아무것도 입력하지 않았을 때를 위해서
    if(!this._nameCheck) {
      alert('폴더명을 입력하세요');
      return;
    }
    // 이 폴더의 아이디와 새로 바뀐 이름을 서버에 보내 바꾼다.
    const id = this.$current.dataset.folderId;
    const title = e.target.title.value;
    await axios.patch('/wishlist/folder', {
      id,
      title,
    });
    this.cancelName();
    // 이름 변경
    this.$current.querySelector('.folder-title').textContent = title;
  }
  // 삭제
  async delete() {
    const answer = confirm('폴더 내 모든 독서 리스트가 삭제됩니다. 그래도 폴더를 삭제하시겠습니까?');
    if(!answer) return;
    const id = this.$current.dataset.folderId;
    // 현재 이 유저의 이 폴더를 삭제
    await axios.delete(`/wishlist/${id}/${this._memberId}`);
    // 폴더 갯수 줄이고, 실제 요소 삭제하고, 
    this._totalFolder--;
    this.$current.remove();
    this.$current = null;
    // 만약 다 삭제하고 읽은 것들도 리스트가 0이라면 empty보여준다.
    this.isZero();
  }
  isZero() {
    if(this._totalFolder === 0 && this._doneCount === 0) {
      this.$done.hidden = true;
      // wishlist grid =>  wishlist로
      this.$area.classList.remove('grid');
      this.$empty.hidden = false;
    }
  }
  // 공개 / 비공개 전환
  async public() {
    // 현재 상태
    const current = this.$current.dataset.public === 'true' ? '공개' : '비공개';
    // !현재
    const change = current === '공개' ? '비공개' : '공개';
    const answer = confirm(`현재 ${current}상태입니다. ${change}상태로 바꾸시겠습니까?`);
    if(!answer) return;
    // 바꾼다면,
    const isPublic = change === '비공개' ? false : true;
    // done폴더일때와 아닐때에 따라 id값을 다르게 지정한다. 
    if(this.checkDone()) {
      const MemberId = this._memberId;
      // done이라면 DoneFolder에서 변경
      await axios.patch('/wishlist/public', {
        id: MemberId,
        public: isPublic,
        done: true,
      }); 
    } else {
      // 일반 폴더라면 Folder에서 변경
      const FolderId = this.$current.dataset.folderId;
      await axios.patch('/wishlist/public', {
        id: FolderId,
        public: isPublic,
        done: false,
      });  
    }
    // dataset이 바뀌면 css에 따라 색상에도 변화가 있음.
    this.$current.dataset.public = isPublic;
  }
  // 폴더 정렬 - 이름순
  async sortName() {
    // done, clone 걸러내기
    // done은 그냥 항상 맨 뒤에 있다. 
    const $folders = [...document.querySelectorAll('.folder')].filter(item => item.classList.length === 1);
    const names = [];
    // names = [이름, 원래 인덱스]
    $folders.forEach((item, index) => {
      names[names.length] = [
        item.querySelector('.folder-title').textContent,
        index
      ]
    });
    // 이름 오름차순으로
    names.sort();
    const newFolders = [];
    // 인덱스에 따라 노드들을 배치
    // 만약에 첫 요소가 ["이름", 3]이면 원래 $folders에서 3번째 인덱스인 요소를 가장 앞에 배치
    // 이렇게 하면 이름 순으로 요소가 재배열된다. 
    names.forEach(name => {
      newFolders[newFolders.length] = $folders[name[1]];
    });
    // 원래꺼 삭제
    [...$folders].forEach((fol) => {
      fol.remove();
    });
    // 새로운 노드 삽입
    newFolders.forEach(item => {
      this.$done.before(item);
    });
    // 그리고 새로고침해도 항상 이 유저의 이 정렬법을 고수하기 위해
    // 데이터베이스에 현재 정렬 규칙을 저장한다. 
    // 현재는 이름 순 + 오름차순(ASC)로 정했다. 
    // updated는 특수한 경우라 따로 구분을 해줘야 하고, 
    // 이렇게 하면 처음에 /wishlist/1처럼 폴더들을 보여줄때 이 sort의 내용대로 보여준다.
    await axios.post('/wishlist/sort', { 
      sort: 'title', 
      MemberId: this._memberId,
      order: 'ASC',
      updated: false,
    });
  }
  // 생성일 - 오름차순으로
  // 가장 오래전에 생성 - 가장 최근에 생성 순으로..
  async sortCreatedAt() {
    const $folders = [...document.querySelectorAll('.folder')].filter(item => item.classList.length === 1);
    const createdAt = [];
    $folders.forEach((item, index) => {
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
        // (a, b)중 a - b 순서대로
        return -1;
      } else if (d1.getTime() > d2.getTime()) {
        // (a, b)중 b - a 순서대로
        return 1;
      } else {
        // 그대로
        return 0;
      }
    }
    // 이름순으로 정렬과 같은 과정
    createdAt.sort(compareDates);
    const newFolders = [];
    createdAt.forEach(date => {
      newFolders[newFolders.length] = $folders[date[1]];
    });
    $folders.forEach((fol) => {
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
  // 가장 최근에 수정 - 가장 오래전에 수정... 순으로
  // 기존 것 없애고 새로 서버에서 받은 데이터로 채우기
  // 이름변경, 공개/비공개 변경시 수정됌
  // 위에서 변경때마다 데이터베이스에서 변경일을 다시 뽑아 클라이언트에서 수정하지 말고
  // 그냥 정렬을 클릭하면 한번에 받는게 효율적?
  // 뭐땜에 오류나서 이렇게 하는 방식이 낫다는 걸 알았는데
  // 뭐땜에 오류났는지 기억이 안나...
  async sortUpdatedAt() {
    const $folders = [...document.querySelectorAll('.folder')].filter(item => item.classList.length === 1);
    const res = await axios.post('/wishlist/sort', { 
      sort: 'updatedAt', 
      MemberId: this._memberId,
      order: 'DESC',
      updated: true,
    });
    const folders = res.data.folders;
    $folders.forEach((fol) => {
      fol.remove();
    });
    folders.forEach(folder => {
      this.$done.before(this.folderDOM(this.$clone.cloneNode(true), folder));
    });
  }  
}

new Wishlist();