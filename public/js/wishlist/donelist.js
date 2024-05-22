
class DoneList {
  constructor() {
    this._memberId = new URL(location.href).pathname.split('/')[4];
    // 1. 리스트 박스 클릭 시 색깔 변화
    this.$listBoxes = document.querySelectorAll('.list-box');
    this.clickBox = this.clickBox.bind(this);
    [...this.$listBoxes].forEach(box => {
      box.addEventListener('click', this.clickBox);
    });
    // 2. 버튼 클릭 이벤트 위임
    this.$btns = document.querySelector('.list-btns');
    this.$btns.onclick = this.clickBtn.bind(this);
    // 나머지
    this.$donelist = document.getElementById('donelist');
    this._totalDonelist = this.$donelist.dataset.donelist;
    this.$totalDoneList = document.querySelector('.list-total');
    this.$empty = document.querySelector('.list-empty');
    this.$listContents = document.querySelector('.list-contents');
  }
  // 1. 리스트 박스 클릭 시 색깔 변화
  clickBox(e) {
    const target = e.currentTarget;
    const imgBox = target.querySelector('.list-img-box');
    imgBox.classList.toggle('clicked', !imgBox.classList.contains('clicked'));
  }
  // 2. 버튼 클릭 이벤트 위임
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
  // 리스트 복귀
  async back() {
    const boxes = document.querySelectorAll('.list-box');
    const targets = [...boxes].filter(box => {
      return box.querySelector('.list-img-box').classList.contains('clicked');
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
    const res = await axios.post('/list/back', {
      elemIds: JSON.stringify(elemIds),
      MemberId: this._memberId,
    });
  }  
  // 리스트 삭제
  async delete() {
    const boxes = document.querySelectorAll('.list-box');
    const targets = [...boxes].filter(box => {
      return box.querySelector('.list-img-box').classList.contains('clicked');
    });
    const elemIds = [];
    for(let target of targets) {
      elemIds[elemIds.length] = target.dataset.listId;
      target.remove();
    }
    const length = elemIds.length;
    this._totalDonelist -= length;
    this.$totalDoneList.textContent = this._totalDonelist;
    const res = await axios.post('/list/done/delete', {
      elemIds: JSON.stringify(elemIds),
      MemberId: this._memberId,
    });
    if(this._totalDonelist == 0) {
      this.$empty.hidden = false;
      this.$listContents.classList.remove('grid');
    }
  }
}

new DoneList();