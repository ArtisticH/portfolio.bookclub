
class Book {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 1. 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
    this.$form = document.getElementById('review-form');
    this.$book = document.getElementById('book');
    this._userId = this.$book.dataset.userId;
    // 평점 줄때
    this.$formStars = document.querySelector('.review-form__stars');
    // 제목 입력칸
    this.$titleInput = document.querySelector('.review-form__input__title');
    // 내용 입력칸
    this.$textarea = document.getElementById('review-form__text');
    // 현재 입력 글자 수
    this.$textCheck = document.querySelector('.review-form__text__length');
    // 서버에 보낼 별 갯수
    this._formStar = null;
    this.$writeBtn = document.querySelector('.review__write');
    // 등록 버튼 클릭
    this.$writeBtn.onclick = this.showForm.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    // 2. 취소 버튼 누르면 리뷰 폼 사라지기
    this.$cancel = document.querySelector('.review-form__cancel');
    this.$cancel.onclick = this.disappearForm.bind(this);
    /* --------------------------------------------------------------------------------------------------------- */
    // 3. 리뷰 폼 작성시 별점 선택
    this.clickStars = this.clickStars.bind(this);
    this.$formStars.addEventListener('click', this.clickStars);
    /* --------------------------------------------------------------------------------------------------------- */
    // 4. 몇 글자 입력했는지 보여주기
    this.TEXT_LIMIT = 3000;
    this.$limit = document.querySelector('.review-form__text__length__limit');
    this.$limit.textContent = this.TEXT_LIMIT;
    this.countText = this.countText.bind(this);
    this.$textarea.addEventListener('input', this.countText);
    this.countTitle = this.countTitle.bind(this);
    this.$titleInput.addEventListener('input', this.countTitle);
    /* --------------------------------------------------------------------------------------------------------- */
    // 5. 리뷰 DB에 등록
    this._bookId = new URL(location.href).pathname.split('/')[2];
    this.OVERTEXT_LIMIT = 200;
    this.submit = this.submit.bind(this);
    this.$totalReview = document.querySelector('.review-title__total');
    // 가장 처음에 넌적스로 서버에서 내림받은 데이터 사용
    this._totalReview = this.$totalReview.textContent;
    // 이 친구를 계속 복사해서 리뷰 등록, 페이지네이션 시에 사용
    this.$clone = document.querySelector('.review-box-for-clone');
    /* --------------------------------------------------------------------------------------------------------- */
    // 6. 더보기
    this.$moreBtns = document.querySelectorAll('.review-box__more');
    [...this.$moreBtns].forEach(btn => {
      btn.addEventListener('click', this.clickMore);
    });
    /* --------------------------------------------------------------------------------------------------------- */
    // 7. 공감
    this.$heartBtns = document.querySelectorAll('.review-box__heart');
    this.clickHeart = this.clickHeart.bind(this);
    [...this.$heartBtns].forEach(btn => {
      btn.addEventListener('click', this.clickHeart);
    })
    /* --------------------------------------------------------------------------------------------------------- */
    // 8. 리뷰 작성시 별점 매기기, 텍스트 입력, 타이틀 입력 모두 해야 전송되게끔
    this.$submitBtn = document.querySelector('.review-form__submit');
    this._titleCheck = null;
    this._textCheck = null;
    this.stopSubmit = this.stopSubmit.bind(this);
    this.countTitle = this.countTitle.bind(this);
    // 기본 상태: 버튼 비활성화
    // 조건을 다 충족시키면 버튼 활성화시켜야 한다. 
    this.$form.onsubmit = this.stopSubmit;
    this.$titleInput.addEventListener('input', this.countTitle);
    /* --------------------------------------------------------------------------------------------------------- */
    // 9. 수정
    this.$editBtns = document.querySelectorAll('.review-box__info__edit');
    this.clickEdit = this.clickEdit.bind(this);
    [...this.$editBtns].forEach(btn => {
      btn.addEventListener('click', this.clickEdit);
    });
    this.$edit = null;
    /* --------------------------------------------------------------------------------------------------------- */
    // 10. 삭제
    this.$deleteBtns = document.querySelectorAll('.review-box__info__delete');
    this.$reivewContainer = document.querySelector('.review-container');
    this.clickDelete = this.clickDelete.bind(this);
    [...this.$deleteBtns].forEach(btn => {
      btn.addEventListener('click', this.clickDelete);
    });
    /* --------------------------------------------------------------------------------------------------------- */
    // 11. 첫 리뷰 등록 후 보이는 화면
    // 첫 리뷰글을 등록하면 $empty 사라지고 $pagenation활성화된다. 
    this.$empty = document.querySelector('.empty-review');
    this.$pagenation = document.querySelector('.review-paganation');
    this._lastPage = (this._totalReview % 5) === 0 ? this._totalReview / 5 : Math.floor(this._totalReview / 5) + 1;
    this.$numbers = document.querySelector('.review-paganation__numbers');
    this.$number = document.querySelectorAll('.review-paganation__number');
    /* --------------------------------------------------------------------------------------------------------- */
    // 12. 페이지 버튼 클릭 시
    this.$beforePage = null;
    this.$currentPage = [...this.$number][0];
    this.$currentPage.classList.add('clicked');
    this.$afterIcon = document.querySelector('.review-paganation__after');
    this.$beforeIcon = document.querySelector('.review-paganation__before');
    this.$firstIcon = document.querySelector('.review-paganation__first');
    this.$lastIcon = document.querySelector('.review-paganation__last');
    // 이벤트 위임
    this.$pagenation.onclick = this.pagenation.bind(this);
}
  /* --------------------------------------------------------------------------------------------------------- */
  // 1. 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
  showForm(e) {
    if(this._userId) {
      // 로그인한 상태
      // 리뷰 폼 등장
      this.$form.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // 아래 세 가지가 모두 true여야 버튼이 활성화되는데,
      // 폼을 처음 등록할때는 null로 초기화
      this._formStar = null;
      this._titleCheck = null;
      this._textCheck = null; 
      this.stopSubmitBtn(); 
    } else {
      alert('로그인 후 이용하세요.');
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 2. 취소 버튼 누르면 리뷰 폼 사라지기
  disappearForm() {
    // 평점들 다 없애기
    [...this.$formStars.children].forEach((item) => {
      // opacity: 0.5로 
      item.style.opacity = '';
    });    
    // 텍스트, 타이틀, 글자 수 초기화
    this.$titleInput.value = '';
    // 현재 몇 글자인지 알려주는
    this.$textCheck.textContent = 0;
    this.$textarea.value = '';
    this.$form.style.display = '';
    document.body.style.overflow = '';
  }
  // 등록 버튼 비활성화시키고, 등록시에도 아무 효과 없게
  stopSubmitBtn() {
    this.$submitBtn.style.opacity = '0.5';
    this.$submitBtn.style.cursor = 'auto'; 
    this.$form.onsubmit = this.stopSubmit; 
  }
  playSubmitBtn() {
    this.$submitBtn.style.opacity = '';
    this.$submitBtn.style.cursor = ''; 
    this.$form.onsubmit = this.submit; 
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 3. 리뷰 폼 작성시 별점 선택
  clickStars(e) {
    const target = e.target.closest('.review-form__star');
    // 별이 아니면 나가
    if(!target) return;
    // 0, 1, 2, 3, 4 중 하나
    const rate = +target.dataset.star;
    [...this.$formStars.children].forEach((item, index) => {
      if(index <= rate) {
        item.style.opacity = '1';
      } else if(index > rate) {
        item.style.opacity = '';
      }
    });
    // 최종 선택 별점 1, 2, 3, 4, 5중 하나
    // 등록 버튼 활성화 조건 중 하나
    this._formStar = rate + 1;
    if(this._textCheck && this._formStar && this._titleCheck) {
      this.playSubmitBtn();
    } else {
      this.stopSubmitBtn();
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 4. 몇 글자 입력했는지 보여주기
  countText(e) {
    if(e.target.value.length > this.TEXT_LIMIT) {
      alert(`${this.TEXT_LIMIT}자 이내로 입력해주세요.`);
      // 글자 더 이상 입력 못하고 3000자에 머무르게
      e.target.value = e.target.value.slice(0, 3000);
      this.$textCheck.textContent = e.target.value.length;
    }
    if(e.target.value.length > 0) {
      // 입력을 했다 => 등록 버튼 활성화의 조건 중 하나
      this._textCheck = true;
    } else if (e.target.value.length === 0) {
      // 입력 안 했다 => 등록 버튼 비활성화 조건 중 하나
      this._textCheck = null;
    }
    this.$textCheck.textContent = e.target.value.length;
    if(this._titleCheck && this._formStar && this._textCheck) {
      this.playSubmitBtn();
    } else {
      console.log('sssss')
      this.stopSubmitBtn();
    }
  }
  countTitle(e) {
    if(e.target.value.length > 0) {
      this._titleCheck = true;
    } else if (e.target.value.length === 0) {
      this._titleCheck = null;
    }
    if(this._textCheck && this._formStar && this._titleCheck) {
      this.playSubmitBtn();
    } else {
      this.stopSubmitBtn();
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 5. 리뷰 DB에 등록
  async submit(e) {
    try {
      e.preventDefault();
      // 만약 업데이트라면 ID가 있을 것이고 새로 추가하는 거라면 ID가 서버에서 생성될 터
      const id = this.$form.dataset.id;
      const title = e.target.title.value;
      const text = e.target.text.value;
      const overText = (e.target.text.value.length > this.OVERTEXT_LIMIT) ? true : false;
      this.disappearForm();
      if(!id) {
        const res = await axios.post('/review', {
          title,
          text,
          overText,
          stars: this._formStar,
          bookId: this._bookId,
        }); 
        const review = res.data.review;   
        this._totalReview++;
        this.$totalReview.textContent = this._totalReview;
        this._lastPage = (this._totalReview % 5) === 0 ? this._totalReview / 5 : Math.floor(this._totalReview / 5) + 1;
        const $reviewBoxes = [...document.querySelectorAll('.review-box')];
        // 만약 리뷰 총 개수가 5개 미만이면 하나씩 맨 앞에 추가하고
        // 그렇지 않다면 가장 위에 리뷰 추가하며 동시에 가장 아래의 리뷰도 삭제
        if(this._totalReview <= 5) {
          // 맨처음 등록이라면 $reviewBoxes가 없음.
          this.$reivewContainer.prepend(this.reviewDOM(this.$clone.cloneNode(true), review));
        } else {
          $reviewBoxes[0].before(this.reviewDOM(this.$clone.cloneNode(true), review));
          $reviewBoxes[$reviewBoxes.length - 1].remove();
        }
        // 아예 처음에 글을 등록하는 경우
        // '리뷰를 작성해주세요' 없애고 페이지 넘버 활성화
        this.showPage();
      } else {
        // 몇번 리뷰를 수정해라
        const res = await axios.patch(`/review`, {
          id,
          title,
          text,
          overText,
          stars: this._formStar,
        }); 
        const review = res.data.review;   
        // 수정 분 바로 반영
        // this.$edit은 해당 .review-box
        this.editDOM(this.$edit, review);
      }
    } catch (err) {
      console.error(err);
    }
  }
  // c: this.$clone.cloneNode(true), 복사를 위해 존재하는 요소를 복사한 노드
  reviewDOM (c, obj) {
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
    if(this._userId == obj.MemberId) {
      c.querySelector('.review-box__is-user').hidden = false;
    } else {
      c.querySelector('.review-box__is-user').hidden = true;
    }
    c.querySelectorAll('.review-box__text')[0].hidden = false;
    c.querySelectorAll('.review-box__text')[1].hidden = true;
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
    c.querySelector('.review-box__heart__total').textContent = obj.like;
    // 새로 추가되는 요소에도 이벤트를 추가해야 한다.
    c.querySelector('.review-box__info__edit').onclick = this.clickEdit;
    c.querySelector('.review-box__info__delete').onclick = this.clickDelete;
    c.querySelector('.review-box__more').onclick = this.clickMore;
    c.querySelector('.review-box__heart').onclick = this.clickHeart;
    return c;
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 6. 더보기
  clickMore(e) {
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
  async clickHeart(e) {
    // 로그인 안했으면 접근 금지
    if(!this._userId) {
      alert('로그인 후 이용해주세요');
      return;
    }
    const box = e.currentTarget.closest('.review-box');
    const id = box.dataset.reviewId;
    // 위로 올라가는 하트
    const $img = box.querySelector('.review-box__heart__img');
    const $like = box.querySelector('.review-box__heart__total');
    const res = await axios.post(`/review/like`, { id });
    // 서버에서 보내온 클릭해도 되는지 안되는지 여부
    const clickAllowed = res.data.clickAllowed;
    if(clickAllowed) {
      // 클릭이 처음이라면
      $like.textContent = res.data.like;
      // 하트 위로 올라가는 효과
      $img.classList.add('back');
    } else {
      // 이미 클릭한 상태라면, 클릭한 거 취소
      const res = await axios.post(`/review/like/cancel`, { id });
      $like.textContent = res.data.like;
      $img.classList.remove('back');
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 8. 리뷰 작성시 별점 매기기, 텍스트 입력, 타이틀 입력 모두 해야 전송되게끔
  stopSubmit(e) {
    e.preventDefault();
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 9. 수정
  // 수정 버튼 클릭하면 다시 입력 폼이 나오고, 
  // 그 입력 폼 버튼 클릭하면 수정 내용이 서버에 전송된다.
  async clickEdit(e) {
    // 수정 버튼
    const target = e.currentTarget;
    const box = target.closest('.review-box');
    this.$edit = box;
    const reviewId = box.dataset.reviewId;
    // $form에 해당 리뷰 id부여 => 폼 전송시 해당 리뷰 수정하도록,
    this.$form.dataset.id = reviewId;
    // 데이터가 그대로 들어있는 입력 폼 등장시키기 위해
    // 해당 데이터를 서버에서 가져와야 한다. 
    const res = await axios.get(`/review/${reviewId}`);
    const review = res.data.review;
    // 그 데이터를 리뷰 폼에 입력한 상태로 리뷰 폼 보여주기
    this.$form.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    this.$titleInput.value = review.title;
    this.$textarea.value = review.text;
    if(review.title.length > 0) this._titleCheck = true;
    if(review.text.length > 0) this._textCheck = true;
    // 텍스트 현재 글자 수 노출
    this.$textCheck.textContent = review.text.length;
    // 현재 평점 노출
    [...this.$formStars.children].forEach((item, index) => {
      if(index + 1 <= review.stars) {
        item.style.opacity = '1';
      } else if(index + 1 > review.stars) {
        item.style.opacity = '';
      }
    });
    this._formStar = review.stars;
    // 그리고 수정 후 전송하려면 다시 submit으로 이동 
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 9 - 1. 수정을 요소에 반영
  // c는 해당 review-box
  editDOM(c, obj) {
    // 제목, 텍스트, overText, stars, updatedAt수정
    c.querySelector('.review-box__title').textContent = obj.title;
    // 기존의 class를 review-box__info__stars__star만 남기고 추가해야
    [...c.querySelectorAll('.review-box__info__stars__star')].forEach((item, index) => {
      item.className = 'review-box__info__stars__star';
      item.classList.add(`${obj.stars[index]}`);
    });
    c.querySelector('.review-box__info__updatedDate').textContent = obj.updatedAt;
    c.querySelectorAll('.review-box__text')[0].hidden = false;
    c.querySelectorAll('.review-box__text')[1].hidden = true;
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
  async clickDelete(e) {
    const target = e.currentTarget;
    const box = target.closest('.review-box');
    const reviewId = box.dataset.reviewId;
    box.remove();
    // 삭제
    await axios.delete(`/review/${reviewId}`);
    this._totalReview--;
    this.$totalReview.textContent = this._totalReview;
    const currentPage = this.$currentPage.textContent;
    // totalReview가 5개 이상이면 하나를 추가해야 하지만
    // 5개 미만이면 하나 추가하지 않는다. 
    if(this._totalReview >= 5) {
      const res = await axios.get(`/review/delete/${this._bookId}/${currentPage}`);
      const review = res.data.review;   
      // 가장 마지막에 추가
      this.$reivewContainer.append(this.reviewDOM(this.$clone.cloneNode(true), review));
    }
    this.showPage();
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 11. 첫 리뷰 등록 후 보이는 화면
  showPage() {
    if(this._totalReview > 0) {
      // '리뷰 작성해주세요' 사라지고 페이지 넘버 등장
      if(this.$empty) {
        this.$empty.hidden = true;
      }
      this.$pagenation.hidden = false;
      this.$numbers.hidden = false;
    } else if(this._totalReview === 0){
      this.$empty.hidden = false;
      this.$pagenation = true;
      this.$numbers.hidden = true;
    }
    if(this._totalReview > 5) {
      // 페이지 버튼이 최소 1, 2 두가지 일때
      this.$afterIcon.hidden = false;
    } else {
      // 페이지 버튼이 1밖에 없을때
      this.$afterIcon.hidden = true;
    }
    if(this._totalReview <= 25) {
      this.$lastIcon.hidden = true;
      this.$firstIcon.hidden = true;
      [...this.$number].forEach((item, index) => {
        if(index + 1 <= this._lastPage) {
          item.hidden = false;
          item.textContent = index + 1;
        } else {
          item.hidden = true;
        }
      });
    } else if(this._totalReview > 25) {
      this.$lastIcon.hidden = false;
      this.$firstIcon.hidden = false;
      // 25개 이상이면 항상 1, 2, 3, 4, 5가 보여야 한다. 
      [...this.$number].forEach((item, index) => {
        item.hidden = false;
        item.textContent = index + 1;
      });  
    }
    // 아예 처음 렌더링(this.$nextPage이 null)할때 <와 << 없애기
    // 가장 아래에 둠으로써 우선순위 높게
    if(!this.$nextPage) {
      this.$beforeIcon.hidden = true;
      this.$firstIcon.hidden = true;
    }     
  }  
  /* --------------------------------------------------------------------------------------------------------- */
  // 12. 페이지 버튼 클릭 시
  async pagenation(e) {
    // 아이콘의 경우 img가 되니까 그 위의 div로 잡아주기
    const target = e.target.closest('div');
    if(target.className === 'review-paganation__number') {
      this.clickNumbers(target);
    } else if(target === this.$afterIcon) {
      console.log(target === this.$afterIcon)
      this.clickAfter();
      if(!this.$nextPage) {
        // 브라우저 렌더링되고 가장 먼저 클릭할때, this.nextPage는 null,
        // 만약 2를 클릭했다? this.nextPage는 2가 된다.
        this.$nextPage = this.$currentPage.nextElementSibling;
      } else {
        // 첫 번째 클릭이 아닐때, 내가 맨 처음에 1에서 2를 클릭하고
        // 이번엔 2에서 4를 클릭한다고 해보자.
        // this.nextPage는 4가 되고, this.currentPage는 2가 된다. 
        this.$currentPage = this.$nextPage;
        this.$nextPage = this.$currentPage.nextElementSibling && this.$currentPage.nextElementSibling;
      }
      // 현재 페이지 넘버가 5의 배수이고, 5나 10이나 15나...
      // 현재 페이지를 넘는 페이지가 존재할때는 다음 화면들을 보여주고
      if(this.$currentPage.textContent % 5 == 0 && this.$currentPage.textContent < this._lastPage) {
        // 페이지 넘버들 다시 보여줘
        let start = Number(this.$currentPage.textContent) + 1;
        const end = this._lastPage;
        [...this.$number].forEach((item, index) => {
          if(start % 5 == index + 1 && start <= end) {
            item.hidden = false;
            item.textContent = start;
          } else if(start > end) {
            item.hidden = true;
          }
          start++;
        });
        this.$nextPage = [...this.$number][0];
      }
    } else if(target.className === this.$beforeIcon) {
      console.log(target === this.$beforeIcon)

      this.clickBefore();
      if(!this.$nextPage) {
        return;
      } else {
        // 첫 번째 클릭이 아닐때, 내가 맨 처음에 1에서 2를 클릭하고
        // 이번엔 2에서 4를 클릭한다고 해보자.
        // this.nextPage는 4가 되고, this.currentPage는 2가 된다. 
        this.$currentPage = this.$nextPage;
        this.$nextPage = this.$currentPage.previousElementSibling && this.$currentPage.previousElementSibling;
      }
      // 현재 페이지 넘버가 1, 6, 11, 16처럼 % 5가 1이고
      // 가장 처음 페이지가 아닐때
      if(this.$currentPage.textContent % 5 == 1 && this.$currentPage.textContent != 1) {
        // 페이지 넘버들 다시 보여줘
        let start = this.$currentPage.textContent - 5;
        [...this.$number].forEach((item, index) => {
          item.hidden = false;
          item.textContent = start;
          start++;
        });
        this.$nextPage = [...this.$number][4];
      }
    } else if(target.className === this.$lastIcon) {
      console.log(target === this.$lastIcon)

      this.clickLast();
      const end = this._lastPage;
      // 만약 마지막 페이지가 14라면, end % 5는 4다. 
      // 이건, 처음의 요소로부터 3칸 떨어져있다는 뜻으로 
      // end에서 - (end % 5) + 1를 하면 처음의 요소 페이지를 구할 수 있다. 
      let start = end - (end % 5) + 1;
      [...this.$number].forEach((item, index) => {
        if(start % 5 == index + 1 && start <= end) {
          item.hidden = false;
          item.textContent = start;
        } else if(start > end) {
          item.hidden = true;
        }
        start++;
      });
      if(this.$nextPage) {
        this.$currentPage = this.$nextPage;
      }
      this.$nextPage = [...this.$number][end % 5 - 1];
    } else if(target.className === this.$firstIcon) {
      console.log(target === this.$firstIcon)

      this.clickFirst();
      [...this.$number].forEach((item, index) => {
        item.hidden = false;
        item.textContent = index + 1;
      });
      this.$currentPage = this.$nextPage;
      this.$nextPage = [...this.$number][0];
    }

    // 마지막 버튼 클릭 시
    if(this.$nextPage.textContent == this._lastPage) {
      this.$afterIcon.hidden = true;
      this.$lastIcon.hidden = true;
    } else {
      this.$afterIcon.hidden = false;
      this.$lastIcon.hidden = false;
    }
    // 맨 처음 버튼 클릭 시
    if(this.$nextPage.textContent == 1) {
      this.$firstIcon.hidden = true;
      this.$beforeIcon.hidden = true;
    } else {
      this.$firstIcon.hidden = false;
      this.$beforeIcon.hidden = false;
    }
    // 현재 1에 활성화가 되어있다면
    // <와 << 없애기
    if(this.$nextPage.textContent == 1) {
      this.$beforeIcon.hidden = true;
      this.$firstIcon.hidden = true;
    } else {
      this.$beforeIcon.hidden = false;
      this.$firstIcon.hidden = false;
    }
    // 과거는 지우고, currentPage
    this.$currentPage && this.$currentPage.classList.remove('clicked');
    // 현재 업데이트, nextPage
    this.$nextPage.classList.add('clicked');
  }

  async clickNumbers(target) {
    this.$beforePage = this.$currentPage;
    this.$currentPage = target;
    this.$beforePage.classList.remove('clicked');
    this.$currentPage.classList.add('clicked');   
    const res = await axios.get(`/review/page/${this._bookId}/${this.$currentPage.textContent}`);
    const reviews = res.data.reviews;
    [...this.$reivewContainer.children].forEach(item => {
      item.remove();
    });
    [...reviews].forEach(item => {
      this.$reivewContainer.append(this.reviewDOM(this.$clone.cloneNode(true), item));
    });
  }

  clickBefore() {
  }

  clickAfter() {
    console.log('애프터');

  }

  clickLast() {
    console.log('라스트');

  }

  clickFirst() {
    console.log('퍼스트');

  }
}


const book = new Book();
book.showPage();


