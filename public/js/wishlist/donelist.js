
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
}

new DoneList();