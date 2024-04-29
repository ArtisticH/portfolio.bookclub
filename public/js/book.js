
class Book {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
    this.$reviewForm = document.getElementById('review-form');
    this.reviewFormStar = null;
    this.user = this.$reviewForm.dataset.user;
    this.$reviewFormStars = document.querySelector('.review-form__stars');
    this.$reviewWriteBtn = document.querySelector('.review__write');
    this.$textLengthElem = document.querySelector('.review-form__text__length');
    this.$textarea = document.getElementById('review-form__text');
    this.$reviewTitle = document.querySelector('.review-form__input__title');
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
    this.funTextLength = this.funTextLength.bind(this);
    this.$textarea.addEventListener('input', this.funTextLength);
    /* --------------------------------------------------------------------------------------------------------- */
    // 5. 리뷰 DB에 등록
    this.OVERTEXT_LIMIT = 200;
    // 현재 책 id
    this.bookId = new URL(location.href).pathname.split('/')[2];
    this.funSubmitForm = this.funSubmitForm.bind(this);
    this.$reviewForm.addEventListener('submit', this.funSubmitForm);
    /* --------------------------------------------------------------------------------------------------------- */
    // 5 - 1. 등록 후 가장 최신의 1가지 긁어오고 DOM 변경
    this.$totalReviewCount = document.querySelector('.review-title__total');
    this.totalReviewCount = this.$totalReviewCount.textContent;
    this.$reviewClone = document.querySelector('.review-box.review-box-for-clone').cloneNode(true);
    /* --------------------------------------------------------------------------------------------------------- */
    // 6. pagenation
    /* --------------------------------------------------------------------------------------------------------- */
    // 7. 더보기
    this.$moreBtns = document.querySelectorAll('.review-box__more');
    [...this.$moreBtns].forEach(btn => {
      btn.addEventListener('click', this.fucClickMoreBtn);
    });
    /* --------------------------------------------------------------------------------------------------------- */
    // 8. 공감
    this.$heartBtns = document.querySelectorAll('.review-box__heart');
    this.fucHeartBtn = this.fucHeartBtn.bind(this);
    [...this.$heartBtns].forEach(btn => {
      btn.addEventListener('click', this.fucHeartBtn);
    })
    /* --------------------------------------------------------------------------------------------------------- */
    // 9. 리뷰 작성시 별점 매기기, 텍스트 입력, 타이틀 입력 모두 해야 전송되게끔
}

  /* --------------------------------------------------------------------------------------------------------- */
  // 1. 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
  funReviewForm(e) {
    if(!!this.user) {
      // 로그인한 상태라면
      // 리뷰 전의 선택들 초기화
      this.reviewFormStar = null;
      [...this.$reviewFormStars.children].forEach((item) => {
        // opacity: 0.5로 
        item.style.opacity = '';
      });
      // 텍스트, 타이틀, 글자 수 초기화
      this.$textLengthElem.textContent = 0;
      this.$textarea.value = '';
      this.$reviewTitle.value = '';
      // 리뷰 폼 등장
      this.$reviewForm.style.display = 'flex';
      document.body.style.overflow = 'hidden';  
    } else {
      alert('로그인 후 이용하세요.');
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 2. 취소 버튼 누르면 리뷰 폼 사라지기
  funDisappearForm(e) {
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
  async funSubmitForm(e) {
    try {
      e.preventDefault();
      // 제목, 내용, 별점, 책 id, 작성자 id 등 보내기
      const title = e.target.title.value;
      const text = e.target.text.value;
      const overText = (e.target.text.value.length > this.OVERTEXT_LIMIT) ? true : false;
      // hidden = true인 것까지 센다.
      const $reviewBoxes = document.querySelectorAll('.review-box');
      // 서버에서 DB에 등록
      const res = await axios.post('/review', {
        title,
        text,
        overText,
        stars: this.reviewFormStar,
        // MemberId는 서버에서 입력, req.user.id로
        bookId: this.bookId,
      });  
      const review = res.data.review;
      // 리뷰 폼 사라지기
      this.$reviewForm.style.display = '';
      document.body.style.overflow = '';  
      // 5 - 1. 등록 후 등록한 거 다시 가져와,
      // 서버에서 create 후에 findOne으로 찾아와야 한다. 
      // 그래야 외래키 정보가 다 담기기 때문. 
      // 리뷰 total 수정
      this.totalReviewCount++;
      this.$totalReviewCount.textContent = this.totalReviewCount;
      // 만약 리뷰 총 개수가 5개 미만이면 하나씩 맨 앞에 추가하고
      // 그렇지 않다면 가장 위에 리뷰 추가하고
      // 가장 아래의 리뷰 삭제
      $reviewBoxes[0].before(this.funMakeReviewDOM(this.$reviewClone, review));
      if(this.totalReviewCount >= 5) {
        // 가장 아래것 삭제
        // 왜 $reviewBoxes[$reviewBoxes.length - 1]을 안하냐면
        // document.querySelectorAll('.review-box');은 hidden = true;인 것도 포함한다. 
        // 그래서 마지막 녀석을 삭제하면 hidden = true인 애를 삭제하게 되고
        // 보이는 마지막 요소는 그대로 남아 6개가 된다. 
        $reviewBoxes[4].remove();
      } 
    } catch (err) {
      console.error(err);
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 5 - 1. 기존의 hidden인 노드를 복사해서 서버에서 가져온 자료에 맞게 변형
  funMakeReviewDOM (c, obj) {
    c.className = 'review-box';
    c.hidden = false;
    c.querySelector('.review-box__title').textContent = obj.title;
    [...c.querySelectorAll('.review-box__info__stars__star')].forEach((item, index) => {
      item.classList.add(`${obj.stars[index]}`);
    });
    c.querySelector('.review-box__info__type').textContent = obj.type.toUpperCase();
    c.querySelector('.review-box__info__nickname').textContent = obj.nick;
    c.querySelector('.review-box__info__nickname').href = `/member/${obj.MemberId}`;
    c.querySelector('.review-box__info__date').textContent = obj.createdAt;
    // 유저가 로그인 상태고, 유저의 아이디와 작성자의 아이디가 같다면 수정 + 삭제란 노출
    if(this.user && this.user.id === obj.MemberId) {
      c.querySelector('.review-box__info__edit').dataset.reviewId = obj.id;
      c.querySelector('.review-box__info__delete').dataset.reviewId = obj.id;
    } else {
      c.querySelector('.review-box__is-user').remove();
    }
    // 만약 text.slice가 null이라면 1000자를 안 넘는다는 뜻이고 그럼 그대로 original 보여준다.
    // 만약 1000자를 넘으면 보여지는건 slice버전, original은 숨겨뒀다가 더보기버튼을 누르면 바꾸기
    // querySelectorAll은 hidden까지 카운트한다. 
    if(!obj.text.slice) {
      // original 보여준다.
      c.querySelectorAll('.review-box__text')[0].textContent = obj.text.original;
      c.querySelectorAll('.review-box__text')[1].remove();
    } else {
      // 200자를 넘어서 slice를 보여준다.
      c.querySelectorAll('.review-box__text')[0].textContent = `${obj.text.slice}...`;
      c.querySelectorAll('.review-box__text')[1].textContent = obj.text.original;
    }
    if(!obj.overText) {
      c.querySelector('.review-box__more').remove();
    } 
    // 새로 추가되는 요소에도 이벤트를 추가해야 한다.
    c.querySelector('.review-box__more').onclick = this.fucClickMoreBtn;
    c.querySelector('.review-box__heart').dataset.reviewId = obj.id;
    // 새로 추가되는 요소에도 이벤트를 추가해야 한다.
    c.querySelector('.review-box__heart').onclick = this.fucHeartBtn;
    c.querySelector('.review-box__heart__total').textContent = obj.like;
    return c;
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 7. 더보기
  fucClickMoreBtn(e) {
    const $box = e.target.closest('.review-box');
    // 더보기가 클릭이 됐다는 건 텍스트가 한도를 넘었다는 뜻, 
    // 그럼 .review-box__text가 slice버전과 original버전 두개임
    const $texts = [...$box.querySelectorAll('.review-box__text')];
    const $arrow = $box.querySelector('.review-box__more__arrow');
    // 두번째 요소가 닫혀있는게 기본값
    if($texts[1].hidden) {
      // 더보기 보여줘
      // original 텍스트를 보여준다.
      $texts[0].hidden = true;
      $texts[1].hidden = false;
      $arrow.style.transform = 'rotate(180deg)';
    } else {
      // 더보기 닫아줘
      $texts[0].hidden = false;
      $texts[1].hidden = true;
      $arrow.style.transform = '';
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 8. 공감
  async fucHeartBtn(e) {
    // 로그인 안했으면 접근 금지
    if(!this.user) {
      alert('로그인 후 이용해주세요');
      return;
    }
    const target = e.currentTarget;
    const id = target.dataset.reviewId;
    // 위로 올라가는 하트
    const $img = target.querySelector('.review-box__heart__img');
    const $like = target.querySelector('.review-box__heart__total');
    const res = await axios.post(`/review/like/${id}`);
    // 서버에서 보내온 클릭해도 되는지 안되는지 여부
    const clickAllowed = res.data.clickAllowed;
    if(clickAllowed) {
      // 클릭이 처음이라면
      const like = res.data.like;
      $like.textContent = like;
      $img.classList.add('back');
    } else {
      // 좋아요 한거 취소
      const res = await axios.post(`/review/like/cancel/${id}`);
      const like = res.data.like;
      $like.textContent = like;
      $img.classList.remove('back');
    }
  }
}

const book = new Book();

