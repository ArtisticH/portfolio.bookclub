class Quotes {
  constructor() {
    // 1. 조작, 이벤트 위임
    this.$opers = document.querySelector('.quotes-opers');
    this.$opers.onclick = this.operation.bind(this);
    // 클릭에 맞는 박스 보여주기
    this.$boxes = Array.from(document.querySelectorAll('.quotes-box'));
    this._type = null;
    // 2. 박스의 내용 클릭할때
    this.$contents = Array.from(document.querySelectorAll('.quotes-box-contents'));
    this.clickContents = this.clickContents.bind(this);
    this.$contents.forEach(con => {
      con.addEventListener('click', this.clickContents);
    })
    // 2. 혹은 input을 입력할때
    this.$inputForm = document.querySelector('.quotes-form.input');
    this.input = this.input.bind(this);
    this.$inputForm.addEventListener('submit', this.input);
    // 3. 꾸미기
    // 비율 조작
    this.$imgBox = document.querySelector('.quotes-img-box');
    // this.$img = document.querySelector('.quotes-img');
    this.$inputs = document.querySelector('.quotes-img-inputs');
    this.$quotes = document.querySelector('.quotes-img-inputs-quotes');
    this.$from = document.querySelector('.quotes-img-inputs-from');
    // 기본 이미지 선택 시
    this.$basicForm = document.querySelector('.quotes-form.basic');
    this.basic = this.basic.bind(this);
    this.$basicForm.addEventListener('change', this.basic);
    // 직접 이미지 올릴때
    this.$userForm = document.querySelector('.quotes-form.user-img');
    this.myImg = this.myImg.bind(this);
    this.$userForm.addEventListener('change', this.myImg);
    // 4. 엑스 버튼 클릭 시 기본 상자 보여주기
    this.$cancelBtns = Array.from(document.querySelectorAll('.quotes-box-cancel'));
    this.cancel = this.cancel.bind(this);
    this.$cancelBtns.forEach(btn => {
      btn.addEventListener('click', this.cancel);
    });
    // 5. 다운로드
    this.$download = document.querySelector('.quotes-download');
    this.$download.onclick = this.download.bind(this);
    this.$output = null;
    this.$link = document.getElementById('capture');
    this.$register = document.querySelector('.quotes-register');
    this.$register.onclick = this.register.bind(this);
    this.$quotesSection = document.getElementById('quotes');
    this._userId = this.$quotesSection.dataset.userId;
    // 기본 박스
    this.$noneBox = document.querySelector('.quotes-box.none');
  }
  // 1. 조작
  // 클릭한 type에 맞는 폼 보여주기
  operation(e) {
    const target = e.target.closest('.quotes-oper-box');
    if(!target) return;
    const type = target.dataset.type;
    this._type = type;
    this.changeBox(this._type);
  }
  // 폼 변화 보여주기
  changeBox(type) {
    this.$boxes.forEach(box => {
      if(box.classList[1] === type) {
        box.hidden = false;
      } else {
        box.hidden = true;
      }
    })
  }
  // 2. 박스의 내용 클릭할때
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
  // 2. 혹은 박스가 input 사항일때
  input(e) {
    e.preventDefault();
    const target = e.currentTarget;
    const quotes = target.quotes.value;
    const from = target.from.value;
    this.$quotes.textContent = quotes;
    this.$from.textContent = from;
    target.quotes.value = '';
    target.from.value = '';
  }
  // 3. 꾸미기
  // 비율 변화
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
  basic(e) {
    const value = e.target.value;
    this.$imgBox.style.backgroundImage = `url("/img/quotes/${value}.jpeg")`;
    this.$quotes.textContent = '';
    this.$from.textContent = '';
  }
  async myImg(e) {
    const target = e.currentTarget;
    const file = target.userimage.files[0];
    const formData = new FormData();
    formData.append('image', file);
    const res = await axios.post('/quotes/img', formData);
    this.$imgBox.style.backgroundImage = `url(${res.data.url})`;
    this.$quotes.textContent = '';
    this.$from.textContent = '';
  }
  // 4. 엑스 버튼 클릭 시 기본 상자 보여주기
  cancel(e) {
    const box = e.target.closest('.quotes-box');
    box.hidden = true;
    this.$noneBox.hidden = false;
  }
  // 5. 다운로드
  async download() {
    this.$output = document.querySelector('.quotes-img-box');
    html2canvas(this.$output, { scale: 1 })
      .then((canvas) => {
        const img = canvas.toDataURL();
        this.$link.href = img;
        this.$link.download = 'capture.png'; 
        this.$link.click();
      })
  }
  register() {
    if(!this._userId) {
      alert('로그인 후 이용 가능합니다');
      return;
    }
  }
}

new Quotes();