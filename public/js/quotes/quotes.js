class Quotes {
  constructor() {
    // 클릭에 맞는 박스 보여주기: 기본 이미지, 이미지 올리기, 폰트, 사이즈 등등..
    this.$opers = document.querySelector('.quotes-opers');
    this.$opers.onclick = this.operation.bind(this);
    this._type = null;
    // 세부 사항 설정 박스들
    this.$boxes = Array.from(document.querySelectorAll('.quotes-box'));
    // 박스의 내용 클릭할때
    this.$contents = Array.from(document.querySelectorAll('.quotes-box-contents'));
    this.clickContents = this.clickContents.bind(this);
    this.$contents.forEach(con => {
      con.addEventListener('click', this.clickContents);
    });
    // 1 : 1인지, 3 : 4인지,
    this.$imgBox = document.querySelector('.quotes-img-box');
    // 글자 색상
    this.$quotes = document.querySelector('.quotes-img-inputs-quotes');
    this.$from = document.querySelector('.quotes-img-inputs-from');
    // 입력된 글자가 표기되는 이미지 위의 상자
    this.$inputs = document.querySelector('.quotes-img-inputs');
    // 제출 시
    this.$inputForm = document.querySelector('.quotes-form.input');
    this.$inputForm.onsubmit = this.input.bind(this);
    // 기본 이미지 선택 시
    this.$basicForm = document.querySelector('.quotes-form.basic');
    this.$basicForm.onchange = this.basic.bind(this);
    // 직접 이미지 올릴때
    this.$userForm = document.querySelector('.quotes-form.user-img');
    this.$userForm.onchange = this.myImg.bind(this);
    // 취소 버튼 클릭 시 기본 상자 보여주기
    this.$cancelBtns = Array.from(document.querySelectorAll('.quotes-box-cancel'));
    this.cancel = this.cancel.bind(this);
    this.$cancelBtns.forEach(btn => {
      btn.addEventListener('click', this.cancel);
    });
    this.$noneBox = document.querySelector('.quotes-box.none');
    // 이미지 다운로드
    this.$download = document.querySelector('.quotes-download');
    this.$download.onclick = this.download.bind(this);
    this.$output = null;
    this.$link = document.getElementById('capture');
    // 리셋
    this.$reset = document.querySelector('.quotes-reset');
    this.$reset.onclick = this.reset.bind(this);
    // 클라우드
    this.$cloud = document.querySelector('.quotes-other.cloud');
    this.$cloudText = this.$cloud.querySelector('.quotes-other-text');
    this.$cloudBtns = this.$cloud.querySelector('.quotes-other-btns');
    this.$cloudOne = document.querySelector('.cloud-one');
    this.$cloudTwo = document.querySelector('.cloud-two');
    this.$cloudThree = document.querySelector('.cloud-three');
    this.$cloudBtns.onclick = this.cloud.bind(this);
    this._cloud = 0;
    this._cloudYes = [
      "Do you want to see Cloud?",
      "More Cloud?",
      "More Cloud??",
      "More Cloud???",
      "That's enough 😶‍🌫️",
    ];
    this._cloudNo = [
      "Ok, bye",
      "You have 1 Cloud 😢",
      "You have 2 Cloud 😢",
      "You have 3 Cloud 😢",
    ];
    this.resize = this.resize.bind(this);
    // 고양이
    this.$catImg = document.querySelector('.img-cat');
    this.$cat = document.querySelector('.quotes-other.cat');
    this.$catText = this.$cat.querySelector('.quotes-other-text');
    this.$catBtns = this.$cat.querySelector('.quotes-other-btns');
    this.$catBtns.onclick = this.cat.bind(this);
    // Reading Quotes
    this.$ReadingQuotes = document.querySelector('.quotes-other.quotes');
    this.$RQText = this.$ReadingQuotes.querySelector('.quotes-other-text');
    this.$RQFrom = this.$ReadingQuotes.querySelector('.quotes-other-from');
    this.$RQBtns = this.$ReadingQuotes.querySelector('.quotes-other-btns');
    this.$RQBtns.onclick = this.readingQuotes.bind(this);    
    this._readingQuotes = 0;
    this._rqText = [
      "Today a reader, tomorrow a leader.",
      "A word after a word after a word is power.",
      "Think before you speak. Read before you think.",
      "Writing and reading decrease our sense of isolation. They deepen and widen and expand our sense of life: They feed the soul.",
      "Books and doors are the same thing. You open them, and you go through into another world.",
      "Once you learn to read, you will be forever free.",
      "The reading of all good books is like a conversation with the finest minds of past centuries.",
      "Books may well be the only true magic.",
      "A reader lives a thousand lives before he dies . . . The man who never reads lives only one.",
      "No entertainment is so cheap as reading, nor any pleasure so lasting.",
    ];
    this._rqTextFrom = [
      "- Margaret Fuller -",
      "- Margaret Atwood -",
      "- Fran Lebowitz -",
      "- Anne Lamott -",
      "- Jeanette Winterson -",
      "- Frederick Douglass -",
      "- Rene Descartes -",
      "- Alice Hoffman -",
      "- George R.R. Martin -",
      "- Mary Wortley Montagu -"
    ];
  }
  // 버튼에 맞는 폼 보여주기
  operation(e) {
    const target = e.target.closest('.quotes-oper-box');
    if(!target) return;
    // 이미지, 폰트, 색상, 사이즈...
    this._type = target.dataset.type;
    this.changeBox(this._type);
  }
  // quotes-box basic처럼.. 
  // 한 가지만 보여주기
  changeBox(type) {
    this.$boxes.forEach(box => {
      if(box.classList[1] === type) {
        box.hidden = false;
      } else {
        box.hidden = true;
      }
    })
  }
  // 옵션들을 클릭할때
  // 예를 들어 this._type은 color, value는 black 아니면 white
  clickContents(e) {
    const target = e.target.closest('.quotes-box-con');
    if(!target) return;
    const value = target.dataset.value;
    switch(this._type) {
      case 'ratio':
        this.ratio(value);
        break;
      case 'font':
        this.font(value);
        break;  
      case 'size':
        this.size(value);
        break;
      case 'color':
        this.color(value);
        break;
    }
  }
  ratio(value) {
    if(value === '11') {
      this.$imgBox.style.aspectRatio = '1 / 1';
    } else if(value === '34') {
      this.$imgBox.style.aspectRatio = '3 / 4';
    }
  }
  color(value) {
    if(value === 'white') {
      this.$quotes.style.color = 'white';
      this.$from.style.color = 'white';
    } else if(value === 'black') {
      this.$quotes.style.color = '';
      this.$from.style.color = '';
    }
  }
  font(value) {
    if(value === 'basic') {
      this.$inputs.style.fontFamily = '';
    } else if(value === 'noto') {
      this.$inputs.style.fontFamily = 'var(--font-noto)';
    } else if(value === 'brush') {
      this.$inputs.style.fontFamily = 'var(--font-brush)';
    } else if(value === 'myeongjo') {
      this.$inputs.style.fontFamily = 'var(--font-myeongjo)';
    } else if(value === 'dokdo') {
      this.$inputs.style.fontFamily = 'var(--font-dokdo)';
    } else if(value === 'diphylleia') {
      this.$inputs.style.fontFamily = 'var(--font-diphylleia)';
    }
  }
  size(value) {
    if(value === 'small') {
      this.$quotes.style.fontSize = '1.4rem';
      this.$from.style.fontSize = '0.7rem';
      this.$quotes.style.letterSpacing = '-1.4px';
      this.$from.style.letterSpacing = '-0.7px';
    } else if(value === 'normal') {
      this.$quotes.style.fontSize = '';
      this.$from.style.fontSize = '';
      this.$quotes.style.letterSpacing = '';
      this.$from.style.letterSpacing = '';
    } else if(value === 'big') {
      this.$quotes.style.fontSize = '2rem';
      this.$from.style.fontSize = '1.2rem';
      this.$quotes.style.letterSpacing = '-2px';
      this.$from.style.letterSpacing = '-1.2px';
    } else if(value === 'verybig') {
      this.$quotes.style.fontSize = '2.8rem';
      this.$from.style.fontSize = '1.4rem';
      this.$quotes.style.letterSpacing = '-2.8px';
      this.$from.style.letterSpacing = '-1.4px';
    } 
  }
  // 이미지에 글자 입력되는 효과
  input(e) {
    e.preventDefault();
    const target = e.currentTarget;
    const quotes = target.quotes.value;
    const from = target.from.value;
    if(quotes.length === 0 || from.length === 0) {
      alert('모두 입력하세요.');
      return;
    }
    this.$quotes.textContent = quotes;
    this.$from.textContent = from;
    target.quotes.value = '';
    target.from.value = '';
  }
  // 기본 이미지 선택 시
  basic(e) {
    const value = e.target.value;
    this.$imgBox.style.backgroundImage = `url("/img/quotes/${value}.jpeg")`;
  }
  // 이미지 올릴때
  async myImg(e) {
    const target = e.currentTarget;
    const file = target.userimage.files[0];
    const formData = new FormData();
    formData.append('image', file);
    const res = await axios.post('/quotes/img', formData);
    this.$imgBox.style.backgroundImage = `url(${res.data.url})`;
  }
  // 취소 버튼 누르면 none 상태로 간다.
  cancel(e) {
    const box = e.target.closest('.quotes-box');
    box.hidden = true;
    this.$noneBox.hidden = false;
  }
  // 리셋 버튼 클릭 시
  reset() {
    // 텍스트 리셋
    this.$quotes.textContent = '';
    this.$from.textContent = '';
    // 이미지 리셋
    this.$imgBox.style.backgroundImage = `url("/img/quotes/one.jpeg")`;
    // 글자 사이즈 리셋
    this.$quotes.style.fontSize = '';
    this.$from.style.fontSize = '';
    this.$quotes.style.letterSpacing = '';
    this.$from.style.letterSpacing = '';
    // 폰트 리셋
    this.$inputs.style.fontFamily = '';
    // 글자 색상 리셋
    this.$quotes.style.color = '';
    this.$from.style.color = '';
    // 비율 리셋
    this.$imgBox.style.aspectRatio = '1 / 1';
    // 클라우드
    [...this.$cloudBtns.children][0].hidden = false;
    [...this.$cloudBtns.children][0].textContent = 'Yes';
    [...this.$cloudBtns.children][1].textContent = 'No';  
    this._cloud = 0;
    this.$cloudText.textContent = this._cloudYes[this._cloud];
    this.$cloudOne.style.display = 'none';
    this.$cloudTwo.style.display = 'none';
    this.$cloudThree.style.display = 'none';
    // 캣
    this.$catText.textContent = 'Are you a Cat person? 😾';
    this.$catImg.style.display = '';
    [...this.$catBtns.children][0].hidden = false;
    [...this.$catBtns.children][0].textContent = 'Yes';
    [...this.$catBtns.children][1].textContent = 'No';
    // Reading Quotes
    this._readingQuotes = 0;
    this.$RQText.textContent = this._rqText[this._readingQuotes];
    this.$RQFrom.textContent = this._rqTextFrom[this._readingQuotes];  
  }
  // 내가 꾸민 이미지 다운로드
  async download() {
    html2canvas(this.$imgBox, { scale: 1 })
      .then((canvas) => {
        const img = canvas.toDataURL();
        this.$link.href = img;
        this.$link.download = 'capture.png'; 
        this.$link.click();
      });
  }
  // 클라우드 버튼 클릭시
  cloud(e) {
    const target = e.target.closest('.quotes-other-btn');
    if(!target) return;
    // Yes클릭했는지 No클릭했는지
    const answer = target.textContent;
    if(answer === 'Yes') {
      this._cloud++;
      // 클라우드 추가
      if(this._cloud < 4) {
        this.addCloud(this._cloud);
        // 다음 문장
        this.$cloudText.textContent = this._cloudYes[this._cloud];
      } else if(this._cloud === 4) {
        this.$cloudText.textContent = this._cloudYes[this._cloud];
        // Reset하나만
        this.cloudNo(0);
      }
    } else if (answer === 'No') {
      this.$cloudText.textContent = this._cloudNo[this._cloud];
      // 비포어와 리셋
      this.cloudNo(this._cloud);
    } else if (answer === 'Reset') {
      [...this.$cloudBtns.children][0].hidden = false;
      [...this.$cloudBtns.children][0].textContent = 'Yes';
      [...this.$cloudBtns.children][1].textContent = 'No';  
      this._cloud = 0;
      this.$cloudText.textContent = this._cloudYes[this._cloud];
      this.$cloudOne.style.display = 'none';
      this.$cloudTwo.style.display = 'none';
      this.$cloudThree.style.display = 'none';
    } if (answer === 'Before') {
      [...this.$cloudBtns.children][0].textContent = 'Yes';
      [...this.$cloudBtns.children][1].textContent = 'No';    
      this._cloud--;
      this.$cloudText.textContent = this._cloudYes[this._cloud];
      if(this._cloud === 0) {
        this.$cloudOne.style.display = 'none';
      } else if(this._cloud === 1) {
        this.$cloudTwo.style.display = 'none';
      } else if(this._cloud === 2) {
        this.$cloudThree.style.display = 'none';  
      }
    }
  }
  // 구름 하나씩 추가
  addCloud(cloud) {
    switch(cloud) {
      case 1:
        this.$cloudOne.style.display = 'block';
        break;
      case 2:
        this.$cloudTwo.style.display = 'block';
        break;
      case 3:
        this.$cloudThree.style.display = 'block';
        break;      
    }
  }
  cloudNo(cloud) {
    // Reset과 Before 버튼으로 바꾸기
    if(cloud == 0) {
      [...this.$cloudBtns.children][0].hidden = true;
      [...this.$cloudBtns.children][1].textContent = 'Reset';  
    } else {
      [...this.$cloudBtns.children][0].textContent = 'Before';
      [...this.$cloudBtns.children][1].textContent = 'Reset';    
    }
  }
  resize() {
    if(document.documentElement.clientWidth < 850) {
      // Cloud
      this.$cloudOne.style.display = 'none';
      this.$cloudTwo.style.display = 'none';
      this.$cloudThree.style.display = 'none';
      this._cloud = 0;
      this.$cloudText.textContent = this._cloudYes[this._cloud];
      [...this.$cloudBtns.children][0].hidden = false;
      [...this.$cloudBtns.children][0].textContent = 'Yes';
      [...this.$cloudBtns.children][1].textContent = 'No';    
      // Cat
      this.$catText.textContent = 'Are you a Cat person? 😾';
      this.$catImg.style.display = '';
      [...this.$catBtns.children][0].hidden = false;
      [...this.$catBtns.children][0].textContent = 'Yes';
      [...this.$catBtns.children][1].textContent = 'No';
      // Reading Quotes
      this._readingQuotes = 0;
      this.$RQText.textContent = this._rqText[this._readingQuotes];
      this.$RQFrom.textContent = this._rqTextFrom[this._readingQuotes];  
    } 
  }
  cat(e) {
    const target = e.target.closest('.quotes-other-btn');
    if(!target) return;
    const answer = target.textContent;
    if(answer === 'Yes') {
      [...this.$catBtns.children][0].hidden = true;
      [...this.$catBtns.children][1].textContent = 'Reset';
      this.$catImg.style.display = 'block'
      this.$catText.textContent = 'great minds think alike 😎';
    } else if(answer === 'No') {
      [...this.$catBtns.children][0].hidden = true;
      [...this.$catBtns.children][1].textContent = 'Reset';
      this.$catImg.style.display = 'block'  
      this.$catText.textContent = 'Take this opportunity to like Cat 😎'
    } else if(answer === 'Reset') {
      [...this.$catBtns.children][0].hidden = false;
      [...this.$catBtns.children][0].textContent = 'Yes';
      [...this.$catBtns.children][1].textContent = 'No';
      this.$catImg.style.display = ''  
      this.$catText.textContent = 'Are you a Cat person? 😾'
    }
  }
  readingQuotes(e) {
    const target = e.target.closest('.quotes-other-btn');
    if(!target) return;
    const answer = target.textContent;
    if(answer === 'Before') {
      if(this._readingQuotes == 0) {
        alert('처음입니다.');
        return;
      }
      this._readingQuotes--;
    } else if(answer === 'Next') {
      if(this._readingQuotes == 9) {
        alert('끝입니다.');
        return;
      }
      this._readingQuotes++;
    }
    this.$RQText.textContent = this._rqText[this._readingQuotes];
    this.$RQFrom.textContent = this._rqTextFrom[this._readingQuotes];
  }  
}

const quotes = new Quotes();
window.addEventListener('resize', quotes.resize);
