class Index {
  constructor() {
    this.$body = document.querySelector('body');
    this.$main = document.getElementById('main');
    this.start = this.$body.offsetTop + 400;
    this.end = this.$body.offsetHeight - document.documentElement.clientHeight;
    this.step = (this.end - this.start) / 4;

    this.$mainTopRight = document.querySelector('.main__top-right');
    this.$mainClickLogin = document.querySelector('.main__top-left__click__login');
    this.$mainClickSignup = document.querySelector('.main__top-left__click__signup');
    this.$mainTitle1 = document.querySelector('.main__top-right__title1');
    this.$mainTitle2 = document.querySelector('.main__top-right__title2');
    this.$mainTopNumber = document.querySelector('.main__top-right__current');
    this.$mainTopScroll = document.querySelector('.main__top-right__contents__scroll');
    this.$mainBottomLeft = document.querySelector('.main__bottom-left');
    this.$cancelBtns = document.querySelectorAll('.cancel');
    this.$formTarget = null;
    this.colorIndex = 0;
    this.mainTopScrollY = this.$mainTopRight.offsetHeight - this.$mainTopScroll.offsetHeight - 20; // 20은 위아래 여백
    console.log(this.mainTopScrollY)

    this.topright = ["linear-gradient(to top, #fff1eb 0%, #3fa7f3 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #edd649 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #f3861a 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #de3d1f 100%)"];
    this.title = ["Books", "Members", "Meetings", "Fun"];
    this.bottomleft = ["#0c3aa5", "#f1ca0b", "#f06312", "#ab181b"];

    this.scroll = this.scroll.bind(this);
    this.pointerenter = this.pointerenter.bind(this);
    this.pointerleave = this.pointerleave.bind(this);
    this.cancelBtn = this.cancelBtn.bind(this);
    this.showForm = this.showForm.bind(this);

    this.$mainClickLogin.addEventListener('pointerenter', this.pointerenter);
    this.$mainClickSignup.addEventListener('pointerenter', this.pointerenter);

    this.$mainClickLogin.addEventListener('click', this.showForm);
    this.$mainClickSignup.addEventListener('click', this.showForm);
    this.$cancelBtns.forEach(btn => {
      btn.addEventListener('click', this.cancelBtn);
    });

    document.documentElement.style.setProperty('--main-scroll-y', this.mainTopScrollY + 'px');
  }

  scroll() {
    if(window.pageYOffset >= this.start && window.pageYOffset < this.step) {
      this.colorIndex = 0;
      this.changeColor(this.colorIndex);
      this.changeNumber(this.colorIndex + 1);
    } else if(window.pageYOffset >= this.step && window.pageYOffset < (this.step * 2)) {
      this.colorIndex = 1;
      this.changeColor(this.colorIndex);
      this.changeNumber(this.colorIndex + 1);
    } else if(window.pageYOffset >= (this.step * 2) && window.pageYOffset < (this.step * 3)) {
      this.colorIndex = 2;
      this.changeColor(this.colorIndex);
      this.changeNumber(this.colorIndex + 1);
    } else if(window.pageYOffset >= (this.step * 3) && window.pageYOffset < this.end) {
      this.colorIndex = 3;
      this.changeColor(this.colorIndex);
      this.changeNumber(this.colorIndex + 1);
    }
  }

  changeColor(index) {
    this.$mainTopRight.style.backgroundImage = `${this.topright[index]}`;
    this.$mainClickLogin.style.backgroundColor = `${this.bottomleft[index]}`;
    this.$mainClickLogin.style.color = `${this.bottomleft[index]}`;
    this.$mainClickSignup.style.backgroundColor = `${this.bottomleft[index]}`;
    this.$mainClickSignup.style.color = `${this.bottomleft[index]}`;
    this.$mainTitle1.textContent = `${this.title[index]}.`;
    this.$mainTitle2.textContent = `${this.title[index]}.`;
    this.$mainTitle1.href = `/${this.title[index][0].toLowerCase() + this.title[index].slice(1)}`;
    this.$mainTitle2.href = `/${this.title[index][0].toLowerCase() + this.title[index].slice(1)}`;
    this.$mainBottomLeft.style.backgroundColor = `${this.bottomleft[index]}`;
  }

  changeNumber(index) {
    this.$mainTopNumber.textContent = index;
  }

  pointerenter(e) {
    e.currentTarget.style.color = `white`;
    e.currentTarget.addEventListener('pointerleave', this.pointerleave);
  }

  pointerleave(e) {
    e.currentTarget.style.color = `${this.bottomleft[this.colorIndex]}`;
  }

  showForm(e) {
    this.$formTarget = document.getElementById(`${e.currentTarget.dataset.type}`);
    this.$formTarget.classList.add('show');
  }

  cancelBtn(e) {
    this.$formTarget = e.currentTarget.closest('.form-target');
    this.$formTarget.classList.remove('show');
  }
}

const index = new Index();
window.addEventListener('scroll', index.scroll);