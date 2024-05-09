class Tournament {
  constructor() {
    this._id = new URL(location.href).pathname.split('/')[2];
    this._round = +new URL(location.href).pathname.split('/')[3];
    // 서버에서 보내온 배열
    this.$tournament = document.getElementById('tournament');
    this._original = JSON.parse(this.$tournament.dataset.original);
    this._model = this.$tournament.dataset.model;
    this._types = this.$tournament.dataset.types;
    this._random = null;
    this._idArr = [];
    this._main = [];
    this._sub = [];
    // HTML에 반영
    this.$top = document.querySelector('.tournament-box.top');
    this.$bottom = document.querySelector('.tournament-box.bottom');
    this.$topImg = document.querySelector('.tournament-img.top');
    this.$bottomImg = document.querySelector('.tournament-img.bottom');
    this.$topMain = document.querySelector('.tournament-main.top');
    this.$bottomMain = document.querySelector('.tournament-main.bottom');
    this.$topSub = document.querySelector('.tournament-sub.top');
    this.$bottomSub = document.querySelector('.tournament-sub.bottom');
  }
  // 0에서 31의 수 중에서 몇개(라운드)만큼 랜덤으로 뽑기
  // 예를 들어 [4, 17, 25, 30, ...]
  random(round) {
    const arr = [];
    while(true) {
      const number = Math.floor(Math.random() * 32);
      if(arr.indexOf(number) === -1) {
        arr[arr.length] = number;
      } 
      if(arr.length == round) break;
    }
    return arr;
  }
  // 랜덤 배열 숫자에 맞게 main과 sub배열을 각각 생산하기
  // 랜덤 배열 숫자는 0부터 31까지의 인덱스를 의미하고, 
  // 서버에서 온 32개의 배열을 랜덤 생성된 인덱스 순서대로 재정리
  filterOriginal() {
    this._random.forEach(item => {
      this._idArr[this._idArr.length] = this._original[item].id;
      this._main[this._main.length] = this._original[item].main;
      this._sub[this._sub.length] = this._original[item].sub;
    });
  }

  init() {
    // 랜덤 숫자 배열 만들고
    this._random = this.random(this._round);
    // 랜덤 숫자를 인덱스로 해서 this._main, this._sub 배열 만든다.
    this.filterOriginal();
  }
  // 위쪽의 요소
  top(index) {
    this.$topImg.src = `/img/${this._model}/${this._main[index]}.jpeg`;
    this.$topMain.textContent = this._main[index];
    this.$topSub.textContent = this._sub[index];
  }
  // 아래쪽 요소
  bottom(index) {
    this.$bottomImg.src = `/img/${this._model}/${this._main[index]}.jpeg`;
    this.$bottomMain.textContent = this._main[index];
    this.$bottomSub.textContent = this._sub[index];
  }
}

const tournament = new Tournament();
tournament.init();

