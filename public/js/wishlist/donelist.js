
class DoneList {
  constructor() {
    this._memberId = new URL(location.href).pathname.split('/')[4];
    // 리스트 박스 클릭 시 색깔 변화
    this.$listBoxes = document.querySelectorAll('.list-box');
    this.clickBox = this.clickBox.bind(this);
    [...this.$listBoxes].forEach(box => {
      box.addEventListener('click', this.clickBox);
    });
    // 버튼 클릭
    this.$btns = document.querySelector('.list-btns');
    this.$btns.onclick = this.clickBtn.bind(this);
    this.$donelist = document.getElementById('donelist');
    this._totalDonelist = this.$donelist.dataset.donelist;
    this.$totalDoneList = document.querySelector('.list-total');
    this.$empty = document.querySelector('.list-empty');
    this.$listContents = document.querySelector('.list-contents');
    // 페이지네이션
    this.$clone = document.querySelector('.list-box.clone')
    this._current = 1;
    this._lastPage = +this.$donelist.dataset.last;
    this._target = null;
    this.$current = document.querySelector('.page-current');
    // <<, <, >, >> 클릭 시
    this.$pagenation = document.querySelector('.pagenation');
    this.$pagenation.onclick = this.pagenation.bind(this);
    // 직접 페이지 입력 후 이동 버튼
    // 페이지 입력하면 targetPage가 바뀐다.
    this.$current.oninput = this.targetPage.bind(this);
    this.$moveBtn = document.querySelector('.page-move');
    this.$moveBtn.onclick = this.inputPage.bind(this);
  }
  clickBox(e) {
    const imgBox = e.currentTarget.querySelector('.donelist-img-box');
    imgBox.classList.toggle('clicked', !imgBox.classList.contains('clicked'));
  }
  clickBtn(e) {
    const target = e.target.closest('.list-btn');
    if(!target) return;
    const type = target.dataset.btn;
    switch(type) {
      case 'back':
        this.back();
        break;
      case 'delete':
        this.delete();
        break;
    }
  }
  // 완독 해제
  async back() {
    if(this._totalDonelist === 0) {
      alert('먼저 완독해주세요.');
      return;
    }
    const targets = [...this.$listBoxes].filter(box => {
      return box.querySelector('.donelist-img-box').classList.contains('clicked');
    }); 
    const elemIds = [];
    for(let target of targets) {
      elemIds[elemIds.length] = target.dataset.listId;
      target.remove();
    }
    const length = elemIds.length;
    this._totalDonelist -= length;
    this.$totalDoneList.textContent = this._totalDonelist;
    if(this._totalDonelist == 0) {
      this.$empty.hidden = false;
      this.$listContents.classList.remove('grid');
    }
    await axios.post('/list/back', {
      elemIds: JSON.stringify(elemIds),
      MemberId: this._memberId,
    });
    this.$listBoxes = document.querySelectorAll('.list-box');
  }  
  async delete() {
    if(this._totalDonelist === 0) {
      alert('먼저 완독해주세요.');
      return;
    }
    const targets = [...this.$listBoxes].filter(box => {
      return box.querySelector('.donelist-img-box').classList.contains('clicked');
    }); 
    const elemIds = [];
    for(let target of targets) {
      elemIds[elemIds.length] = target.dataset.listId;
      target.remove();
    }
    const length = elemIds.length;
    this._totalDonelist -= length;
    this.$totalDoneList.textContent = this._totalDonelist;
    if(this._totalDonelist === 0) {
      this.$empty.hidden = false;
      this.$listContents.classList.remove('grid');
    }
    await axios.delete('/list/done', {
      data: {
        elemIds: JSON.stringify(elemIds),
        MemberId: this._memberId,  
      }
    });
    this.$listBoxes = document.querySelectorAll('.list-box');
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
    const res = await axios.post('/list/page', {
      page: this._target,
      done: true,
    });
    // 내림차순(최신 => 오래된 순)으로 옴
    const lists = JSON.parse(res.data.lists);
    this._current = this._target;
    [...this.$listContents.children].forEach(item => {
      if(item.className === 'list-box') {
        item.remove();
      }
    });
    lists.forEach(list => {
      this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
    });
    this.$current.value = this._current;
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
    const res = await axios.post('/list/page', {
      page: this._target,
      done: true,
    });
    const lists = JSON.parse(res.data.lists);
    this._current = this._target;
    [...this.$listContents.children].forEach(item => {
      if(item.className === 'list-box') {
        item.remove();
      }
    });
    lists.forEach(list => {
      this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
    })
  }
}

new DoneList();