class DoneList {
  constructor() {
    this._memberId = +new URL(location.href).pathname.split('/')[4];
    this._folderId = +new URL(location.href).pathname.split('/')[3];
    this.$donelist = document.getElementById('donelist');
    this._userId = +this.$donelist.dataset.userId;
    this._totalDonelist = +this.$donelist.dataset.count;
    this._lastPage = this._totalDonelist % 15 === 0 ? this._totalDonelist / 15 : Math.floor(this._totalDonelist / 15) + 1;
    // 리스트 박스 클릭 시 색깔 변화
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
    this.clickBox = this.clickBox.bind(this);
    [...this.$listBoxes].forEach(box => {
      box.addEventListener('click', this.clickBox);
    });
    // 버튼 클릭
    this.$btns = document.querySelector('.list-btns');
    this.$btns.onclick = this.clickBtn.bind(this);
    this.$totalDoneList = document.querySelector('.list-total');
    this.$empty = document.querySelector('.list-empty');
    this.$listContents = document.querySelector('.list-contents');
    // 페이지네이션
    this.$clone = document.querySelector('.list-box.clone')
    this._current = 1;
    this._target = null;
    this.$current = document.querySelector('.page-current');
    this.$last = document.querySelector('.page-last');
    this.$pagenation = document.querySelector('.pagenation');
    this.$pagenation.onclick = this.pagenation.bind(this);
    this.$current.oninput = this.targetPage.bind(this);
    this.$moveBtn = document.querySelector('.page-move');
    this.$moveBtn.onclick = this.movePage.bind(this);
  }
  checkMe() {
    return this._userId !== this._memberId;
  }
  clickBox(e) {
    if(this.checkMe()) {
      alert('권한이 없습니다.');
      return;
    }
    const imgBox = e.currentTarget.querySelector('.donelist-img-box');
    imgBox.classList.toggle('clicked', !imgBox.classList.contains('clicked'));
  }
  clickedBoxes() {
    return [...this.$listBoxes].filter(box => box.querySelector('.donelist-img-box').classList.contains('clicked'));
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
      case 'back':
        if(boxes.length === 0) {
          alert('먼저 리스트를 추가해주세요');
          return;
        }    
        this.back(boxes);
        break;
      case 'delete':
        if(boxes.length === 0) {
          alert('먼저 리스트를 추가해주세요');
          return;
        }   
        this.delete(boxes);
        break;
    }
  }
  async backRearrange(ids) {
    // 삭제, 이동 시 대처
    if(this._totalList <= 15) {
      // 15개 이하면 그냥 삭제만
      await axios.post('/list/back', {
        id: JSON.stringify(ids),
        MemberId: this._memberId,
        page: this._current,  
        count: 0,
      });
      return undefined;
    } else if(this._totalList > 15 && this._current !== this._lastPage) {
      // 15개 초과인데, 현재 페이지가 마지막 페이지가 아닌 경우
      // 삭제/이동한 만큼 추가
      const res = await axios.post('/list/back', {
        id: JSON.stringify(ids),
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
        const res = await axios.post('/list/back', {
          id: JSON.stringify(ids),
          MemberId: this._memberId,
          page: this._current,  
          count: 15,
        });
        this.$current.value = this._lastPage - 1;
        return res;  
      } else {
        await axios.post('/list/back', {
          id: JSON.stringify(ids),
          MemberId: this._memberId,
          page: this._current,  
          count: 0,
        });
        return undefined;  
      }
    }
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
  // 완독 해제
  async back(targets) {
    const text = '선택된 리스트들의 완독을 해제하시겠습니까?';
    if(!confirm(text)) {
      for(let target of targets) {
        target.querySelector('.donelist-img-box').classList.remove('clicked');
      }  
      return;
    } 
    const length = targets.length;
    const ids = [];
    for(let target of targets) {
      ids[ids.length] = target.dataset.listId;
      target.remove();
    }
    const res = await this.backRearrange(ids);
    const lists = !res ? undefined : res.data.lists;
    this._totalDonelist -= length;
    this.$totalDoneList.textContent = this._totalDonelist;
    this.lastPage();
    if(this._totalDonelist === 0) {
      this.isZero();
    } 
    if(lists) {
      lists.forEach(list => {
        this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
      });  
    }
    alert('해제했습니다.');
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
  }  
  async deleteRearrange(ids) {
    // 삭제, 이동 시 대처
    if(this._totalList <= 15) {
      // 15개 이하면 그냥 삭제만
      await axios.delete('/list/done', {
        data: {
          id: JSON.stringify(ids),
          MemberId: this._memberId,  
          page: this._current,  
          count: 0,
        }
      });
      return undefined;
    } else if(this._totalList > 15 && this._current !== this._lastPage) {
      // 15개 초과인데, 현재 페이지가 마지막 페이지가 아닌 경우
      // 삭제/이동한 만큼 추가
      const res = await axios.delete('/list/done', {
        data: {
          id: JSON.stringify(ids),
          MemberId: this._memberId,  
          page: this._current,  
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
        const res = await axios.delete('/list/done', {
          data: {
            id: JSON.stringify(ids),
            MemberId: this._memberId,  
            page: this._current,  
            count: 15,
          }
        });  
        this.$current.value = this._lastPage - 1;
        return res;  
      } else {
        await axios.delete('/list/done', {
          data: {
            id: JSON.stringify(ids),
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
        target.querySelector('.donelist-img-box').classList.remove('clicked');
      }  
      return;
    } 
    const length = targets.length;
    const ids = [];
    for(let target of targets) {
      ids[ids.length] = target.dataset.listId;
      target.remove();
    }
    const res = await this.deleteRearrange(ids);
    const lists = !res ? undefined : res.data.lists;
    this._totalDonelist -= length;
    this.$totalDoneList.textContent = this._totalDonelist;
    this.lastPage();
    if(this._totalDonelist === 0) {
      this.isZero();
    } 
    if(lists) {
      lists.forEach(list => {
        this.$listContents.append(this.listDOM(this.$clone.cloneNode(true), list));
      });  
    }
    alert('삭제했습니다.');
    this.$listBoxes = [...document.querySelectorAll('.list-box')].filter(item => item.classList.length === 1);
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

const doneList = new DoneList();
doneList.showPage();