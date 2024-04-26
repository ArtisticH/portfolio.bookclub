class Index {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    /* scroll */
    this.$body = document.querySelector('body');
    this.start = this.$body.offsetTop + 400; // 사실상 this.$body.offsetTop은 0;
    this.end = this.$body.offsetHeight - document.documentElement.clientHeight;
    this.step = (this.end - this.start) / 4; // 요소가 4개니까
    // 스크롤에 맞춰 색상이나 텍스트가 변하는 요소들
    // main__top-left
    this.$mainClickLogin = document.querySelector('.main__top-left__click__login');
    this.$mainClickSignup = document.querySelector('.main__top-left__click__signup');
    this.$mainClickLogout = document.querySelector('.main__top-left__click__logout');
    // main__top-right
    this.$mainTopRight = document.querySelector('.main__top-right');
    this.$mainTitle1 = document.querySelector('.main__top-right__title1');
    this.$mainTitle2 = document.querySelector('.main__top-right__title2');
    this.$mainTopNumber = document.querySelector('.main__top-right__currents__number');
    this.$mainTopScroll = document.querySelector('.main__top-right__contents__scroll');
    // main__bottom-left
    this.$mainBottomLeft = document.querySelector('.main__bottom-left');
    // main__top-right 배경화면
    this.toprightBackgroundColor = [
    "linear-gradient(to top, #fff1eb 0%, #3fa7f3 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #edd649 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #f3861a 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #de3d1f 100%)"];
    // main__top-right 타이틀
    this.toprightTitle = ["Books", "Members", "Meetings", "Fun"];
    // main__bottom-left 색상
    this.bottomleftBackgroundColor = ["#0c3aa5", "#f1ca0b", "#f06312", "#ab181b"];
    this.colorIndex = 0;
    // 이벤트 핸들러 this에 인스턴스 할당
    this.scroll = this.scroll.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    /* LOG IN, SIGN UP enter, leave하면 색상 드러나는거 */
    this.authHoverEnter = this.authHoverEnter.bind(this);
    this.authHoverLeave = this.authHoverLeave.bind(this);
    this.$mainClickLogin && this.$mainClickLogin.addEventListener('pointerenter', this.authHoverEnter);
    this.$mainClickSignup && this.$mainClickSignup.addEventListener('pointerenter', this.authHoverEnter);
    /* --------------------------------------------------------------------------------------------------------- */
    /* min-width: 650px 이상일때 scroll 글자 떠내려오는 효과 */
    // .main__top-right 높이에서 위아래 10px여백 빼고 text 요소 높이 빼
    this.mainTopScrollY = this.$mainTopRight.offsetHeight - this.$mainTopScroll.offsetHeight - 20; 
    document.documentElement.style.setProperty('--main-scroll-y', this.mainTopScrollY + 'px');
    /* --------------------------------------------------------------------------------------------------------- */
    // LOG IN, SIGN UP 폼 등장
    this.showForm = this.showForm.bind(this);
    this.disappearForm = this.disappearForm.bind(this);
    this.$cancelBtns = document.querySelectorAll('.cancel');
    this.$formTarget = null;
    this.$mainClickLogin && this.$mainClickLogin.addEventListener('click', this.showForm);
    this.$mainClickSignup && this.$mainClickSignup.addEventListener('click', this.showForm);
    this.$cancelBtns.forEach(btn => {
      btn.addEventListener('click', this.disappearForm);
    });    
    /* --------------------------------------------------------------------------------------------------------- */
    /* signUpAlert */
    // this.signUpAlert = this.signUpAlert.bind(this);
    // this.$signupForm = document.querySelector('.signup');
    // this.$signupForm.addEventListener('submit', this.signUpAlert);
  }

  // 스크롤하면 Books, Members, Meetings, Fun의 화면을 보여주고 색상, 타이틀 변형
  scroll() {
    if(window.pageYOffset >= this.start && window.pageYOffset < this.step) {
      this.colorIndex = 0;
      this.scrollChange(this.colorIndex);
    } else if(window.pageYOffset >= this.step && window.pageYOffset < (this.step * 2)) {
      this.colorIndex = 1;
      this.scrollChange(this.colorIndex);
    } else if(window.pageYOffset >= (this.step * 2) && window.pageYOffset < (this.step * 3)) {
      this.colorIndex = 2;
      this.scrollChange(this.colorIndex);
    } else if(window.pageYOffset >= (this.step * 3) && window.pageYOffset < this.end) {
      this.colorIndex = 3;
      this.scrollChange(this.colorIndex);
    }
  }

  scrollChange(index) {
    // main__top-left
    this.$mainClickLogin && (this.$mainClickLogin.style.backgroundColor = `${this.bottomleftBackgroundColor[index]}`);
    this.$mainClickSignup && (this.$mainClickSignup.style.backgroundColor = `${this.bottomleftBackgroundColor[index]}`);
    this.$mainClickLogout && (this.$mainClickLogout.style.backgroundColor = `${this.bottomleftBackgroundColor[index]}`);
    // main__top-right
    this.$mainTopRight.style.backgroundImage = `${this.toprightBackgroundColor[index]}`;
    this.$mainTitle1.textContent = `${this.toprightTitle[index]}.`;
    this.$mainTitle2.textContent = `${this.toprightTitle[index]}.`;
    this.$mainTitle1.href = `/${this.toprightTitle[index][0].toLowerCase() + this.toprightTitle[index].slice(1)}`;
    this.$mainTitle2.href = `/${this.toprightTitle[index][0].toLowerCase() + this.toprightTitle[index].slice(1)}`;
    this.$mainTopNumber.textContent = index + 1;
    // main__bottom-left
    this.$mainBottomLeft.style.backgroundColor = `${this.bottomleftBackgroundColor[index]}`;
  }

  authHoverEnter(e) {
    e.currentTarget.classList.add('colored');
    e.currentTarget.addEventListener('pointerleave', this.authHoverLeave);
  }

  authHoverLeave(e) {
    e.currentTarget.classList.remove('colored');
  }

  showForm(e) {
    this.$formTarget = document.getElementById(`${e.currentTarget.dataset.formType}`);
    this.$formTarget?.classList.add('show');
  }

  disappearForm(e) {
    this.$formTarget = e.currentTarget.closest('.form-target');
    this.$formTarget.classList.remove('show');
  }
}

const index = new Index();
window.addEventListener('scroll', index.scroll);
