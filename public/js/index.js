class Index {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. LOG IN, SIGN UP 폼 등장, 사라지기
    this.$cancelBtns = document.querySelectorAll('.cancel');
    this.$formTarget = null;
    // 로그인한 상태에선 $main__top-left__click 요소가 없으니까 + 이벤트 위임
    this.$formRelatedBtn = document.querySelector('.main__top-left__click');
    this.funShowForm = this.funShowForm.bind(this);
    this.funDisappearForm = this.funDisappearForm.bind(this);
    this.$formRelatedBtn && this.$formRelatedBtn.addEventListener('click', this.funShowForm);
    this.$cancelBtns.forEach(btn => {
      btn.addEventListener('click', this.funDisappearForm);
    });    

    /* --------------------------------------------------------------------------------------------------------- */
    /* 2. min-width: 650px 이상일때 scroll 글자 떠내려오는 효과 */
    this.$mainTopRight = document.querySelector('.main__top-right');
    this.$scrollText = document.querySelector('.main__top-right__contents__scroll');
    // 내려올 거리: (.main__top-right의 높이) - (text높이) - (위의 top: 10px)
    this.downDistance = this.$mainTopRight.offsetHeight - this.$scrollText.offsetHeight - 10; 
    // CSS의 변수 설정
    document.documentElement.style.setProperty('--downDistance', this.downDistance + 'px');

    /* --------------------------------------------------------------------------------------------------------- */
    /* 3. scroll */
    this.$body = document.querySelector('body');
    // this.$body.offsetTop은 0;
    this.start = this.$body.offsetTop + 400; 
    this.end = this.$body.offsetHeight - document.documentElement.clientHeight;
    // 카테고리가 4개라서
    this.step = (this.end - this.start) / 4; 
    // 스크롤에 맞춰 색상이나 텍스트가 변하는 요소들
    // main__top-left
    this.$mainClickLogin = document.querySelector('.main__top-left__click__login');
    this.$mainClickSignup = document.querySelector('.main__top-left__click__signup');
    // main__top-right
    this.$mainTitle1 = document.querySelector('.main__top-right__title1');
    this.$mainTitle2 = document.querySelector('.main__top-right__title2');
    this.$mainTopNumber = document.querySelector('.main__top-right__currents__number');
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
    this.scrollIndex = null;
    // 이벤트 핸들러 this에 인스턴스 할당
    this.funScroll = this.funScroll.bind(this);
  }

  // 1. LOG IN, SIGN UP 폼 등장
  funShowForm(e) {
    const target = e.target.closest('.main__top-left__btn');
    if(!target) return;
    const formType = target.dataset.formType;
    this.$formTarget = document.getElementById(`${formType}`);
    this.$formTarget.classList.add('show');
  }
  // 1. LOG IN, SIGN UP 폼 사라지기
  funDisappearForm(e) {
    // cancelBtn에서 올라가 폼 전체를 가리키기
    this.$formTarget = e.currentTarget.closest('.form-target');
    this.$formTarget.classList.remove('show');
  }

  // 3. 스크롤 효과
  funScroll() {
    if(window.pageYOffset >= this.start && window.pageYOffset < this.step) {
      this.scrollIndex = 0;
      this.funChange(this.scrollIndex);
    } else if(window.pageYOffset >= this.step && window.pageYOffset < (this.step * 2)) {
      this.scrollIndex = 1;
      this.funChange(this.scrollIndex);
    } else if(window.pageYOffset >= (this.step * 2) && window.pageYOffset < (this.step * 3)) {
      this.scrollIndex = 2;
      this.funChange(this.scrollIndex);
    } else if(window.pageYOffset >= (this.step * 3) && window.pageYOffset < this.end) {
      this.scrollIndex = 3;
      this.funChange(this.scrollIndex);
    }
  }

  funChange(index) {
    // main__top-left
    this.$mainClickLogin && (this.$mainClickLogin.style.backgroundColor = `${this.bottomleftBackgroundColor[index]}`);
    this.$mainClickSignup && (this.$mainClickSignup.style.backgroundColor = `${this.bottomleftBackgroundColor[index]}`);
    // main__top-right
    this.$mainTopRight.style.backgroundImage = `${this.toprightBackgroundColor[index]}`;
    this.$mainTitle1.textContent = `${this.toprightTitle[index]}.`;
    this.$mainTitle2.textContent = `${this.toprightTitle[index]}.`;
    // Books -> books
    // arr.slice()는 배열 혹은 문자열 반환
    this.$mainTitle1.href = `/${this.toprightTitle[index][0].toLowerCase() + this.toprightTitle[index].slice(1)}`;
    this.$mainTitle2.href = `/${this.toprightTitle[index][0].toLowerCase() + this.toprightTitle[index].slice(1)}`;
    this.$mainTopNumber.textContent = index + 1;
    // main__bottom-left
    this.$mainBottomLeft.style.backgroundColor = `${this.bottomleftBackgroundColor[index]}`;
  }
}

const index = new Index();
window.addEventListener('scroll', index.funScroll);
