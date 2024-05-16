class Open {
  constructor() {
    this.$title = document.querySelector('.open-title');
    this._text = this.$title.innerHTML;
    this._length = this._text.length;
  }

  animate({timing, draw, duration}) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      let progress = timing(timeFraction)
      draw(progress);
      if (timeFraction < 1) {
        requestAnimationFrame(animate.bind(this));
      }
    }.bind(this));
  }

  init() {
    // 텍스트 애니메이션 효과
    this.animate({
      duration: 2000,
      timing(timeFraction) {
        return timeFraction;
      },
      draw: (progress) => {
        this.$title.innerHTML = this._text.slice(0, this._length * progress);
      }
    });  
  }
}

const open = new Open();
// open.init();
// setInterval(() => {
//   open.init();
// }, 4000)
