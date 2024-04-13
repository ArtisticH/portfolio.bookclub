class Index {
  constructor() {
    this.$body = document.querySelector('body');
    this.$main = document.getElementById('main');
    this.start = this.$body.offsetTop + 100;
    this.end = this.$body.offsetHeight - document.documentElement.clientHeight;
    this.step = (this.end - this.start) / 4;

    this.$mainTopRight = document.querySelector('.main__top-right');
    this.$mainClickLogin = document.querySelector('.main__top-left__click__login');
    this.$mainClickSignup = document.querySelector('.main__top-left__click__signup');
    this.$mainTitle1 = document.querySelector('.main__top-right__title1');
    this.$mainTitle2 = document.querySelector('.main__top-right__title2');
    this.$mainBottomLeft = document.querySelector('.main__bottom-left');

    this.colorIndex = null;

    this.topright = ["linear-gradient(to top, #fff1eb 0%, #3fa7f3 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #edd649 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #f3861a 100%)", 
    "linear-gradient(to top, #fff1eb 0%, #de3d1f 100%)"];
    this.title = ["Books.", "Members.", "Meetings.", "Fun."];
    this.bottomleft = ["#0c3aa5", "#f1ca0b", "#f06312", "#ab181b"];

    this.scroll = this.scroll.bind(this);
    this.pointerenter = this.pointerenter.bind(this);
    this.pointerleave = this.pointerleave.bind(this);
    this.$mainClickLogin.addEventListener('pointerenter', this.pointerenter);
    this.$mainClickSignup.addEventListener('pointerenter', this.pointerenter);
  }

  scroll() {
    if(window.pageYOffset >= this.start && window.pageYOffset < this.step) {
      this.colorIndex = 0;
      this.changeColor(this.colorIndex);
    } else if(window.pageYOffset >= this.step && window.pageYOffset < (this.step * 2)) {
      this.colorIndex = 1;
      this.changeColor(this.colorIndex);
    } else if(window.pageYOffset >= (this.step * 2) && window.pageYOffset < (this.step * 3)) {
      this.colorIndex = 2;
      this.changeColor(this.colorIndex);
    } else if(window.pageYOffset >= (this.step * 3) && window.pageYOffset < this.end) {
      this.colorIndex = 3;
      this.changeColor(this.colorIndex);
    }
  }

  changeColor(index) {
    this.$mainTopRight.style.backgroundImage = `${this.topright[index]}`;
    this.$mainClickLogin.style.backgroundColor = `${this.bottomleft[index]}`;
    this.$mainClickLogin.style.color = `${this.bottomleft[index]}`;
    this.$mainClickSignup.style.backgroundColor = `${this.bottomleft[index]}`;
    this.$mainClickSignup.style.color = `${this.bottomleft[index]}`;
    this.$mainTitle1.textContent = `${this.title[index]}`;
    this.$mainTitle2.textContent = `${this.title[index]}`;
    this.$mainBottomLeft.style.backgroundColor = `${this.bottomleft[index]}`;
  }

  pointerenter(e) {
    e.currentTarget.style.color = `white`;
    e.currentTarget.addEventListener('pointerleave', this.pointerleave);
  }

  pointerleave(e) {
    e.currentTarget.style.color = `${this.bottomleft[this.colorIndex]}`;
  }
}

const index = new Index();
window.addEventListener('scroll', index.scroll);