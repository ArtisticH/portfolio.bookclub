class Book {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
    this.$reviewForm = document.getElementById('review-form');
    this.reviewFormStar = null;
    this.$reviewFormStars = document.querySelector('.review-form__stars');
    this.$reviewWriteBtn = document.querySelector('.review__write');
    this.$reviewWriteBtn.onclick = this.funReviewForm.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    // 2. 취소 버튼 누르면 리뷰 폼 사라지기
    this.$reviewFormCancelBtn = document.querySelector('.review-form__cancel');
    this.$reviewFormCancelBtn.onclick = this.funDisappearForm.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    // 3. 리뷰 폼 작성시 별점 선택
    this.funShowFormStars = this.funShowFormStars.bind(this);
    this.$reviewFormStars.addEventListener('click', this.funShowFormStars);
    /* --------------------------------------------------------------------------------------------------------- */
    // 4. 몇 글자 입력했는지 보여주기
    this.TEXT_LIMIT = 3000;
    this.$textLimit = document.querySelector('.review-form__text__length__limit');
    this.$textLimit.textContent = this.TEXT_LIMIT;
    this.$textLengthElem = document.querySelector('.review-form__text__length');
    this.$textarea = document.getElementById('review-form__text');
    this.funTextLength = this.funTextLength.bind(this);
    this.$textarea.addEventListener('input', this.funTextLength);
    /* --------------------------------------------------------------------------------------------------------- */
    // 5. 리뷰 DB에 등록
    this.OVERTEXT_LIMIT = 1000;





    // 현재 책 id
    this.bookId = new URL(location.href).pathname.split('/')[2];

    this.$pageNumbers = document.querySelector('.review-paganation__numbers');
    this.pageNumbers = this.pageNumbers.bind(this);
    // this.$pageNumbers.addEventListener('click', this.pageNumbers);

    // DOM 조작


    this.submitForm = this.submitForm.bind(this);
    this.$reviewForm.addEventListener('submit', this.submitForm);

    /* --------------------------------------------------------------------------------------------------------- */
}

  /* --------------------------------------------------------------------------------------------------------- */
  // 1. 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
  funReviewForm(e) {
    if(!!this.$reviewForm.dataset.user) {
      // 로그인한 상태라면
      // 리뷰 전의 선택들 초기화
      this.reviewFormStar = null;
      [...this.$reviewFormStars.children].forEach((item) => {
        // opacity: 0.5로 
        item.style.opacity = '';
      });
      // 리뷰 폼 등장
      this.$reviewForm.style.display = 'flex';
      document.body.style.overflow = 'hidden';  
    } else {
      alert('로그인 후 이용하세요.');
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 2. 취소 버튼 누르면 리뷰 폼 사라지기
  funDisappearForm() {
    this.$reviewForm.style.display = '';
    document.body.style.overflow = '';
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 3. 리뷰 폼 작성시 별점 선택
  funShowFormStars(e) {
    const target = e.target;
    if(target.className !== 'review-form__star') return;
    // 0, 1, 2, 3, 4 중 하나
    const rate = +target.dataset.star;
    [...this.$reviewFormStars.children].forEach((item, index) => {
      if(index <= rate) {
        item.style.opacity = '1';
      } else if(index > rate) {
        item.style.opacity = '';
      }
    });
    // 최종 선택 별점 1, 2, 3, 4, 5중 하나
    this.reviewFormStar = rate + 1;
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 4. 몇 글자 입력했는지 보여주기
  funTextLength(e) {
    // 바로 글자 수 화면에 보여지게
    this.$textLengthElem.textContent = e.target.value.length;
    // 글자 수 일정 기준 넘으면 경고
    if(e.target.value.length > this.TEXT_LIMIT) {
      alert(`${this.TEXT_LIMIT}자 이내로 입력해주세요.`);
      // 글자 더 이상 입력 못하고 3000자에 머무르게
      e.target.value = e.target.value.slice(0, 3000);
      this.$textLengthElem.textContent = e.target.value.length;
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 5. 리뷰 DB에 등록

  async submitForm(e) {
    e.preventDefault();
    // 제목, 내용, 별점, 책 id, 작성자 id 등 보내기
    const title = e.target.title.value;
    const text = e.target.text.value;
    const overText = (e.target.text.value.length > this.OVERTEXT_LIMIT) ? true : false;
    try {
      await axios.post('/review', {
        title,
        text,
        overText,
        stars: this.reviewFormStar,
        // MemberId는 서버에서 입력, req.user.id로
        bookId: this.bookId,
      });  
      // ajax로 업데이트 반영
      this.getReviews();
    } catch (err) {
      console.error(err);
    }
    e.target.title.value = '';
    e.target.text.value = '';
    this.$textLengthElem.textContent = 0;
    // 리뷰 폼 사라지기
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

