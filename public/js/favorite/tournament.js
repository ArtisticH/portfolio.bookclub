class Tournament {
  constructor() {
    // 카테고리 아이디
    this._id = +new URL(location.href).pathname.split('/')[2];
    // 몇 라운드인지 클릭했는지
    this._round = +new URL(location.href).pathname.split('/')[3];
    this.$tournament = document.getElementById('tournament');
    // 서버에서 보내온 배열, 0, 0, 0으로 초기화되어있음.
    this._original = JSON.parse(this.$tournament.dataset.original);
    // 이미지, 오디오 폴더 이름, 개인 이름은 main임
    this._model = this.$tournament.dataset.model;
    // types에 따라 오디오 결정
    this._types = this.$tournament.dataset.types;
    // 랜덤으로 추출한 0부터 31까지의 숫자 배열
    this._random = null;
    // _original[랜덤 추출한 숫자]가 되어 main, sub따로 담기
    this._main = [];
    this._sub = [];
    // tem은 임시로, 현재 라운드에서 선택된 애들을 담아두고
    // 다음 라운드 진출 시 _main, _sub, _random의 값이 된다.
    this._temRandom = [];
    this._temMain = [];
    this._temSub = [];
    this._final = false;
    // HTML에 반영
    this.$topImg = document.querySelector('.tournament-img.top');
    this.$bottomImg = document.querySelector('.tournament-img.bot');
    this.$topMain = document.querySelector('.tournament-main.top');
    this.$bottomMain = document.querySelector('.tournament-main.bot');
    this.$topSub = document.querySelector('.tournament-sub.top');
    this.$bottomSub = document.querySelector('.tournament-sub.bot');
    this.$topAudio = document.querySelector('.tournament-audio.top');
    this.$bottomAudio = document.querySelector('.tournament-audio.bot');
    this.$audios = Array.from(document.querySelectorAll('.tournament-audio'));
    this.$topPlay = document.querySelector('.play-btn.top');
    this.$bottomPlay = document.querySelector('.play-btn.bot');
    this.$topPause = document.querySelector('.pause-btn.top');
    this.$bottomPause = document.querySelector('.pause-btn.bot');
    this.$plays = Array.from(document.querySelectorAll('.play-btn'));
    this.$pauses = Array.from(document.querySelectorAll('.pause-btn'));
    // 플레이 버튼 클릭 시 노래 재생하고 멈춤으로 바꾼다.
    this.play = this.play.bind(this);
    this.$plays && this.$plays.forEach(play => {
      play.addEventListener('click', this.play);
    });
    // 멈춤 클릭 시 노래 중지하고, 플레이로 바꾸기
    this.pause = this.pause.bind(this);
    this.$pauses && this.$pauses.forEach(pause => {
      pause.addEventListener('click', this.pause);
    });
    // 오디오 재생이 끝나면 처음으로 감고 play버튼으로 복귀
    this.ended = this.ended.bind(this);
    this.$audios && this.$audios.forEach(audio => {
      audio.addEventListener('ended', this.ended);
    });
    // 클릭
    this.$boxes = Array.from(document.querySelectorAll('.tournament-img-box'));
    this.clickBox = this.clickBox.bind(this);
    // A vs B 중에 선택
    this.$boxes.forEach(box => {
      box.addEventListener('click', this.clickBox);
    })
    // 토너먼트
    // 현재 반복? 1 / 16에서 1
    this._currentIter = null;
    // 전체 반복 갯수, 1 / 16에서 16
    this._totalIter = null;
    // +2씩 증가
    this._index = null;
    this.$total = document.querySelector('.round-total');
    this.$current = document.querySelector('.round-current');
    this.$round = document.querySelector('.tournament-round');
    // 파이널
    this.$final = document.getElementById('final');
    this.$finalImg = this.$final.querySelector('img');
    this.$finalMain = document.querySelector('.final-main');
    this.$finalSub = document.querySelector('.final-sub');
    // 이미지 다운로드
    this.$finalImgOpt = document.querySelector('.final-option.img');
  }
  init() {
    // 라운드에 맞는 랜덤 숫자 배열 만들고
    this._random = this.random(this._round);
    // 랜덤 숫자를 인덱스로 해서 this._main, this._sub 배열 만든다.
    this.filterOriginal();
    // 처음에 뽑힌 애들 selected 올려준다.
    this.selected(this._random);
    // 첫 번째 토너먼트를 시작, 만약 32강이면 16번 도는걸 시작
    this._index = 0;
    this._currentIter = 1;
    this._totalIter = this._round / 2; // 16
    this.round(this._currentIter, this._totalIter); // 1 / 16 대입
    // 처음에 0과 1을 인덱스로 요소들 보여주기
    this.tournament(this._index);
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
      if(arr.length === round) break;
    }
    return arr;
  }
  // 랜덤 배열 숫자에 맞게 main과 sub배열을 각각 생산하기
  // 랜덤 배열 숫자는 0부터 31까지의 인덱스를 의미하고, 
  // 서버에서 온 32개의 배열을 랜덤 생성된 인덱스 순서대로 재정리
  filterOriginal() {
    this._random.forEach(item => {
      this._main[this._main.length] = this._original[item].main;
      this._sub[this._sub.length] = this._original[item].sub;
    });
  }
  // 만약 처음에 뽑히거나, 다음 라운드에 진출하거나 그러면 selected를 ++;
  selected(arr) {
    arr.forEach(item => {
      this._original[item].selected++;
    })
  }   
  // 1 / 16, 2 / 16, 1 / 8...등 대입 
  round(cur, total) {
    this.$current.textContent = cur;
    this.$total.textContent = total;
  }
  bottomPause() {
    this.$bottomAudio.pause();
    this.$bottomPause.hidden = true;
    this.$bottomPlay.hidden = false;
  }
  bottomPlay() {
    this.$bottomPlay.hidden = true;
    this.$bottomPause.hidden = false;
    this.$bottomAudio.play();
  }
  topPause() {
    this.$topAudio.pause();
    this.$topPause.hidden = true;
    this.$topPlay.hidden = false;
  }
  topPlay() {
    this.$topPlay.hidden = true;
    this.$topPause.hidden = false;
    this.$topAudio.play();
  }
  play(e) {
    const direction = e.currentTarget.classList[1];
    if(direction === 'top') {
      // 위에 있는 노래 클릭 시 아래 재생되고 있는 노래 끊고
      // 이미지도 바꾸고
      this.bottomPause();
      this.topPlay();
    } else if(direction === 'bot') {
      this.topPause();
      this.bottomPlay();
    }
  }
  pause(e) {
    const direction = e.currentTarget.classList[1];
    if(direction === 'top') {
      this.topPause();
    } else if(direction === 'bot') {
      this.bottomPause();
    }
  }
  topEnded() {
    this.$topPause.hidden = true;
    this.$topAudio.currentTime = 0;
    this.$topPlay.hidden = false;
  }
  bottomEnded() {
    this.$bottomPause.hidden = true;
    this.$bottomAudio.currentTime = 0;
    this.$bottomPlay.hidden = false;
  }
  ended(e) {
    const direction = e.currentTarget.dataset.dir;
    if(direction === 'top') {
      this.topEnded();
    } else if(direction === 'bot') {
      this.bottomEnded();
    }
  }
  tournament(index) {
    this.topPause();
    this.bottomPause();
    this.top(index);
    this.bottom(index + 1);
  }
  // 위쪽의 요소
  top(index) {
    if(this._types === 'music') {
      this.$topAudio.src = `/audio/${this._model}/${this._main[index]}.mp3`;
    }
    this.$topImg.src = `/img/${this._model}/${this._main[index]}.jpeg`;
    this.$topMain.textContent = this._main[index];
    this.$topSub.textContent = this._sub[index];
  }
  // 아래쪽 요소
  bottom(index) {
    if(this._types === 'music') {
      this.$bottomAudio.src = `/audio/${this._model}/${this._main[index]}.mp3`;
    }
    this.$bottomImg.src = `/img/${this._model}/${this._main[index]}.jpeg`;
    this.$bottomMain.textContent = this._main[index];
    this.$bottomSub.textContent = this._sub[index];
  }
  // 박스 클릭
  // 클릭 시 top이면 index 0, 2, 4, 등이고 this._index
  // 클릭 시 bottom이면 index 1, 3, 5, ..등의 홀수 this._index + 1의 값
  clickBox(e) {
    const direction = e.currentTarget.dataset.dir;
    // 클릭 된 정보 저장
    // 일단 클릭 된 놈의 win++;
    // 이런건 다 this._original에 저장, 이게 나중에 서버로 보내서 합칠 놈임.
    let index;
    if(direction === 'top') {
      // 만약 위쪽이면 현재 this._index
      index = this._random[this._index];
    } else if(direction === 'bot') {
      // 아래면 this._index + 1
      index = this._random[this._index + 1];
    }
    if(this._final) {
      // 파이널이라면 파이널 찍고 탈출
      this._original[index].win++;
      this._original[index].finalWin++;
      return this.final(index);
    }
    this._original[index].win++;
    this._original[index].selected++;
    // 임시 배열에 선택된 아이들 넣기
    this._temRandom[this._temRandom.length] = index;
    this._temMain[this._temMain.length] = this._original[index].main;
    this._temSub[this._temSub.length] = this._original[index].sub;
    // 다음으로
    this._index += 2;
    this._currentIter++;
    if(this._currentIter > this._totalIter) {
      // 다음 토너먼트로 넘어갈때 예를 들면 32강에서 16강으로..
      this._totalIter /= 2;
      this._currentIter = 1;
      this._index = 0;
      // 기준이 되는 this._main, this._sub도 바꾼다.
      this._main = this._temMain;
      this._sub = this._temSub;
      this._random = this._temRandom;
      this._temMain = [];
      this._temRandom = [];
      this._temSub = [];
    } 
    // 결승전이라면
    if(this._totalIter === 1) {
      this._final = true;
      // 1/ 32 대신 Final이라고 표기
      this.$round.textContent = 'Final';
    } else {
      this.round(this._currentIter, this._totalIter);
    }
    this.tournament(this._index);  
  }
  async final(index) {
    // 서버에 보내고, 
    // 기록하기, 
    // 새로운 HTML 보여주기,
    await axios.post(`/favorite/final`, {
      original: JSON.stringify(this._original),
      modelName: this._model,
    });
    this.showFinal(index);
  }
  showFinal(index) {
    this.$final.hidden = false;
    this.$finalImg.src = `/img/${this._model}/${this._original[index].main}.jpeg`;
    this.$finalMain.textContent = this._original[index].main;
    this.$finalSub.textContent = this._original[index].sub;
    this.$finalImgOpt.href = `/img/${this._model}/${this._original[index].main}.jpeg`;
    this.$finalImgOpt.download = `${this._original[index].main}.jpeg`;
    // 노래 재생되는거있으면 다 멈추기
    this.topPause();
    this.bottomPause();
  }
}

const tournament = new Tournament();
tournament.init();

