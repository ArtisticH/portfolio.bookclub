class Tournament {
  constructor() {
    this._id = new URL(location.href).pathname.split('/')[2];
    // 몇 라운드인지 클릭했는지
    this._round = +new URL(location.href).pathname.split('/')[3];
    this._memberId = +new URL(location.href).pathname.split('/')[4];
    this._title = document.querySelector('.tournament-title').textContent;
    this.$tournament = document.getElementById('tournament');
    // 서버에서 보내온 배열
    this._original = JSON.parse(this.$tournament.dataset.original);
    // 이미지 경로할때 필요, 오디오 경로할때 필요
    this._model = this.$tournament.dataset.model;
    // types에 따라 노래, sub 노출할지 안할지 결정
    this._types = this.$tournament.dataset.types;
    this._random = null;
    this._main = [];
    this._sub = [];
    // tem은 임시로, 현재 라운드에서 선택된 애들을 담아두고 다음 라운드 갈때 위의 아이들로 교체한다.
    this._temRandom = [];
    this._temMain = [];
    this._temSub = [];
    this._final = false;
    // HTML에 반영
    this.$top = document.querySelector('.tournament-box.top');
    this.$bottom = document.querySelector('.tournament-box.bottom');
    this.$topImg = document.querySelector('.tournament-img.top');
    this.$bottomImg = document.querySelector('.tournament-img.bottom');
    this.$topMain = document.querySelector('.tournament-main.top');
    this.$bottomMain = document.querySelector('.tournament-main.bottom');
    this.$topSub = document.querySelector('.tournament-sub.top');
    this.$bottomSub = document.querySelector('.tournament-sub.bottom');
    this.$topAudio = document.querySelector('.tournament-audio.top');
    this.$bottomAudio = document.querySelector('.tournament-audio.bottom');
    this.$topPlay = document.querySelector('.play-btn.top');
    this.$bottomPlay = document.querySelector('.play-btn.bottom');
    this.$topPause = document.querySelector('.pause-btn.top');
    this.$bottomPause = document.querySelector('.pause-btn.bottom');
    this.$plays = Array.from(document.querySelectorAll('.play-btn'));
    this.$pauses = Array.from(document.querySelectorAll('.pause-btn'));
    // 플레이 버튼 클릭 시 노래 재생
    // 멈춤으로 바꾼다.
    this.play = this.play.bind(this);
    this.$plays.forEach(play => {
      play.addEventListener('click', this.play);
    })
    // 멈춤 클릭 시 노래 중지하고, 플레이로 바꾸기
    this.pause = this.pause.bind(this);
    this.$pauses.forEach(pause => {
      pause.addEventListener('click', this.pause);
    })
    // 오디오 재생이 끝나면 처음으로 감고 play버튼으로 복귀
    this.ended = this.ended.bind(this);
    [this.$topAudio, this.$bottomAudio].forEach(audio => {
      audio.addEventListener('ended', this.ended);
    })
    // 클릭
    this.$boxes = Array.from(document.querySelectorAll('.tournament-img-box'));
    this.clickBox = this.clickBox.bind(this);
    this.$boxes.forEach(box => {
      box.addEventListener('click', this.clickBox);
    })
    // 토너먼트
    this._currentIter = null;
    this._totalIter = null;
    this._index = null;
    this.$total = document.querySelector('.round-total');
    this.$current = document.querySelector('.round-current');
    this.$round = document.querySelector('.tournament-round');
    // 파이널
    this.$final = document.getElementById('final');
    this.$finalImg = document.querySelector('.final-img');
    this.$finalTitle = document.querySelector('.final-title');
    this.$finalMain = document.querySelector('.final-main');
    this.$finalSub = document.querySelector('.final-sub');
    // 이미지 다운로드
    this.$finalImgOpt = document.querySelector('.final-option.img');

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
      this._main[this._main.length] = this._original[item].main;
      this._sub[this._sub.length] = this._original[item].sub;
    });
  }
  // 타입별 노출 요소 선택
  types() {
    if(this._types !== 'basic') {
      this.$topAudio.hidden = false;
      this.$bottomAudio.hidden = false;
      this.$topSub.hidden = false;
      this.$bottomSub.hidden = false;
      this.$topPlay.hidden = false;
      this.$bottomPlay.hidden = false;
    } 
  }
  play(e) {
    const direction = e.currentTarget.classList[1];
    if(direction === 'top') {
      this.$topPlay.hidden = true;
      this.$topAudio.play();
      this.$topPause.hidden = false;
    } else if(direction === 'bottom') {
      this.$bottomPlay.hidden = true;
      this.$bottomAudio.play();
      this.$bottomPause.hidden = false;
    }
  }
  pause(e) {
    const direction = e.currentTarget.classList[1];
    if(direction === 'top') {
      this.$topPause.hidden = true;
      this.$topAudio.pause();
      this.$topPlay.hidden = false;
    } else if(direction === 'bottom') {
      this.$bottomPause.hidden = true;
      this.$bottomAudio.pause();
      this.$bottomPlay.hidden = false;
    }
  }
  ended(e) {
    const direction = e.currentTarget.classList[1];
    if(direction === 'top') {
      this.$topPause.hidden = true;
      this.$topAudio.currentTime = 0;
      this.$topPlay.hidden = false;
    } else if(direction === 'bottom') {
      this.$bottomPause.hidden = true;
      this.$bottomAudio.currentTime = 0;
      this.$bottomPlay.hidden = false;
    }
  }
  // 위쪽의 요소
  top(index) {
    if(this._types !== 'basic') {
      this.$topAudio.src = `/audio/${this._model}/${this._main[index]}.mp3`;
      this.$topSub.textContent = this._sub[index];
    }
    this.$topImg.src = `/img/${this._model}/${this._main[index]}.jpeg`;
    this.$topMain.textContent = this._main[index];
  }
  // 아래쪽 요소
  bottom(index) {
    if(this._types !== 'basic') {
      this.$bottomAudio.src = `/audio/${this._model}/${this._main[index]}.mp3`;
      this.$bottomSub.textContent = this._sub[index];
    }
    this.$bottomImg.src = `/img/${this._model}/${this._main[index]}.jpeg`;
    this.$bottomMain.textContent = this._main[index];
  }

  round(cur, total) {
    this.$current.textContent = cur;
    this.$total.textContent = total;
  }

  tournament(index) {
    this.$topPlay.hidden = false;
    this.$topPause.hidden = true;
    this.$bottomPlay.hidden = false;
    this.$bottomPause.hidden = true;
    this.top(index);
    this.bottom(index + 1);
  }
  // 만약 처음에 뽑히거나, 다음 라운드에 진출하거나 그러면 selected를 ++;
  selected(base) {
    base.forEach(item => {
      this._original[item].selected++;
    })
  }  
  // 박스 클릭
  // 클릭 시 top이면 index 0, 2, 4, 등이고 this._index
  // 클릭 시 bottom이면 index 1, 3, 5, ..등의 홀수 this._index + 1의 값
  clickBox(e) {
    const direction = e.currentTarget.classList[1];
    // 클릭 된 정보 저장
    // 일단 클릭 된 놈의 win++;
    // 이런건 다 this._original에 저장, 이게 나중에 서버로 보내서 합칠 놈임.
    let index;
    if(direction === 'top') {
      // 만약 위쪽이면 현재 this._index
      index = this._random[this._index];
    } else if(direction === 'bottom') {
      // 아래면 this._index + 1
      index = this._random[this._index + 1];
    }
    if(this._final) {
      // 파이널이라면 파이널 찍고 탈출
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
    this._index += 2;;
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
    const res = await axios.post(`/favorite/final`, {
      original: JSON.stringify(this._original),
      id: this._id,
      MemberId: this._memberId,
      main: this._original[index].main,
      sub: this._original[index].sub,
    });
    // 싹 다 엎고 final 보여주기
    this.$tournament.hidden = true;
    this.$final.hidden = false;
    this.$finalImg.src = `/img/${this._model}/${this._original[index].main}.jpeg`;
    this.$finalTitle.textContent = this._title;
    this.$finalMain.textContent = this._original[index].main;
    this.$finalSub.textContent = this._original[index].sub;
    this.$finalImgOpt.href = `/img/${this._model}/${this._original[index].main}.jpeg`;
    this.$finalImgOpt.download = `${this._original[index].main}.jpeg`;
  }

  init() {
    // 타입별로 나타나야 할 요소들
    this.types();
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
}

const tournament = new Tournament();
tournament.init();

