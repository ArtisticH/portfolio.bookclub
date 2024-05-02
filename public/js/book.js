
class Book {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
    this.$reviewForm = document.getElementById('review-form');
    this.user = this.$reviewForm.dataset.user;
    this.$reviewFormStars = document.querySelector('.review-form__stars');
    this.$reviewTitle = document.querySelector('.review-form__input__title');
    this.$textLengthElem = document.querySelector('.review-form__text__length');
    this.$textarea = document.getElementById('review-form__text');
    // 서버에 보낼 별 갯수
    this.reviewFormStar = null;
    this.$reviewWriteBtn = document.querySelector('.review__write');
    // 등록 버튼 클릭
    this.$reviewWriteBtn.onclick = this.funReviewForm.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    // 2. 취소 버튼 누르면 리뷰 폼 사라지기
    this.$reviewFormCancelBtn = document.querySelector('.review-form__cancel');
    this.$reviewFormCancelBtn.onclick = this.funDisappearForm.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    // 3. 리뷰 폼 작성시 별점 선택
    this.funShowFormStars = this.funShowFormStars.bind(this);
    // 이벤트 위임
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
    // 현재 책 ID
    this.bookId = new URL(location.href).pathname.split('/')[2];
    this.OVERTEXT_LIMIT = 200;
    this.funSubmitForm = this.funSubmitForm.bind(this);
    this.$totalReviewCount = document.querySelector('.review-title__total');
    // 가장 처음에 넌적스로 서버에서 내림받은 데이터 사용
    this.totalReviewCount = this.$totalReviewCount.textContent;
    // 이 친구를 계속 복사해서 리뷰 등록, 페이지네이션 시에 사용
    this.$reviewClone = document.querySelector('.review-box.review-box-for-clone');
    /* --------------------------------------------------------------------------------------------------------- */
    // 6. 더보기
    this.$moreBtns = document.querySelectorAll('.review-box__more');
    [...this.$moreBtns].forEach(btn => {
      btn.addEventListener('click', this.fucClickMoreBtn);
    });
    /* --------------------------------------------------------------------------------------------------------- */
    // 7. 공감
    this.$heartBtns = document.querySelectorAll('.review-box__heart');
    this.fucHeartBtn = this.fucHeartBtn.bind(this);
    [...this.$heartBtns].forEach(btn => {
      btn.addEventListener('click', this.fucHeartBtn);
    })
    /* --------------------------------------------------------------------------------------------------------- */
    // 8. 리뷰 작성시 별점 매기기, 텍스트 입력, 타이틀 입력 모두 해야 전송되게끔
    this.$submitBtn = document.querySelector('.review-form__submit');
    this.titleLength = null;
    this.textLength = null;
    this.funBannedSubmit = this.funBannedSubmit.bind(this);
    this.fucTitleLength = this.fucTitleLength.bind(this);
    this.funActivateSubmit = this.funActivateSubmit.bind(this);
    // 기본 상태: 버튼 비활성화
    // 조건을 다 충족시키면 버튼 활성화시켜야 한다. 
    this.$reviewForm.onsubmit = this.funBannedSubmit;
    this.$reviewTitle.addEventListener('input', this.fucTitleLength);
    this.$reviewForm.addEventListener('input', this.funActivateSubmit);
    /* --------------------------------------------------------------------------------------------------------- */
    // 9. 수정
    this.$editBtns = document.querySelectorAll('.review-box__info__edit');
    this.funEdit = this.funEdit.bind(this);
    [...this.$editBtns].forEach(btn => {
      btn.addEventListener('click', this.funEdit);
    });
    this.editElem = null;
    /* --------------------------------------------------------------------------------------------------------- */
    // 10. 삭제
    this.$deleteBtns = document.querySelectorAll('.review-box__info__delete');
    this.funDelete = this.funDelete.bind(this);
    [...this.$deleteBtns].forEach(btn => {
      btn.addEventListener('click', this.funDelete);
    });
    /* --------------------------------------------------------------------------------------------------------- */
    // 11. pagenation
    this.$numberBtns = document.querySelectorAll('.review-paganation__number');
    this.funPagenation = this.funPagenation.bind(this);
    this.currentPage = 1;
    this.nextPage = null;
    // 가장 처음에 1에 클릭된 표시
    [...this.$numberBtns][this.currentPage - 1].classList.add('clicked');
    [...this.$numberBtns].forEach(btn => {
      btn.addEventListener('click', this.funPagenation);
    });
    /* --------------------------------------------------------------------------------------------------------- */
    // 11 - 1. 첫 리뷰 등록 후 페이지 관련 활성화
    this.$pagenation = document.querySelector('.review-paganation');
    this.$firstPageIcon = document.querySelector('.review-paganation__first');
    this.$lastPageIcon = document.querySelector('.review-paganation__last');
    this.$beforePageIcon = document.querySelector('.review-paganation__before');
    this.$afterPageIcon = document.querySelector('.review-paganation__after');
    this.$emptyReviewElem = document.querySelector('.empty-review');
    this.pageNumber = 1;
    this.$reivewContainer = null;
    this.$afterPageIcon.onclick = this.funLastPage.bind(this);
}
  /* --------------------------------------------------------------------------------------------------------- */
  // 1. 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
  funReviewForm(e) {
    if(!!this.user) {
      // 로그인한 상태라면
      // 평점들 다 없애기
      [...this.$reviewFormStars.children].forEach((item) => {
        // opacity: 0.5로 
        item.style.opacity = '';
      });
      // 텍스트, 타이틀, 글자 수 초기화
      this.$reviewTitle.value = '';
      this.$textLengthElem.textContent = 0;
      this.$textarea.value = '';
      // 리뷰 폼 등장
      this.$reviewForm.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // 아래 세 가지가 모두 true여야 버튼이 활성화된다.
      // 폼을 처음 등록할때는 null로 초기화
      // 서버에 보낼 별 갯수
      this.reviewFormStar = null;
      this.titleLength = null;
      this.textLength = null;  
      // 등록 버튼 비활성화
      this.$submitBtn.style.opacity = '0.5';
      this.$submitBtn.style.cursor = 'auto'; 
      this.$reviewForm.onsubmit = this.funBannedSubmit; 
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
    // 별이 아니면 나가
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
    // 등록 버튼 활성화 조건 중 하나
    this.reviewFormStar = rate + 1;
    // 내가 별점을 클릭하는 시기에 이미 텍스트와 타이틀이 입력되어있다면
    // 버튼 활성화
    if(this.textLength && this.titleLength) {
      this.$submitBtn.style.opacity = '';
      this.$submitBtn.style.cursor = '';  
      // 등록 버튼 활성화
      this.$reviewForm.onsubmit = this.funSubmitForm;
    } else {
      this.$submitBtn.style.opacity = '0.5';
      this.$submitBtn.style.cursor = 'auto';  
      // 등록 버튼 비활성화
      this.$reviewForm.onsubmit = this.funBannedSubmit;
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 4. 몇 글자 입력했는지 보여주기
  funTextLength(e) {
    if(e.target.value.length > 0) {
      // 입력을 했다 => 등록 버튼 활성화의 조건 중 하나
      this.textLength = true;
    } else if (e.target.value.length === 0) {
      // 입력 안 했다 => 등록 버튼 비활성화 조건 중 하나
      this.textLength = null;
    }
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
      // 제목, 내용, 별점, 책 ID, MEMBER ID 등 보내기
      // 만약 업데이트라면 ID가 있을 것이고 새로 추가하는 거라면 ID가 서버에서 생성될 터
      // 서버에서 ID값을 보고 update인지 create인지 구분.
      // null값이면 새로 리뷰 등록하는거
      const id = this.$reviewForm.dataset.id ? this.$reviewForm.dataset.id : null;
      const title = e.target.title.value;
      const text = e.target.text.value;
      const overText = (e.target.text.value.length > this.OVERTEXT_LIMIT) ? true : false;
      // 리뷰 폼 사라지기
      this.funDisappearForm();
      if(!id) {
        // 새로 생성한다면
        // title, text, overText, stars, bookId를 서버에 보낸다. 
        const res = await axios.post('/review', {
          title,
          text,
          overText,
          stars: this.reviewFormStar,
          // MemberId는 서버에서 입력, req.user.id로
          bookId: this.bookId,
        }); 
        const review = res.data.review;   
        // querySelectorAll은 hidden = true인 것까지 센다.
        // review-box-for-clone까지 포함되어있음.
        const $reviewBoxes = document.querySelectorAll('.review-box');
        // 리뷰 total 수정
        this.totalReviewCount++;
        this.$totalReviewCount.textContent = this.totalReviewCount;
        // 만약 리뷰 총 개수가 5개 미만이면 하나씩 맨 앞에 추가하고
        // 그렇지 않다면 가장 위에 리뷰 추가하며 동시에 가장 아래의 리뷰도 삭제
        $reviewBoxes[0].before(this.funReviewDOM(this.$reviewClone.cloneNode(true), review));
        if(this.totalReviewCount >= 5) {
          // 가장 아래것 삭제
          // 왜 $reviewBoxes[$reviewBoxes.length - 1]을 안하냐면
          // document.querySelectorAll('.review-box');은 hidden = true;인 것도 포함한다. 
          // 그래서 마지막 녀석을 삭제하면 hidden = true인 애를 삭제하게 되고
          // 보이는 마지막 요소는 그대로 남아 6개가 된다. 
          $reviewBoxes[4].remove();
        } 
        // 아예 처음에 글을 등록하는 경우
        // '리뷰를 작성해주세요' 없애고 페이지넘버들도 활성화
        this.funPageElems();
      } else {
        // 몇번 리뷰를 수정해라
        const res = await axios.patch(`/review`, {
          id,
          title,
          text,
          overText,
          stars: this.reviewFormStar,
        }); 
        const review = res.data.review;   
        // 수정 분 바로 반영
        // this.editElem은 해당 .review-box
        this.funEditElem(this.editElem, review);
      }
    } catch (err) {
      console.error(err);
    }
  }
  // c: this.$reviewClone.cloneNode(true), 복사를 위해 존재하는 요소를 복사한 노드
  funReviewDOM (c, obj) {
    c.className = 'review-box';
    c.hidden = false;
    c.dataset.reviewId = obj.id;
    c.querySelector('.review-box__title').textContent = obj.title;
    [...c.querySelectorAll('.review-box__info__stars__star')].forEach((item, index) => {
      item.classList.add(`${obj.stars[index]}`);
    });
    c.querySelector('.review-box__info__type').textContent = obj.type.toUpperCase();
    c.querySelector('.review-box__info__nickname').textContent = obj.nick;
    c.querySelector('.review-box__info__nickname').href = `/member/${obj.MemberId}`;
    c.querySelector('.review-box__info__date').textContent = obj.createdAt;
    c.querySelector('.review-box__info__updatedDate').textContent = obj.updatedAt;
    // 유저의 아이디와 작성자의 아이디가 다르다면 수정/삭제 비활성화
    if(this.user.id !== obj.MemberId) {
      c.querySelector('.review-box__is-user').hidden = true;
    } 
    // 만약 text.slice가 null이라면 1000자를 안 넘는다는 뜻이고 그럼 그대로 original 보여준다.
    // 만약 1000자를 넘으면 보여지는건 slice버전, original은 숨겨뒀다가 더보기버튼을 누르면 바꾸기
    // querySelectorAll은 hidden까지 카운트한다. 
    if(!obj.text.slice) {
      // original 보여준다.
      c.querySelectorAll('.review-box__text')[0].textContent = obj.text.original;
    } else {
      // 200자를 넘어서 slice를 보여준다.
      c.querySelectorAll('.review-box__text')[0].textContent = `${obj.text.slice}...`;
      c.querySelectorAll('.review-box__text')[1].textContent = obj.text.original;
    }
    if(!obj.overText) {
      c.querySelector('.review-box__more').hidden = true;
    } else {
      c.querySelector('.review-box__more').hidden = false;
    }
    // 새로 추가되는 요소에도 이벤트를 추가해야 한다.
    c.querySelector('.review-box__more').onclick = this.fucClickMoreBtn;
    c.querySelector('.review-box__heart').onclick = this.fucHeartBtn;
    c.querySelector('.review-box__heart__total').textContent = obj.like;
    return c;
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 6. 더보기
  fucClickMoreBtn(e) {
    // 현재 리뷰 박스
    const $box = e.target.closest('.review-box');
    // 더보기가 클릭이 됐다는 건 텍스트가 한도를 넘었다는 뜻, 
    // 그럼 slice버전과 original버전 두개임
    // 텍스트 요소 배열과 화살표 요소
    const $texts = [...$box.querySelectorAll('.review-box__text')];
    const $arrow = $box.querySelector('.review-box__more__arrow');
    // 두번째 요소가 닫혀있는게 기본값
    // 만약 slice를 보여주고 있다면
    if($texts[1].hidden) {
      // original 텍스트를 보여준다.
      $texts[0].hidden = true;
      $texts[1].hidden = false;
      // 화살표 바뀐다.
      $arrow.style.transform = 'rotate(180deg)';
    } else {
      // original요소를 보여주고 있다면
      // 더보기 닫아줘
      $texts[0].hidden = false;
      $texts[1].hidden = true;
      $arrow.style.transform = '';
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 7. 공감
  async fucHeartBtn(e) {
    // 로그인 안했으면 접근 금지
    if(!this.user) {
      alert('로그인 후 이용해주세요');
      return;
    }
    const box = e.currentTarget.closest('.review-box');
    const reviewId = box.dataset.reviewId;
    // 위로 올라가는 하트
    const $img = box.querySelector('.review-box__heart__img');
    const $like = box.querySelector('.review-box__heart__total');
    const res = await axios.post(`/review/like`, { id: reviewId });
    // 서버에서 보내온 클릭해도 되는지 안되는지 여부
    const clickAllowed = res.data.clickAllowed;
    if(clickAllowed) {
      // 클릭이 처음이라면
      $like.textContent = res.data.like;
      // 하트 위로 올라가는 효과
      $img.classList.add('back');
    } else {
      // 이미 클릭한 상태라면, 클릭한 거 취소
      const res = await axios.post(`/review/like/cancel`, { id: reviewId });
      $like.textContent = res.data.like;
      $img.classList.remove('back');
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 8. 리뷰 작성시 별점 매기기, 텍스트 입력, 타이틀 입력 모두 해야 전송되게끔
  funBannedSubmit(e) {
    e.preventDefault();
  }
  // text는 funTextLength에서
  // title은 따로 만들어
  fucTitleLength(e) {
    if(e.target.value.length > 0) {
      this.titleLength = true;
    } else if (e.target.value.length === 0) {
      this.titleLength = null;
    }
  }
  // titleLength, textLength, reviewFormStar가 true 혹은 값이 있으면 
  // 등록 버튼 활성화하고 funSubmitForm 연결
  funActivateSubmit(e) {
    // 별점을 마지막에 고르는 경우, 즉 별점을 고를때 이미 텍스트와 타이틀이 
    // 입력된 경우는 funShowFormStars에서 처리
    // 이 함수는 반대로 별점을 먼저 클릭하고 후에 텍스트나 타이틀을 입력하는 경우 처리
    if(this.titleLength && this.textLength) {
      this.$submitBtn.style.opacity = '';
      this.$submitBtn.style.cursor = '';  
      this.$reviewForm.onsubmit = this.funSubmitForm;
    } else {
      this.$submitBtn.style.opacity = '0.5';
      this.$submitBtn.style.cursor = 'auto';  
      this.$reviewForm.onsubmit = this.funBannedSubmit;
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 9. 수정
  // 수정 버튼 클릭하면 다시 입력 폼이 나오고, 
  // 그 입력 폼 버튼 클릭하면 수정 내용이 서버에 전송된다.
  async funEdit(e) {
    // 수정 버튼
    const target = e.currentTarget;
    const box = target.closest('.review-box');
    this.editElem = box;
    const reviewId = box.dataset.reviewId;
    // $reviewForm에 해당 리뷰 id부여 => 폼 전송시 해당 리뷰 수정하도록,
    this.$reviewForm.dataset.id = reviewId;
    // 데이터가 그대로 들어있는 입력 폼 등장시키기 위해
    // 해당 데이터를 서버에서 가져와야 한다. 
    const res = await axios.get(`/review/${reviewId}`);
    const review = res.data.review;
    // 그 데이터를 리뷰 폼에 입력한 상태로 리뷰 폼 보여주기
    this.$reviewForm.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.$reviewTitle.value = review.title;
    this.$textarea.value = review.text;
    // 텍스트 현재 글자 수 노출
    this.$textLengthElem.textContent = review.text.length;
    // 현재 평점 노출
    [...this.$reviewFormStars.children].forEach((item, index) => {
      if(index + 1 <= review.stars) {
        item.style.opacity = '1';
      } else if(index + 1 > review.stars) {
        item.style.opacity = '';
      }
    });
    this.reviewFormStar = review.stars;
    // 그리고 수정 후 전송하려면 다시 funSubmitForm으로 이동 
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 9 - 1. 수정을 요소에 반영
  // c는 해당 review-box
  funEditElem(c, obj) {
    console.log(c);
    // 제목, 텍스트, overText, stars, updatedAt수정
    c.querySelector('.review-box__title').textContent = obj.title;
    // 기존의 class를 review-box__info__stars__star만 남기고 추가해야
    [...c.querySelectorAll('.review-box__info__stars__star')].forEach((item, index) => {
      item.className = 'review-box__info__stars__star';
      item.classList.add(`${obj.stars[index]}`);
    });
    c.querySelector('.review-box__info__updatedDate').textContent = obj.updatedAt;
    console.log([...c.querySelectorAll('.review-box__text')]);
    c.querySelectorAll('.review-box__text')[0].hidden = false;
    c.querySelectorAll('.review-box__text')[1].hidden = false;
    console.log([...c.querySelectorAll('.review-box__text')]);

    if(!obj.text.slice) {
      // original 보여준다.
      c.querySelectorAll('.review-box__text')[0].textContent = obj.text.original;
    } else {
      // 200자를 넘어서 slice를 보여준다.
      c.querySelectorAll('.review-box__text')[0].textContent = `${obj.text.slice}...`;
      c.querySelectorAll('.review-box__text')[1].textContent = obj.text.original;
    }
    if(!obj.overText) {
      c.querySelector('.review-box__more').hidden = true;
    } else {
      c.querySelector('.review-box__more').hidden = false;
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 10. 삭제
  async funDelete(e) {
    const target = e.currentTarget;
    const box = target.closest('.review-box');
    const reviewId = box.dataset.reviewId;
    // this.bookId는 삭제 후 비어있는 공간을 채우기 위해 해당 책과 관련된 리뷰를 불러들어오기 위해 필요
    const res = await axios.delete(`/review/${reviewId}/${this.bookId}`);
    const review = res.data.review;   
    box.remove();
    this.totalReviewCount--;
    this.$totalReviewCount.textContent = this.totalReviewCount;
    const $reviewBoxes = document.querySelectorAll('.review-box');
    // 맨 마지막에 추가
    $reviewBoxes[$reviewBoxes.length - 1].after(this.funReviewDOM(this.$reviewClone.cloneNode(true), review));
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 11. pagenation
  async funPagenation(e) {
    e.preventDefault();
    const target = e.target.closest('.review-paganation__number');
    if(!target) return;
    // 1, 2, 3, 4, 5안에서 클릭했을때
    if(!this.nextPage) {
      // 처음에 클릭할때
      // this.currentPage는 1의 값
      this.nextPage = target.textContent;
    } else {
      // 두번째로 클릭할때
      // 현재의 nextPage를 currentPage에 할당하고
      // 새로 클릭하는 놈을 nextPage로 
      this.currentPage = this.nextPage;
      this.nextPage = target.textContent;
    }
    // 과거는 지우고
    [...this.$numberBtns][this.currentPage - 1].classList.remove('clicked');
    // 현재 업데이트
    [...this.$numberBtns][this.nextPage - 1].classList.add('clicked');
    const res = await axios.get(`/review/${this.bookId}/page/${this.nextPage}`);
    const reviews = res.data.reviews;
    this.$reivewContainer = document.querySelector('.review-container');
    for(let box of Array.from(this.$reivewContainer.children)) {
      box.remove();
    }
    reviews.forEach(item => {
      this.$reivewContainer.append(this.funChangeReviewDOM(document.querySelector('.review-box.review-box-for-clone').cloneNode(true), item));
    });
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 11 - 1. 페이지 관련 요소들 표시/비표시
  funPageElems() {
    if(this.totalReviewCount > 0) {
      // '리뷰 작성해주세요' 사라지고 페이지 넘버 등장
      this.$emptyReviewElem.hidden = true;
      this.$pagenation.hidden = false;
    } 
    if(this.totalReviewCount <= 25) {
      const pageNumber = (this.totalReviewCount % 5) === 0 ? this.totalReviewCount / 5 : Math.floor(this.totalReviewCount / 5) + 1;
      // 5개에서 6개로(1 -> 2), 10개에서 11개(2 -> 3)로 리뷰가 늘어나서
      // 페이지 넘버가 하나가 생겨야 할때만
      if(pageNumber !== this.pageNumber) {
        [...this.$numberBtns].forEach((item, index, arr) => {
          if(index + 1 <= pageNumber) {
            item.hidden = false;
            item.textContent = index + 1;
          } else {
            item.hidden = true;
          }
          // 마지막에 페이지 넘버 추가된거 반영
          if(index === arr.length - 1) this.pageNumber++;
        });    
      }
    } else if(this.totalReviewCount > 25) {
      [...this.$numberBtns].forEach((item, index) => {
        item.hidden = false;
        item.textContent = index + 1;
      });  
    }
  }  
  /* --------------------------------------------------------------------------------------------------------- */
  // 11 - 2. 요소 내용 바꾸기
  funChangeReviewDOM (c, obj) {
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
    c.querySelector('.review-box__info__updatedDate').textContent = obj.updatedAt;
    // 유저가 로그인 상태고, 유저의 아이디와 작성자의 아이디가 같다면 수정 + 삭제란 노출
    if(this.user && this.user.id === obj.MemberId) {
      c.querySelector('.review-box__is-user').hidden = false;
      c.querySelector('.review-box__info__edit').dataset.reviewId = obj.id;
      c.querySelector('.review-box__info__delete').dataset.reviewId = obj.id;
    } else {
      c.querySelector('.review-box__is-user').hidden = true;
    }
    // 만약 text.slice가 null이라면 1000자를 안 넘는다는 뜻이고 그럼 그대로 original 보여준다.
    // 만약 1000자를 넘으면 보여지는건 slice버전, original은 숨겨뒀다가 더보기버튼을 누르면 바꾸기
    // querySelectorAll은 hidden까지 카운트한다. 
    if(!obj.text.slice) {
      // original 보여준다.
      c.querySelectorAll('.review-box__text')[0].textContent = obj.text.original;
      c.querySelectorAll('.review-box__text')[1].hidden = true;
    } else {
      // 200자를 넘어서 slice를 보여준다.
      c.querySelectorAll('.review-box__text')[0].textContent = `${obj.text.slice}...`;
      c.querySelectorAll('.review-box__text')[1].textContent = obj.text.original;
    }
    if(!obj.overText) {
      c.querySelector('.review-box__more').hidden = true;
    } else {
      c.querySelector('.review-box__more').hidden = false;
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
  // 11 - 3. 맨 마지막 페이지 클릭
  funLastPage(e) {
  }
}

const book = new Book();
book.funPageElems();


