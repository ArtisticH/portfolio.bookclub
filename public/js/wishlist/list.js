
class List {
  constructor() {
    this._memberId = +new URL(location.href).pathname.split('/')[4];
    this._folderId = +new URL(location.href).pathname.split('/')[3];
    this.$list = document.getElementById('list');
    this._userId = +this.$list.dataset.userId;
    this._totalList = +this.$list.dataset.count;
    this._lastPage = this._totalList % 15 === 0 ? this._totalList / 15 : Math.floor(this._totalList / 15) + 1;
    // 리스트 박스 클릭 시 색깔 변화
    // clone 제외
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
    this.clickBox = this.clickBox.bind(this);
    [...this.$listBoxes].forEach(box => {
      box.addEventListener('click', this.clickBox);
    });
    // 메뉴 버튼들 클릭
    this.$addForm = document.getElementById('add');
    this.$moveForm = document.getElementById('move');
    this.$btns = document.querySelector('.list-btns');
    this.$btns.onclick = this.clickBtn.bind(this);
    // 폼 취소 버튼
    this.$cancelBtns = document.querySelectorAll('.list-cancel');
    this.cancelForm = this.cancelForm.bind(this);
    [...this.$cancelBtns].forEach(btn => {
      btn.addEventListener('click', this.cancelForm)
    });
    // 책 제목, 저자
    this.$addTitle = document.querySelector('.add-title');
    this.$addAuthor = document.querySelector('.add-author');
    // 올린 이미지 주소
    this.$url = document.querySelector('.add-url');
    // 기본이미지 버튼
    this.$default = document.querySelector('.add-default');
    // 프리뷰 박스
    this.$preview = document.querySelector('.add-preview');
    // 프리뷰 이미지
    this.$previewImg = document.querySelector('.add-preview > img');
    // type="file"인 요소의 change이벤트 캐치
    this.$addImg = document.querySelector('.add-img');
    this.$addImg.onchange = this.previewImg.bind(this);
    // 기본 이미지 클릭 시
    this.$default.onclick = this.default.bind(this);
    this._addImg = false;
    this._addTitle = false;
    this._addAuthor = false;
    this.$addForm.onsubmit = this.addSubmit.bind(this);
    this.$totalList = document.querySelector('.list-total');
    this.$empty = document.querySelector('.list-empty');
    this.$listContents = document.querySelector('.list-contents');
    this.$clone = document.querySelector('.list-box.clone');
    this.$pagenation = document.querySelector('.pagenation');
    // <<, <, >, >> 클릭 시
    this.$pagenation.onclick = this.pagenation.bind(this);
    // 페이지네이션
    this._current = 1;
    this._target = null;
    this.$current = document.querySelector('.page-current');
    this.$last = document.querySelector('.page-last');
    // 직접 페이지 입력 후 이동 버튼, 페이지 입력하면 targetPage가 바뀐다.
    this.$current.oninput = this.targetPage.bind(this);
    this.$moveBtn = document.querySelector('.page-move');
    this.$moveBtn.onclick = this.movePage.bind(this);
    // 이동 폼
    this.$labels = Array.from(document.querySelectorAll('.move-label'))
    this.$moveForm.onsubmit = this.moveSubmit.bind(this);
  }
  checkMe() {
    return this._userId !== this._memberId;
  }
  clickBox(e) {
    if(this.checkMe()) {
      alert('권한이 없습니다.');
      return;
    }
    const imgBox = e.currentTarget.querySelector('.list-img-box');
    imgBox.classList.toggle('clicked', !imgBox.classList.contains('clicked'));
  }
  // 클릭 된 애들만 모아모아
  clickedBoxes() {
    return [...this.$listBoxes].filter(box => box.querySelector('.list-img-box').classList.contains('clicked'));
  }
  clickBtn(e) {
    if(this.checkMe()) {
      alert('권한이 없습니다.');
      return;
    }
    const target = e.target.closest('.list-btn');
    if(!target) return;
    const type = target.dataset.btn;
    const boxes = this.clickedBoxes();
    switch(type) {
      // 리스트 추가
      case 'add':
        this.showForm(this.$addForm);
        break;
      // 삭제
      case 'delete':
        if(boxes.length === 0) {
          alert('먼저 리스트를 추가해주세요');
          return;
        }    
        this.delete(boxes);
        break;
      // 다른 폴더로 이동
      case 'move':
        if(boxes.length === 0) {
          alert('먼저 리스트를 추가해주세요');
          return;
        }    
        this.showForm(this.$moveForm);
        break;
      // "읽은 것들"폴더로 이동
      case 'read':
        if(boxes.length === 0) {
          alert('먼저 리스트를 추가해주세요');
          return;
        }    
        this.read(boxes);
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
    this.$url.value = '';
    this.$addTitle.value = '';
    this.$addAuthor.value = ''
    this.$preview.style.display = '';
    this.$previewImg.src = '';
    // 기본값도 리셋
    this.$default.classList.toggle('clicked', false);  
  }
  resetMove() {
    this.$moveForm.hidden = true;
    for(let label of this.$labels) {
      label.querySelector('input').checked = false;
    }
    // 클릭 취소 했을때 선택된 애들 취소
    const arr = this.clickedBoxes();
    for(let item of arr) {
      item.querySelector('.list-img-box').classList.remove('clicked');
    }
  }
  async previewImg(e) {
    // 'change'이벤트가 발생하면, 즉 사진을 선택하면
    // 미리보기로 보여주는 역할
    // 이미지 인풋
    const target = e.currentTarget;
    const file = target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    const res = await axios.post('/list/preview', formData);
    const url = res.data.url;
    this.$preview.style.display = 'block';
    this.$previewImg.src = url;
    this.$url.value = url;
    this.$default.classList.remove('clicked'); 
    this._addImg = true;
  }
  // 기본값 그림 사용
  default() {
    if(this.$default.classList[1] === 'clicked') {
      // 이미지 다시 사라지기
      this.$preview.style.display = 'none';
      this.$previewImg.src = ''
      this.$url.value = ''
      this.$default.classList.remove('clicked');  
      this._addImg = false;
    } else {
      this.$preview.style.display = 'block';
      this.$previewImg.src = '/img/list/default.jpeg'
      this.$url.value = '/img/list/default.jpeg'
      this.$default.classList.add('clicked');  
      this._addImg = true;
    }
  }
  async addSubmit(e) {
    e.preventDefault();
    const img = e.target.url.value;
    const title = e.target.title.value;
    const author = e.target.author.value;
    if(title.length > 0) {
      this._addTitle = true;
    } else {
      this._addTitle = false;
    }
    if(author.length > 0) {
      this._addAuthor = true;
    } else {
      this._addAuthor = false;
    }
    if(!this._addImg || !this._addTitle || !this._addAuthor) {
      alert('요소를 빠짐없이 채워주세요.');
      return;
    }
    const MemberId = this._memberId;
    const FolderId = this._folderId;
    const res = await axios.post('/list', {
      img,
      title,
      author,
      MemberId,
      FolderId,
    });
    this.resetAdd();
    this._totalList++;
    this.$totalList.textContent = this._totalList;
    if(this._totalList == 1) {
      this.isNotZero();
    } 
    // 📍 "현재 페이지"가 15개 미만이면 화면에 추가
    if(this._totalList < 15) {
      const list = res.data.list;
      this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
    }
    // 라스트 페이지 업데이트
    this.lastPage();
    // 추가 후에 다시 this.$listBoxes 업데이트
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
  }
  lastPage() {
    this._lastPage = this._totalList % 15 === 0 ? this._totalList / 15 : Math.floor(this._totalList / 15) + 1;
    this.$last.innerHTML = `/&nbsp;&nbsp;${this._lastPage}`;
  }
  isNotZero() {
    this.$empty.hidden = true;
    this.$listContents.classList.add('grid');
    this.$pagenation.hidden = false;
  }
  isZero() {
    this.$empty.hidden = false;
    this.$listContents.classList.remove('grid');
    this.$pagenation.hidden = true;
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
  async deleteRearrange(ids) {
    // 삭제, 이동 시 대처
    if(this._totalList <= 15) {
      // 15개 이하면 그냥 삭제만
      await axios.delete('/list', {
        data: {
          id: JSON.stringify(ids),
          FolderId: this._folderId,  
          MemberId: this._memberId,
          page: this._current,  
          count: 0,
        }
      });  
      return undefined;
    } else if(this._totalList > 15 && this._current !== this._lastPage) {
      // 15개 초과인데, 현재 페이지가 마지막 페이지가 아닌 경우
      // 삭제/이동한 만큼 추가
      const res = await axios.delete('/list', {
        data: {
          id: JSON.stringify(ids),
          FolderId: this._folderId,  
          MemberId: this._memberId,
          page: this._current,  
          // 몇개 내려보내달라 요청
          count: ids.length,
        }
      });  
      return res;
    } else if(this._totalList > 15 && this._current === this._lastPage) {
      // 15개 초과인데, 현재 페이지가 마지막 페이지인 경우
      // 그냥 삭제
      // 근데 마지막 하나 남은 경우? 그럼 그 이전 페이지로 이동
      this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
      const length = [...this.$listBoxes].length;
      if(length === 0) {
        // 이전 페이지 보여주기
        const res = await axios.delete('/list', {
          data: {
            id: JSON.stringify(ids),
            FolderId: this._folderId,  
            MemberId: this._memberId,
            page: this._current,  
            // 몇개 내려보내달라 요청
            count: 15,
          }
        });  
        this.$current.value = this._lastPage - 1;
        return res;  
      } else {
        await axios.delete('/list', {
          data: {
            id: JSON.stringify(ids),
            FolderId: this._folderId,  
            MemberId: this._memberId,
            page: this._current,  
            count: 0,
          }
        });  
        return undefined;  
      }
    }
  }
  async delete(targets) {
    const text = '선택된 리스트들을 삭제하시겠습니까?';
    if(!confirm(text)) {
      for(let target of targets) {
        target.querySelector('.list-img-box').classList.remove('clicked');
      }  
      return;
    } 
    const length = targets.length;
    const ids = [];
    // 삭제할 애들 아이디 모으기
    for(let target of targets) {
      ids[ids.length] = target.dataset.listId;
      target.remove();
    }
    const res = await this.deleteRearrange(ids);
    const lists = !res ? undefined : res.data.lists;
    this._totalList -= length;
    this.$totalList.textContent = this._totalList;
    this.lastPage();
    if(this._totalList === 0) {
      this.isZero();
    }
    if(lists) {
      lists.forEach(list => {
        this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
      });  
    }
    alert('삭제했습니다.');
    // 삭제 후에 다시 업데이트
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
  }
  async moveRearrange(ids, targetId) {
    let res;
    if(this._totalList <= 15) {
      // 15개 이하면 그냥 삭제만
      res = await axios.post('/list/move', {
        id: JSON.stringify(ids),
        FolderId: this._folderId,  
        MemberId: this._memberId,
        targetId,
        page: this._current,
        count: 0,
      });  
    } else if(this._totalList > 15 && this._current !== this._lastPage) {
      // 15개 초과인데, 현재 페이지가 마지막 페이지가 아닌 경우
      // 삭제/이동한 만큼 추가
      res = await axios.post('/list/move', {
        id: JSON.stringify(ids),
        FolderId: this._folderId,  
        MemberId: this._memberId,
        targetId,
        page: this._current,
        count: ids.length,
      });  
    } else if(this._totalList > 15 && this._current === this._lastPage) {
      // 15개 초과인데, 현재 페이지가 마지막 페이지인 경우
      // 그냥 삭제
      // 근데 마지막 하나 남은 경우? 그럼 그 이전 페이지로 이동
      this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
      const length = [...this.$listBoxes].length;
      if(length === 0) {
        // 이전 페이지 보여주기
        res = await axios.post('/list/move', {
          id: JSON.stringify(ids),
          FolderId: this._folderId,  
          MemberId: this._memberId,
          targetId,
          page: this._current,
          count: 15,
        }); 
        this.$current.value = this._lastPage - 1;   
      } else {
        res = await axios.post('/list/move', {
          id: JSON.stringify(ids),
          FolderId: this._folderId,  
          MemberId: this._memberId,
          targetId,
          page: this._current,
          count: 0,
        });  
      }
    }
    return res;
  }
  async moveSubmit(e) {
    e.preventDefault();
    const radios = document.getElementsByName('listFolder');
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
    const targets = this.clickedBoxes();
    const text = '해당 리스트들을 선택한 폴더로 이동하시겠습니까?';
    if(!confirm(text)) {
      return;
    } 
    // 이동하고자 하는 폴더의 아이디
    const targetId = e.target.listFolder.value;
    const length = targets.length;
    const ids = [];
    // 삭제할 애들 아이디 모으기
    for(let target of targets) {
      ids[ids.length] = target.dataset.listId;
      target.remove();
    }
    const res = await this.moveRearrange(ids, targetId);
    this.resetMove();
    const lists = res.data.lists;
    const counts = res.data.counts;
    // 폴더들의 갯수 바꾸기
    this.$labels.forEach((label, index) => {
      this.changeLabel(label, counts[index]);
    });
    this._totalList -= length;
    this.$totalList.textContent = this._totalList;
    this.lastPage();
    if(this._totalList === 0) {
      this.isZero();
    }
    if(lists) {
      lists.forEach(list => {
        this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
      });  
    }
    alert('이동했습니다.');
    // 삭제 후에 다시 업데이트
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
  }
  changeLabel(c, count) {
    c.querySelector('.move-count').textContent = count;
  }
  async readRearrange(ids) {
    if(this._totalList <= 15) {
      await axios.post('/list/read', {
        id: JSON.stringify(ids),
        FolderId: this._folderId,
        MemberId: this._memberId,
        page: this._current,
        count: 0,
      });
      return undefined;
    } else if(this._totalList > 15 && this._current !== this._lastPage) {
      // 15개 초과인데, 현재 페이지가 마지막 페이지가 아닌 경우
      // 삭제/이동한 만큼 추가
      const res = await axios.post('/list/read', {
        id: JSON.stringify(ids),
        FolderId: this._folderId,
        MemberId: this._memberId,
        page: this._current,
        count: ids.length,
      });
      return res;
    } else if(this._totalList > 15 && this._current === this._lastPage) {
      // 15개 초과인데, 현재 페이지가 마지막 페이지인 경우
      // 그냥 삭제
      // 근데 마지막 하나 남은 경우? 그럼 그 이전 페이지로 이동
      this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
      const length = [...this.$listBoxes].length;
      if(length === 0) {
        // 이전 페이지 보여주기
        const res = await axios.post('/list/read', {
          id: JSON.stringify(ids),
          FolderId: this._folderId,
          MemberId: this._memberId,
          page: this._current,
          count: 15,
        });
        this.$current.value = this._lastPage - 1;
        return res;
      } else {
        await axios.post('/list/read', {
          id: JSON.stringify(ids),
          FolderId: this._folderId,
          MemberId: this._memberId,
          page: this._current,
          count: 0,
        });
        return undefined;  
      }
    }
  }
  async read(targets) {
    const text = '선택된 리스트들을 "읽은 것들" 폴더로 이동하시겠습니까?';
    if(!confirm(text)) {
      for(let target of targets) {
        target.querySelector('.list-img-box').classList.remove('clicked');
      }  
      return;
    }  
    const length = targets.length;
    const ids = [];
    for(let target of targets) {
      ids[ids.length] = target.dataset.listId;
      target.remove();
    }
    const res = await this.readRearrange(ids);
    const lists = !res ? undefined : res.data.lists;
    this._totalList -= length;
    this.$totalList.textContent = this._totalList;
    this.lastPage();
    if(this._totalList === 0) {
      this.isZero();
    }
    if(lists) {
      lists.forEach(list => {
        this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
      });  
    }
    alert(`"읽은 것들"폴더로 이동했습니다.`);
    // 삭제 후에 다시 업데이트
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
  }
  targetPage(e) {
    // this._target 바꾸자.
    // +안하면 문자열로 인식되서 오류
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
    [...this.$listContents.children].forEach(item => {
      if(item.className === 'list-box') {
        item.remove();
      }
    });
    lists.forEach(list => {
      this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
    });
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
  }
  async movePage() {
    if(this._current === this._target) {
      alert('현재 페이지입니다.');
      return;
    }
    const res = await axios.post('/list/page', {
      page: this._target,
      done: false,
      MemberId: this._memberId,
      FolderId: this._folderId,
    });
    const lists = res.data.lists;
    this.pageArrange(lists);
  }
  showPage() {
    if(this._totalList > 0) {
      this.$pagenation.hidden = false;
      this.lastPage();
      this.$current.value = this._current;
    } 
  }
}

const list = new List();
list.showPage();
