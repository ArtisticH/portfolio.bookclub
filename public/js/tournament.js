class Tournament {
  constructor() {
    this._id = new URL(location.href).pathname.split('/')[2];
    this._round = +new URL(location.href).pathname.split('/')[3];
    // 서버에서 보내온 배열
    this.$tournament = document.getElementById('tournament');
    this._original = JSON.parse(this.$tournament.dataset.original);
    this._model = this.$tournament.dataset.model;
    this._random = null;
    this._idArr = [];
    this._main = [];
    this._sub = [];
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
    this._random = this.random(this._round);
    this.filterOriginal();
  }
  // 위쪽의 요소
  top() {

  }
}

const tournament = new Tournament();
tournament.init();

