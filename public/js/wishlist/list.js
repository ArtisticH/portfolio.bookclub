
class List {
  constructor() {
    this._memberId = new URL(location.href).pathname.split('/')[4];
    this._folderId = new URL(location.href).pathname.split('/')[3];
    // 리스트 박스 클릭 시 색깔 변화
    this.$listBoxes = document.querySelectorAll('.list-box');
    this.clickBox = this.clickBox.bind(this);
    [...this.$listBoxes].forEach(box => {
      box.addEventListener('click', this.clickBox);
    });
    // 버튼 클릭
    this.$addForm = document.getElementById('add');
    this.$moveForm = document.getElementById('move');
    this.$btns = document.querySelector('.list-btns');
    this.$btns.onclick = this.clickBtn.bind(this);
    // 취소 버튼
    this.$cancelBtns = document.querySelectorAll('.list-cancel');
    this.cancelForm = this.cancelForm.bind(this);
    [...this.$cancelBtns].forEach(btn => {
      btn.addEventListener('click', this.cancelForm)
    });
    this.$addTitle = document.querySelector('.add-title');
    this.$addAuthor = document.querySelector('.add-author');
    this.$url = document.querySelector('.add-url');
    this.$default = document.querySelector('.add-default');
    this.$preview = document.querySelector('.add-preview');
    this.$previewImg = document.querySelector('.add-preview > img');
    this.$labels = Array.from(document.querySelectorAll('.move-label'))
    // type="file"인 요소의 change이벤트 캐치
    this.previewImg = this.previewImg.bind(this);
    this.$addImg = document.querySelector('.add-img');
    this.$addImg.addEventListener('change', this.previewImg);
    this.$default.onclick = this.default.bind(this);
    this.$addForm.onsubmit = this.addSubmit.bind(this);
    this.$list = document.getElementById('list');
    this._totalList = this.$list.dataset.list;
    this.$totalList = document.querySelector('.list-total');
    this.$clone = document.querySelector('.list-box.clone');
    this.$empty = document.querySelector('.list-empty');
    this.$listContents = document.querySelector('.list-contents');
    // 폴더 이동
    this.$moveForm.onsubmit = this.moveSubmit.bind(this);
  }
  clickBox(e) {
    const imgBox = e.currentTarget.querySelector('.list-img-box');
    imgBox.classList.toggle('clicked', !imgBox.classList.contains('clicked'));
  }
  clickBtn(e) {
    const target = e.target.closest('.list-btn');
    if(!target) return;
    const type = target.dataset.btn;
    switch(type) {
      case 'add':
        this.showForm(this.$addForm);
        break;
      case 'delete':
        this.delete();
        break;
      case 'move':
        this.showForm(this.$moveForm);
        break;
      case 'read':
        this.read();
        break;            
    }
  }
  showForm(form) {
    form.hidden = false;
  }
  cancelForm(e) {
    const form = e.target.closest('.root')
    const id = form.id;
    if(id === 'add') {
      this.resetAdd();
    } else if(id === 'move') {
      this.resetMove();
    }
  }
  resetAdd() {
    this.$addForm.hidden = true;
    this.$addTitle.value = '';
    this.$addAuthor.value = ''
    this.$url.value = '';
    this.$preview.style.display = '';
    this.$previewImg.src = '';
    // 기본값도 리셋
    this.$default.classList.toggle('clicked', false);  
  }
  resetMove() {
    this.$moveForm.hidden = true;
    for(let label of this.$labels) {
      label.querySelector('.move-title > input').checked = false;
    }
    const imgBoxes = document.querySelectorAll('.list-img-box');
    [...imgBoxes].forEach(item => {
      item.classList.toggle('clicked', false);
    });
  }
  async previewImg(e) {
    // 'change'이벤트가 발생하면, 즉 사진을 선택하면
    // 미리보기로 보여주는 역할
    const target = e.currentTarget;
    const file = target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    const res = await axios.post('/list/preview', formData);
    const url = res.data.url;
    this.$preview.style.display = 'block';
    this.$previewImg.src = url;
    this.$url.value = url;
  }
  // 기본값 그림 사용
  default() {
    if(this.$default.classList[1] === 'clicked') {
      this.$preview.style.display = 'none';
      this.$previewImg.src = ''
      this.$url.value = ''
      this.$default.classList.remove('clicked');  
    } else {
      this.$preview.style.display = 'block';
      this.$previewImg.src = '/img/list/default.jpeg'
      this.$url.value = '/img/list/default.jpeg'
      this.$default.classList.add('clicked');  
    }
  }
  async addSubmit(e) {
    e.preventDefault();
    const img = e.target.url.value;
    const title = e.target.title.value;
    const author = e.target.author.value;
    const MemberId = this._memberId;
    const FolderId = this._folderId;
    const res = await axios.post('/list', {
      img,
      title,
      author,
      MemberId,
      FolderId,
    });
    const list = res.data.list;
    this.resetAdd();
    this._totalList++;
    this.$totalList.textContent = this._totalList;
    if(this._totalList == 1) {
      this.$empty.hidden = true;
      this.$listContents.classList.add('grid');
    } 
    this.$clone.before(this.listDOM(this.$clone.cloneNode(true), list));
    // 항상 다시 리스트 박스 세팅, 박스 클릭할 수 있으니까
    this.$listBoxes = document.querySelectorAll('.list-box');
  }
  listDOM(c, obj) {
    c.className = 'list-box';
    c.hidden = false;
    c.dataset.listId = obj.id;
    c.querySelector('.list-img.width').src = obj.img;
    c.querySelector('.list-box-title').textContent = obj.title;
    c.querySelector('.list-box-author').textContent = obj.author;
    c.onclick = this.clickBox;
    return c;
  }
  async delete() {
    // 클릭된 애들만 모아
    const targets = [...this.$listBoxes].filter(box => {
      return box.querySelector('.list-img-box').classList.contains('clicked');
    }); 
    const length = targets.length;
    const lists = [];
    for(let target of targets) {
      lists[lists.length] = target.dataset.listId;
      target.remove();
    }
    this._totalList -= length;
    this.$totalList.textContent = this._totalList;
    if(this._totalList === 0) {
      this.$empty.hidden = false;
      this.$listContents.classList.remove('grid');
    }
    await axios.delete('/list', {
      data: {
        id: JSON.stringify(lists),
        FolderId: this._folderId,  
      }
    });
    this.$listBoxes = document.querySelectorAll('.list-box');
  }
  async moveSubmit(e) {
    e.preventDefault();
    const targets = [...this.$listBoxes].filter(box => {
      return box.querySelector('.list-img-box').classList.contains('clicked');
    }); 
    const elemIds = [];
    for(let target of targets) {
      elemIds[elemIds.length] = target.dataset.listId;
      target.remove();
    }
    // 이동하고자 하는 폴더의 ID값, radio값
    const targetId = e.target.listFolder.value;
    this.resetMove();
    const res = await axios.post('/list/move', {
      elemIds: JSON.stringify(elemIds),
      targetId,
      currentFolderId: this._folderId,
      MemberId: this._memberId,
    });
    // 빠져나가는것만큼 빼주자
    this._totalList -= elemIds.length;
    this.$totalList.textContent = this._totalList;
    // 현재 예시로 든 폴더의 갯수가 변하는 일은 없고 추가하거나 삭제하는게 아니니까
    // 기존의 것들에서 카운트만 바꾸자
    const counts = res.data.counts;
    this.$labels.forEach((label, index) => {
      this.changeLabel(label, counts[index]);
    });
    if(this._totalList == 0) {
      this.$empty.hidden = false;
      this.$listContents.classList.remove('grid');
    }
    this.$listBoxes = document.querySelectorAll('.list-box');
  }
  changeLabel(c, count) {
    c.querySelector('.move-count').textContent = count;
  }
  async read() {
    const targets = [...this.$listBoxes].filter(box => {
      return box.querySelector('.list-img-box').classList.contains('clicked');
    }); 
    const elemIds = [];
    for(let target of targets) {
      elemIds[elemIds.length] = target.dataset.listId;
      target.remove();
    }
    // 기존의 list의 done항목을 true로 수정, 
    // 그리고 폴더를 열때 만약 '읽은 것들' 이라면 읽은 애들만 가져와라.
    await axios.post('/list/read', {
      elemIds: JSON.stringify(elemIds),
      FolderId: this._folderId,
      MemberId: this._memberId,
    })
    this._totalList -= elemIds.length;
    this.$totalList.textContent = this._totalList;
    if(this._totalList == 0) {
      this.$empty.hidden = false;
      this.$listContents.classList.remove('grid');
    }
    this.$listBoxes = document.querySelectorAll('.list-box');
    alert(`"읽은 것들"폴더로 이동했습니다.`);
  }
}

new List();