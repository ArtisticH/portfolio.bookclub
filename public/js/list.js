class List {
  constructor() {
    this._memberId = new URL(location.href).pathname.split('/')[2];
    this._folderId = new URL(location.href).pathname.split('/')[3];
    // 1. 리스트 박스 클릭 시 색깔 변화
    this.$listBoxes = document.querySelectorAll('.list-box');
    this._clicked = [];
    this.clickBox = this.clickBox.bind(this);
    [...this.$listBoxes].forEach(box => {
      box.addEventListener('click', this.clickBox);
    });
    // 2. 버튼 클릭 이벤트 위임
    this.$btns = document.querySelector('.list-btns');
    this.$btns.onclick = this.clickBtn.bind(this);
    // 3. 폼 추가(리스트, 폴더 이동)
    this.$addForm = document.getElementById('list-add');
    this.$moveForm = document.getElementById('list-move');
    // 4. 취소 버튼
    this.$cancelBtns = document.querySelectorAll('.list-cancel-box');
    this.cancelForm = this.cancelForm.bind(this);
    [...this.$cancelBtns].forEach(btn => {
      btn.addEventListener('click', this.cancelForm)
    })
    // 5. 리스트 등록하기
    this.$addImg = document.getElementById('add-img');
    this.previewImg = this.previewImg.bind(this);
    this.$addImg.addEventListener('change', this.previewImg);
    this.$preview = document.querySelector('.add-img-preview');
    this.$previewImg = document.querySelector('.add-img-preview > img');
    this.$url = document.querySelector('.add-img-url');
    this.$default = document.querySelector('.add-img-default');
    this.$default.onclick = this.default.bind(this);
    this.$addForm.onsubmit = this.addSubmit.bind(this);
    this.$addTitle = document.querySelector('.add-title');
    this.$addAuthor = document.querySelector('.add-author');
    this.$list = document.getElementById('list');
    this._totalList = this.$list.dataset.list;
    this.$totalList = document.querySelector('.list-total');
    this.$clone = document.querySelector('.clone');
    this.$empty = document.querySelector('.list-empty');
    this.$listContents = document.querySelector('.list-contents');
    // 6. 리스트 삭제
  }
  // 1. 리스트 박스 클릭 시 색깔 변화
  clickBox(e) {
    const target = e.currentTarget;
    const imgBox = target.querySelector('.list-img-box');
    imgBox.classList.toggle('clicked', !imgBox.classList.contains('clicked'));
    // 클릭된 친구들을 배열에 넣기
  }
  // 2. 버튼 클릭 이벤트 위임
  clickBtn(e) {
    const target = e.target.closest('.list-btn');
    if(!target) return;
    const type = target.dataset.btn;
    switch(type) {
      case 'add':
        this.showForm(this.$addForm);
        break;
      case 'delete':
        break;
      case 'move':
        this.showForm(this.$moveForm);
        break;
      case 'read':
        break;            
    }
  }
  // 3. 폼 보여주기
  showForm(form) {
    form.hidden = false;
  }
  // 4. 폼 취소
  cancelForm(e) {
    const form = e.target.closest('.root')
    const id = form.id;
    if(id === 'list-add') {
      this.resetAdd();
    } else if(id === 'list-move') {
      this.resetMove();
    }
  }
  // 5. 리스트 등록하기
  async previewImg(e) {
    // 'change'이벤트가 발생하면, 즉 사진을 선택하면
    // 미리보기로 보여주는 역할
    const target = e.currentTarget;
    const file = target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    const res = await axios.post('/list/preview', formData);
    this.$preview.style.display = 'block';
    this.$previewImg.src = res.data.url;
    this.$url.value = res.data.url;
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
    // 항상 다시 리스트 박스 세팅, 클릭할 수 있으니까
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
  // 6. 리스트 삭제

}

new List();