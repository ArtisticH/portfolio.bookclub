class Book {
  constructor() {
    this.$reviewForm = document.getElementById('review-form');
    this.$reviewWriteBtn = document.querySelector('.review__write');
    this.$reviewFormCancelBtn = document.querySelector('.review-form__cancel');

    this.bookId = new URL(location.href).pathname.split('/')[2];
    this.reviewFormStar = null;
    this.TEXT_LIMIT = 3000;
    this.OVERTEXT_LIMIT = 1000;
    this.$textLimit = document.querySelector('.review-form__text__length__limit');
    this.$textLimit.textContent = this.TEXT_LIMIT;
    this.$textLengthElem = document.querySelector('.review-form__text__length');
    this.$reviewFormStars = document.querySelector('.review-form__stars');
    this.$textarea = document.getElementById('review-form__text');
    this.calculateStars = this.calculateStars.bind(this);
    this.$reviewFormStars.addEventListener('click', this.calculateStars);
    this.textLength = this.textLength.bind(this);
    this.$textarea.addEventListener('input', this.textLength);

    this.$pageNumbers = document.querySelector('.review-paganation__numbers');
    this.pageNumbers = this.pageNumbers.bind(this);
    this.$pageNumbers.addEventListener('click', this.pageNumbers);

    // DOM 조작


    this.$reviewFormCancelBtn.onclick = this.reviewForm.bind(this);
    this.$reviewWriteBtn.onclick = this.reviewForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.$reviewForm.addEventListener('submit', this.submitForm);
  }

  reviewForm(e) {
    if(e.currentTarget === this.$reviewFormCancelBtn) {
      this.$reviewForm.style.display = '';
      document.body.style.overflow = '';
    } else if(e.currentTarget === this.$reviewWriteBtn) {
      this.reviewFormStar = null;
      [...this.$reviewFormStars.children].forEach((item) => {
        item.style.opacity = '';
      });
      this.$reviewForm.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  calculateStars(e) {
    const target = e.target;
    if(target.className !== 'review-form__star') return;
    const rate = +target.dataset.star;

    [...this.$reviewFormStars.children].forEach((item, index) => {
      if(index <= rate) {
        item.style.opacity = '1';
      } else if(index > rate) {
        item.style.opacity = '';
      }
    });
    this.reviewFormStar = rate + 1;
  }

  textLength(e) {
    // 바로 글자 수 화면에 보여지게
    this.$textLengthElem.textContent = e.target.value.length;
    // 글자 수 일정 기준 넘으면 경고
    if(e.target.value.length > this.TEXT_LIMIT) {
      alert(`${this.TEXT_LIMIT}자 이내로 입력해주세요.`);
      console.log(e.target.value)
      e.target.value = e.target.value.slice(0, 3000);
      this.$textLengthElem.textContent = e.target.value.length;
    }
  }

  async submitForm(e) {
    e.preventDefault();
    // 제목, 내용, 별점, 북 아이디 등 보내..
    const title = e.target.title.value;
    const text = e.target.text.value;
    const overText = (e.target.text.value.length > this.OVERTEXT_LIMIT) ? true : false;

    try {
      await axios.post('/review', {
        title,
        text,
        overText,
        stars: this.reviewFormStar,
        bookId: this.bookId,
      });  
      this.getReviews();
    } catch (err) {
      console.error(err);
    }
    e.target.title.value = '';
    e.target.text.value = '';
    this.$textLengthElem.textContent = 0;
    this.$reviewForm.style.display = '';
    document.body.style.overflow = '';
  }

  async getReviews() {
    const res = await axios.get(`/review/${this.bookId}`);
  }

  async pageNumbers(e) {
    // 페이지네이션, 처음에 1, 2, 3, 4, 5 중에서 2라든가 3이라든가 선택하면 서버에 요청 보내고 받아서 AJAX
    // /review/{{book.id}}/page/{{pageNumber}}
    e.preventDefault();
    const target = e.target;
    if(!target.closest('.review-paganation__number')) return;
    const href = target.href;
    const res = await axios.get(`${href}`);
    this.pageDOM(res.data.results);
  }

  // AJAX + DOM 조작
  pageDOM(data) {
    console.log(data)
    for(let i of data) {
      console.log(i);
    }
  }
}

const book = new Book();
