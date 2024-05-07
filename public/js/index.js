class Index {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. LOG IN, SIGN UP 폼 등장, 사라지기
    this.$formTarget = null;
    // 이벤트 위임
    this.$formBtns = document.querySelector('.main__top-left__click');
    this.showForm = this.showForm.bind(this);
    this.disappearForm = this.disappearForm.bind(this);
    // 로그인한 상태라면 $formBtns요소는 없으니까
    this.$formBtns && this.$formBtns.addEventListener('click', this.showForm);
    // 폼 취소 버튼
    this.$cancelBtns = document.querySelectorAll('.cancel');
    this.$cancelBtns.forEach(btn => {
      btn.addEventListener('click', this.disappearForm);
    });    
    /* --------------------------------------------------------------------------------------------------------- */
    /* 2. min-width: 650px 이상일때 scroll 글자 떠내려오는 효과 */
    this.$topRight = document.querySelector('.main__top-right');
    this.$scrollText = document.querySelector('.main__top-right__contents__scroll');
    // 내려올 거리: (.main__top-right의 높이) - (text높이) - (위의 top: 10px)
    this._downDistance = this.$topRight.offsetHeight - this.$scrollText.offsetHeight - 10; 
    // CSS의 변수 설정
    document.documentElement.style.setProperty('--downDistance', this._downDistance + 'px');
    /* --------------------------------------------------------------------------------------------------------- */
    /* 3. scroll */
    this.$body = document.querySelector('body');
    // this.$body.offsetTop은 0;
    this._start = this.$body.offsetTop + 400; 
    this._end = this.$body.offsetHeight - document.documentElement.clientHeight;
    // 카테고리가 4개라서
    this._step = (this._end - this._start) / 4; 
    // 스크롤에 맞춰 색상이나 텍스트가 변하는 요소들
    // main__top-left
    this.$loginBtn = document.querySelector('.main__top-left__click__login');
    this.$signupBtn = document.querySelector('.main__top-left__click__signup');
    // main__top-right
    this.$title = document.querySelector('.main__top-right__title1');
    this.$titleItalic = document.querySelector('.main__top-right__title2');
    this.$arrow = document.querySelector('.main__top-right__arrow');
    this.$number = document.querySelector('.main__top-right__currents__number');
    // main__bottom-left
    this.$bottomLeft = document.querySelector('.main__bottom-left');
    // main__top-right 배경화면
    this._gradient = [
    "linear-gradient(to top, #fff1eb 0%, #3fa7f3 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #edd649 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #99d1a2 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #dd504b 100%)",
  ];
    // main__top-right 타이틀
    // /books, /members, /wishlist, /fun 으로 연결, routes/page.js
    this._title = ["Books", "Members", "WISHLIST", "Fun"];
    // main__bottom-left 색상
    this._backgroundColor = ["#0c3aa5", "#f1ca0b", "#039754", "#ab181b"];
    this._index = 0;
    // 이벤트 핸들러 this에 인스턴스 할당
    this.scroll = this.scroll.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    /* 4. userCard 드래그 앤 드롭 */
    this._shiftX = null;
    this._shiftY = null;
    this.$user = document.getElementById('user');
    // 로그인했다면 id, 아니면 null
    this._userId = this.$user && this.$user.dataset.userId;
    this.dragDrop = this.dragDrop.bind(this);
    this.$user && this.$user.addEventListener('pointerdown', this.dragDrop);
    this.pointermove = this.pointermove.bind(this);
    this.pointerup = this.pointerup.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    /* 5. 회원가입이나 로그인 오류 시 alert함수 */
    this.searchParams = new URL(location.href).searchParams;
    this.alert = this.alert.bind(this);
  }

  /* --------------------------------------------------------------------------------------------------------- */
  // 1 - 1. LOG IN, SIGN UP 폼 등장
  showForm(e) {
    // 버블링 잡아내기
    const target = e.target.closest('.main__top-left__btn');
    if(!target) return;
    // id가 login 아니면 signup인 폼 찾기
    const form = target.dataset.form;
    this.$formTarget = document.getElementById(`${form}`);
    this.$formTarget.classList.add('show');
  }
  // 1 - 2. LOG IN, SIGN UP 폼 사라지기
  disappearForm(e) {
    // cancelBtn에서 올라가 폼 전체를 가리키기
    this.$formTarget = e.currentTarget.closest('.form-target');
    this.$formTarget.classList.remove('show');
  }
  /* ---------------------------------------------------------------------------------------------------------------------------------------- */
  // 3 - 1. 스크롤 효과
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
  // 3 - 2. 스크롤 효과
  change(index) {
    // main__top-left
    this.$loginBtn && (this.$loginBtn.style.backgroundColor = `${this._backgroundColor[index]}`);
    this.$signupBtn && (this.$signupBtn.style.backgroundColor = `${this._backgroundColor[index]}`);
    // main__top-right
    this.$topRight.style.backgroundImage = `${this._gradient[index]}`;
    this.$title.textContent = `${this._title[index]}.`;
    this.$titleItalic.textContent = `${this._title[index]}.`;
    // Books -> books
    if(index === 2) {
      // /wishlist/1처럼 user.id여야..
      // 로그인 안 한 상태에서 클릭하면 /wishlist/null이 되는데
      // 그렇게 하면 alert함수 뜨도록, 
      this.$title.href = `/${this._title[index].toLowerCase()}/${this._userId}`;
      this.$titleItalic.href = `/${this._title[index].toLowerCase()}/${this._userId}`;
      // 화살표
      this.$arrow.href = `/${this._title[index].toLowerCase()}/${this._userId}`;  
    } else {
      this.$title.href = `/${this._title[index].toLowerCase()}`;
      this.$titleItalic.href = `/${this._title[index].toLowerCase()}`;
      // 화살표
      this.$arrow.href = `/${this._title[index].toLowerCase()}`;  
    }
    this.$number.textContent = index + 1;
    // main__bottom-left
    this.$bottomLeft.style.backgroundColor = `${this._backgroundColor[index]}`;
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
      }
    } else if(this.searchParams.has('login')) {
      if(this.searchParams.get('login') === 'success') {
        alert(`로그인 완료!`);
      } else {
        alert(`${this.searchParams.get('login')}`);
      }
    } else if(this.searchParams.has('logout')) {
      if(this.searchParams.get('logout') === 'success') {
        alert(`로그아웃 완료!`);
      }
    } else if(this.searchParams.has('wishlist')) {
      if(this.searchParams.get('wishlist') === 'login') {
        alert(`로그인 후 이용 가능합니다.`);
      }
    }
  }
}

const index = new Index();
window.addEventListener('scroll', index.scroll);
window.addEventListener('load', index.alert);

