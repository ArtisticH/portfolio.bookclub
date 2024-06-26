class Index {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. 로그인, 회원가입 폼
    this.$form = null;
    this.$btns = document.querySelector('.top-left__btns');
    this.showForm = this.showForm.bind(this);
    // 로그인한 상태라면 this.$btns가 null이라서
    this.$btns && this.$btns.addEventListener('click', this.showForm);
    this.disappearForm = this.disappearForm.bind(this);
    // 폼 취소 버튼
    this.$cancels = document.querySelectorAll('.cancel');
    this.$cancels.forEach(btn => {
      btn.addEventListener('click', this.disappearForm);
    });    
    /* --------------------------------------------------------------------------------------------------------- */
    /* 2. min-width: 650px 이상일때 scroll 글자 떠내려오는 효과 */
    this.$topRight = document.querySelector('.top-right');
    this.$scrollText = document.querySelector('.top-right__scroll');
    // 내려올 거리: (.top-right의 높이) - (text높이) - (위의 top: 10px)
    this._downDistance = this.$topRight.offsetHeight - this.$scrollText.offsetHeight - 10; 
    // CSS의 변수 설정
    document.documentElement.style.setProperty('--downDistance', this._downDistance + 'px');
    /* --------------------------------------------------------------------------------------------------------- */
    /* 3. scroll */
    this.$body = document.querySelector('body');
    this._start = this.$body.offsetTop + 400; 
    this._end = this.$body.offsetHeight - document.documentElement.clientHeight;
    this._step = (this._end - this._start) / 4; 
    // top-left
    this.$btn = Array.from(document.querySelectorAll('.top-left__btn'));
    // top-right
    this.$title = Array.from(document.querySelectorAll('.top-right__title'));
    this.$arrow = document.querySelector('.top-right__arrow');
    this.$number = document.querySelector('.top-right__number');
    this._gradient = [
      "linear-gradient(to top, #fff1eb 0%, #3fa7f3 100%)", 
      "linear-gradient(to top, #fff1eb 0%, #edd649 100%)", 
      "linear-gradient(to top, #fff1eb 0%, #99d1a2 100%)", 
      "linear-gradient(to top, #fff1eb 0%, #dd504b 100%)",
    ];
    this._title = ["Books", "Members", "WISHLIST", "Fun"];
    this._backgroundColor = ["#0c3aa5", "#f1ca0b", "#039754", "#ab181b"];
    // bottom-left
    this.$bottomLeft = document.querySelector('.bottom-left');
    this._index = 0;
    this.scroll = this.scroll.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    /* 4. 드래그 앤 드롭 */
    this._shiftX = null;
    this._shiftY = null;
    this.$user = document.getElementById('user');
    // 로그인했다면 id, 아니면 null
    // 이렇게 해야 로그인 안 됐을때 오류 없어. this.$user이 없다면 dataset을 읽을 수 없어 멈춤
    this._userId = this.$user && this.$user.dataset.userId;
    this._loggedIn = !this._userId ? false : true;
    this.dragDrop = this.dragDrop.bind(this);
    this.pointermove = this.pointermove.bind(this);
    this.pointerup = this.pointerup.bind(this);
    this.$user && this.$user.addEventListener('pointerdown', this.dragDrop);
    /* --------------------------------------------------------------------------------------------------------- */
    /* 5. 회원가입이나 로그인 오류 시 alert함수 */
    this.searchParams = new URL(location.href).searchParams;
    this.alert = this.alert.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    /* 6. 위시리스트 선택 폼 */
    this.$wishlist = document.getElementById('wishlist');
    this.$wishCancel = document.querySelector('.wishlist-cancel');
    this.$wishCancel.onclick = this.wishCancel.bind(this);
    this.$wishForm = document.querySelector('.wishlist');
    this.$wishForm.onsubmit = this.wishlist.bind(this);
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 1. 폼 등장
  showForm(e) {
    const target = e.target.closest('.top-left__btn');
    if(!target) return;
    const form = target.dataset.form;
    this.$form = document.getElementById(`${form}`);
    this.$form.classList.add('show');
  }
  // 1. 폼 사라지기
  disappearForm(e) {
    const form = e.currentTarget.closest('.form-target');
    form.classList.remove('show');
  }
  /* ---------------------------------------------------------------------------------------------------------------------------------------- */
  // 3. 스크롤
  scroll() {
    if(window.pageYOffset >= this._start && window.pageYOffset < this._step) {
      this._index = 0;
      this.change(this._index);
    } else if(window.pageYOffset >= this._step && window.pageYOffset < (this._step * 2)) {
      this._index = 1;
      this.change(this._index);
    } else if(window.pageYOffset >= (this._step * 2) && window.pageYOffset < (this._step * 3)) {
      this._index = 2;
      this.change(this._index);
    } else if(window.pageYOffset >= (this._step * 3) && window.pageYOffset < this._end) {
      this._index = 3;
      this.change(this._index);
    }
  }
  change(index) {
    // 로그인 안 한 경우, null이 아닐때
    if(!this._loggedIn) {
      this.$btn.forEach(item => {
        item.style.backgroundColor = `${this._backgroundColor[index]}`;
      });
    }
    this.$topRight.style.backgroundImage = `${this._gradient[index]}`;
    this.$title.forEach(item => {
      item.textContent = `${this._title[index]}.`;
    });
    if(index === 2) {
      // wishlist...
      this.$title.forEach(item => {
        item.href = null;
        item.onclick = this.wishClick.bind(this);
      });
      this.$arrow.href = null;
    } else {
      this.$title.forEach(item => {
        item.href = `/${this._title[index].toLowerCase()}`;
        item.onclick = null;
      });
      this.$arrow.href = `/${this._title[index].toLowerCase()}`;  
    }
    this.$number.textContent = index + 1;
    this.$bottomLeft.style.backgroundColor = `${this._backgroundColor[index]}`;
  }
  // 위시리스트 클릭 시 폼 보여주기
  wishClick(e) {
    e.preventDefault();
    this.$wishlist.hidden = false;
  }
  wishCancel() {
    const radios = document.getElementsByName('wishlist');
    for(let radio of radios) {
      radio.checked = false;
    }
    this.$wishlist.hidden = true;
  }
  wishlist(e) {
    e.preventDefault();
    const id = +e.target.wishlist.value;
    this.wishCancel();
    window.location.href = `/wishlist/${id}`;
  }
  /* ---------------------------------------------------------------------------------------------------------------------------------------- */
  // user카드 드래그 앤 드롭
  dragDrop(e) {
    this._shiftX = e.clientX - this.$user.getBoundingClientRect().left;
    this._shiftY = e.clientY - this.$user.getBoundingClientRect().top;
    this.$user.style.zIndex = 1000;

    this.moveat(e.clientX, e.clientY);
    
    document.addEventListener('pointermove', this.pointermove);
    this.$user.addEventListener('pointerup', this.pointerup);
    this.$user.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  }
  moveat(clientX, clientY) {
    this.$user.style.left = clientX - this._shiftX + 'px';
    this.$user.style.top = clientY - this._shiftY + 'px';
  }
  pointermove(e) {
    this.moveat(e.clientX, e.clientY);
  }
  pointerup() {
    document.removeEventListener('pointermove', this.pointermove);
    this.$user.removeEventListener('pointerup', this.pointerup);
  }
  /* ---------------------------------------------------------------------------------------------------------------------------------------- */
  // 5. 회원가입이나 로그인 오류 시 alert함수
  alert() {
    if(this.searchParams.has('signup')) {
      switch(this.searchParams.get('signup')) {
        case 'exist':
          alert('이미 존재하는 이메일입니다.');
          break;
        case 'success':
          alert(`회원가입이 완료되었습니다! 로그인을 진행해주세요.`);
          break;
        case 'blank':
          alert(`빈칸을 모두 채워주세요.`);
          break;
      }
      return;
    } else if(this.searchParams.has('login')) {
      if(this.searchParams.get('login') === 'success') {
        alert(`로그인 완료!`);
        return;
      } else if(this.searchParams.get('login') === 'blank') {
        alert(`빈칸을 모두 채워주세요.`);
        return;
      } else {
        alert(`${this.searchParams.get('login')}`);
        return;
      }
    } else if(this.searchParams.has('logout')) {
      if(this.searchParams.get('logout') === 'success') {
        alert(`로그아웃 완료!`);
        return;
      }
    } 
  }
}

const index = new Index();
window.addEventListener('scroll', index.scroll);
window.addEventListener('load', index.alert);

