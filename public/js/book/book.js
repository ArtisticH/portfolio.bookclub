
class Book {
  constructor() {
    /* --------------------------------------------------------------------------------------------------------- */
    // 리뷰 폼 클릭 시 로그인 상태라면 보여주고 아니라면 alert함수
    this.$form = document.getElementById('review-form');
    this.$book = document.getElementById('book');
    this._userId = this.$book.dataset.userId;
    this._bookId = new URL(location.href).pathname.split('/')[2];
    // 리뷰 작성 버튼 클릭 시 폼 보여주기
    this.$writeBtn = document.querySelector('.review-write-btn');
    this.$writeBtn.onclick = this.showForm.bind(this);
    // 취소 버튼 누르면 리뷰 폼 사라지기
    this.$cancel = document.querySelector('.form__cancel');
    this.$cancel.onclick = this.disappearForm.bind(this);
    // 등록 버튼
    this.$submitBtn = document.querySelector('.submit');
    // 등록 버튼 활성화 조건들
    this._formStar = null;
    this._titleCheck = null;
    this._textCheck = null; 
    // 리뷰 폼 작성시 별점 선택
    this.$formStars = document.querySelector('.form__stars');
    this.clickStars = this.clickStars.bind(this);
    this.$formStars.addEventListener('click', this.clickStars);
    // form 요소들
    this.$inputTitle = document.querySelector('.input__title');
    this.$textarea = document.getElementById('textarea');
    this.$textareaLength = document.querySelector('.textarea__length');    
    // 타이틀 입력 시 등록 버튼 조건 변경
    this.titleCheck = this.titleCheck.bind(this);
    this.$inputTitle.addEventListener('input', this.titleCheck);
    // 몇 글자 입력했는지 보여주고, 등록 조건 변경 결정, 체크
    this.TEXTAREA_LIMIT = 3000;
    this.countText = this.countText.bind(this);
    this.$textarea.addEventListener('input', this.countText);
    // 리뷰 DB에 등록
    this.OVERTEXT_LIMIT = 200;
    this.$totalReview = document.querySelector('.review-total');
    this.$reivewContainer = document.querySelector('.review-container');
    this._totalReview = +this.$totalReview.textContent;
    this._lastPage = (this._totalReview % 5) === 0 ? (this._totalReview / 5) : (Math.floor(this._totalReview / 5) + 1);
    this.submit = this.submit.bind(this);
    // 가장 처음에 넌적스로 서버에서 내림받은 데이터 사용
    // 이 친구를 계속 복사해서 리뷰 등록, 페이지네이션 시에 사용
    this.$clone = document.querySelector('.rebox.clone');
    this.$empty = document.querySelector('.review-empty');
    // 페이지네이션
    this.$pagenation = document.querySelector('.pagenation');
    this.$numbers = document.querySelector('.page-numbers');
    this.$number = document.querySelectorAll('.page-number');
    this.$first = document.querySelector('.page-first');
    this.$before = document.querySelector('.page-before');
    this.$after = document.querySelector('.page-after');
    this.$last = document.querySelector('.page-last');
    this.$pagenation.onclick = this.pagenation.bind(this);
    // 다른 페이지 클릭 시 이전 페이지
    this.$ex = null;
    // 일단 현재 페이지는 항상 1로
    this.$current = [...this.$number][0];
    this.$current.classList.add('clicked');
    this._direction = null;
    this._cur = 1;
    this._ex = null;
    // 더보기 버튼
    this.$moreBtns = document.querySelectorAll('.more-btn');
    [...this.$moreBtns].forEach(btn => {
      btn.addEventListener('click', this.more);
    });
    // 공감 버튼
    this.$heartBtns = document.querySelectorAll('.heart');
    this.heart = this.heart.bind(this);
    [...this.$heartBtns].forEach(btn => {
      btn.addEventListener('click', this.heart);
    })
    // 수정 버튼
    this.$editBtns = document.querySelectorAll('.rebox__edit');
    this.edit = this.edit.bind(this);
    [...this.$editBtns].forEach(btn => {
      btn.addEventListener('click', this.edit);
    });
    this.$edit = null;
    // 삭제 버튼
    this.$deleteBtns = document.querySelectorAll('.rebox__delete');
    this.delete = this.delete.bind(this);
    [...this.$deleteBtns].forEach(btn => {
      btn.addEventListener('click', this.delete);
    });
    this.searchParams = new URL(location.href).searchParams;
    this.alert = this.alert.bind(this);
    // 등록, 삭제, 업데이트 시 평점 업데이트
    this.$starArr = document.querySelectorAll('.book-star');
    this.$starSum = document.querySelector('.book-numbers__current');
  }
  showForm(e) {
    if(this._userId) {
      // 로그인한 상태
      // 리뷰 폼 등장
      this.$form.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      // 아래 세 가지가 모두 true여야 버튼이 활성화되는데,
      // 폼을 처음 등록할때는 null로 초기화
      this.resetCondition();
      // 등록 버튼 비활성화, 버튼 눌러도 아무일도 안 일어남
      this.stopSubmitBtn(); 
    } else {
      alert('로그인 후 이용하세요.');
    }
  }
  resetCondition() {
    this._formStar = null;
    this._titleCheck = null;
    this._textCheck = null; 
  }
  // 등록 버튼 비활성화시키고, 등록시에도 아무 효과 없게
  stopSubmitBtn() {
    this.$submitBtn.style.opacity = '0.5';
    this.$submitBtn.style.cursor = 'auto'; 
    this.$form.onsubmit = this.stopSubmit; 
  }
  stopSubmit(e) {
    e.preventDefault();
  }
  playSubmitBtn() {
    this.$submitBtn.style.opacity = '';
    this.$submitBtn.style.cursor = ''; 
    // 리뷰를 데이터베이스에 등록
    this.$form.onsubmit = this.submit; 
  }  
  /* --------------------------------------------------------------------------------------------------------- */
  clickStars(e) {
    const target = e.target.closest('.form__star');
    // 별이 아니면 나가
    if(!target) return;
    // 0, 1, 2, 3, 4 중 하나
    const rate = +target.dataset.star;
    [...this.$formStars.children].forEach((item, index) => {
      if(index <= rate) {
        item.style.opacity = '1';
      } else if(index > rate) {
        // 기본이 불투명 0.5
        item.style.opacity = '';
      }
    });
    // 최종 선택 별점 1, 2, 3, 4, 5중 하나
    // 등록 버튼 활성화 조건 중 하나
    this._formStar = rate + 1;
    this.check();
  }  
  check() {
    if(this._textCheck && this._formStar && this._titleCheck) {
      this.playSubmitBtn();
    } else {
      this.stopSubmitBtn();
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  disappearForm() {
    // 평점들 다 없애기
    [...this.$formStars.children].forEach((item) => {
      // opacity: 0.5로 
      item.style.opacity = '';
    });    
    // 텍스트, 타이틀, 글자 수 초기화
    this.resetForm();
    this.$form.style.display = '';
    document.body.style.overflow = '';
  }
  resetForm() {
    this.$inputTitle.value = '';
    this.$textareaLength.textContent = 0;
    this.$textarea.value = '';
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 몇 글자 입력했는지 보여주고, 등록 조건 변경 결정, 
  countText(e) {
    if(e.target.value.length > this.TEXTAREA_LIMIT) {
      alert(`${this.TEXTAREA_LIMIT}자 이내로 입력해주세요.`);
      // 글자 더 이상 입력 못하게
      e.target.value = e.target.value.slice(0, 3000); // 마지막 미포함
      this.$textareaLength.textContent = e.target.value.length;
    }
    this.$textareaLength.textContent = e.target.value.length;
    if(e.target.value.length > 0) {
      // 입력을 했다 => 등록 버튼 활성화의 조건 중 하나
      this._textCheck = true;
    } else if (e.target.value.length === 0) {
      // 입력 안 했다 => 등록 버튼 비활성화 조건 중 하나
      this._textCheck = null;
    }
    this.check();
  }
  // 타이틀을 입력했으면 등록 조건 중 하나 바꾸고, 체크
  titleCheck(e) {
    if(e.target.value.length > 0) {
      this._titleCheck = true;
    } else if (e.target.value.length === 0) {
      this._titleCheck = null;
    }
    this.check();
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 5. 리뷰 DB에 등록
  async submit(e) {
    try {
      e.preventDefault();
      // 만약 업데이트라면 리뷰 ID가 있을 것이고 
      // 새로 추가하는 거라면 리뷰 ID가 서버에서 생성될 터
      const id = this.$form.dataset.id;
      const title = e.target.title.value;
      const text = e.target.text.value;
      const overText = (e.target.text.value.length > this.OVERTEXT_LIMIT) ? true : false;
      this.disappearForm();
      if(!id) {
        // 수정이 아닌 등록
        const res = await axios.post('/review', {
          title,
          text,
          overText,
          stars: this._formStar,
          BookId: this._bookId,
          MemberId: this._userId,
        }); 
        const review = res.data.review;   
        const starArr = res.data.starArr;
        const starSum = res.data.starSum;
        this.star(starArr, starSum);    
        this.$totalReview.textContent = ++this._totalReview;
        // 마지막 페이지 다시 계산
        this._lastPage = (this._totalReview % 5) === 0 ? this._totalReview / 5 : Math.floor(this._totalReview / 5) + 1;
        // 만약 추가된 리뷰까지 합해서 5개 이하라면 하나씩 맨 앞에 추가하고
        // 5개 초과라면 가장 위에 리뷰 추가고 동시에 가장 아래의 리뷰도 삭제
        if(this._totalReview <= 5) {
          // prepend: node 맨 앞에
          this.$reivewContainer.prepend(this.reviewDOM(this.$clone.cloneNode(true), review));
        } else {
          // before: node 이전에
          [...this.$reivewContainer.children][0].before(this.reviewDOM(this.$clone.cloneNode(true), review));
          const length = [...this.$reivewContainer.children].length;
          [...this.$reivewContainer.children][length - 1].remove();
        }
        // 아예 처음에 글을 등록하는 경우
        // '리뷰를 작성해주세요' 없애고 페이지 넘버 활성화
        // 그 외에 페이지넘버 추가 결정
        this.showPage();
      } else {
        // 몇번 리뷰를 수정해라
        const res = await axios.patch(`/review`, {
          id,
          title,
          text,
          overText,
          stars: this._formStar,
          BookId: this._bookId,
        }); 
        const review = res.data.review;  
        const starArr = res.data.starArr;
        const starSum = res.data.starSum;
        this.star(starArr, starSum);     
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
    c.className = 'rebox';
    c.hidden = false;
    c.dataset.reviewId = obj.id;
    c.querySelector('.rebox__title').textContent = obj.title;
    [...c.querySelectorAll('.rebox__star')].forEach((item, index) => {
      item.classList.add(`${obj.stars[index]}`);
    });
    c.querySelector('.rebox__type').textContent = obj.type;
    c.querySelector('.rebox__nickname').textContent = obj.nick;
    c.querySelector('.rebox__nickname').href = `/member/${obj.MemberId}`;
    c.querySelector('.rebox__date').textContent = obj.createdAt;
    c.querySelector('.rebox__updatedDate').textContent = obj.updatedAt;
    // 유저의 아이디와 작성자의 아이디가 다르다면 수정/삭제 비활성화
    if(this._userId != obj.MemberId) {
      c.querySelector('.rebox__user').hidden = true;
    } 
    c.querySelectorAll('.rebox__text')[0].hidden = false;
    c.querySelectorAll('.rebox__text')[1].hidden = true;
    if(!obj.text.slice) {
      // original 보여준다.
      c.querySelectorAll('.rebox__text')[0].textContent = obj.text.original;
    } else {
      // 200자를 넘어서 slice를 보여준다.
      c.querySelectorAll('.rebox__text')[0].textContent = `${obj.text.slice}...`;
      c.querySelectorAll('.rebox__text')[1].textContent = obj.text.original;
    }
    if(!obj.overText) {
      c.querySelector('.more-btn').hidden = true;
    } 
    c.querySelector('.heart-total').textContent = obj.like;
    // 새로 추가되는 요소에도 이벤트를 추가해야 한다.
    c.querySelector('.rebox__edit').onclick = this.edit;
    c.querySelector('.rebox__delete').onclick = this.delete;
    c.querySelector('.more-btn').onclick = this.more;
    c.querySelector('.heart').onclick = this.heart;
    return c;
  }
  firstReview() {
    this.$empty.hidden = true;
    this.$pagenation.hidden = false;
    this.$numbers.hidden = false;
  }
  zeroReview() {
    this.$empty.hidden = false;
    this.$pagenation.hidden = true;
    this.$numbers.hidden = true;
  }
  // 얘는 첫 글 보여줄때와 1페이지에서 계속 글을 등록할때만 유효
  showPage() {
    // 첫 글 등록시 
    // 아니면 글을 다 삭제할때
    if(this._totalReview > 0) {
      this.firstReview();
    } else if(this._totalReview === 0) {
      this.zeroReview();
    }
    if(this._totalReview > 5) {
      // 페이지 버튼이 최소 1, 2 두가지 일때
      this.$after.hidden = false;
      this.$before.hidden = false;
    } else {
      // 페이지 버튼이 1밖에 없을때
      this.$after.hidden = true;
      this.$before.hidden = true;
    }
    // 리뷰가 25개 미만일때
    if(this._totalReview <= 25) {
      this.$last.hidden = true;
      this.$first.hidden = true;
      [...this.$number].forEach((item, index) => {
        if(index + 1 <= this._lastPage) {
          item.hidden = false;
          item.textContent = index + 1;
        } else {
          item.hidden = true;
        }
      });
    } else if(this._totalReview > 25) {
      this.$last.hidden = false;
      this.$first.hidden = false;
      // 25개 이상이면 항상 1, 2, 3, 4, 5가 보여야 한다. 
      [...this.$number].forEach((item, index) => {
        item.hidden = false;
        item.textContent = index + 1;
      });  
    }
  }

  pagenation(e) {
    const target = e.target;
    if(target.className === 'page-number') {
      this.direction(target);
      this.number(target);
    } else if(target === this.$after) {
      this.after(target);
    } else if(target === this.$before) {
      this.before(target);
    } else if(target === this.$last) {
      this.last();
    } else if(target === this.$first) {
      this.first();
    }
  }

  direction(target) {
    this._ex = +this.$current.textContent;
    this._cur = +target.textContent;
    this._direction = this._ex < this._cur ? 'right' : 'left';
  }

  number(target) {
    if(this._direction === 'right') {
      this.right(target);
    } else if(this._direction === 'left') {
      this.left(target);
    }
    this.getReviews();
  }

  right(target) {
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    if(this._cur >= 4 && this._cur < this._lastPage - 2) {
      // 4이상 클릭하고, (마지막 페이지 - 2)보다 같거나 작은 경우
      this.middle(this._cur);
      this.$current = [...this.$number][2];
    } else if(this._cur >= this._lastPage - 2 && this._cur <= this._lastPage) {
      // (마지막 페이지 - 2)보다 크고 마지막 페이지보다 작은 경우
      const center = this._lastPage - 2;
      this.middle(center);
      [...this.$number].forEach((item) => {
        if(+item.textContent === this._cur) {
          this.$current = item;
        }
      });
    } else {
      // 1, 2, 3, 4, 5에서 1, 2, 3 클릭하는 경우
      this.$current = target;
    }
    this.$current.classList.add('clicked');   
  }

  left(target) {
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    if(this._cur >= 4 && this._cur < this._lastPage - 2) {
      this.middle(this._cur);
      this.$current = [...this.$number][2];
    } else if(this._cur <= 3 && this._cur >= 1) {
      const center = 3;
      this.middle(center);
      [...this.$number].forEach((item) => {
        if(+item.textContent === this._cur) {
          this.$current = item;
        }
      });
    } else {
      this.$current = target;
    }
    this.$current.classList.add('clicked');   
  }

  middle(num) {
    if(this._lastPage <= 4) {
      [...this.$number].forEach((item, index) => {
        if(index + 1 <= this._lastPage) {
          item.hidden = false;
          item.textContent = index + 1;  
        } else {
          item.hidden = true;
        }
      });  
    } else {
      const arr = [num - 2, num - 1, num, num + 1, num + 2];
      [...this.$number].forEach((item, index) => {
        item.hidden = false;
        item.textContent = arr[index];
      });
    }
  }

  async getReviews() {
    const res = await axios.get(`/review/page/${this._bookId}/${this._cur}`);
    const reviews = res.data.reviews;
    [...this.$reivewContainer.children].forEach(item => {
      item.remove();
    });
    reviews.forEach(item => {
      this.$reivewContainer.append(this.reviewDOM(this.$clone.cloneNode(true), item));
    });
  }

  right(target) {
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    if(this._cur >= 4 && this._cur < this._lastPage - 2) {
      // 4이상 클릭하고, (마지막 페이지 - 2)보다 같거나 작은 경우
      this.middle(this._cur);
      this.$current = [...this.$number][2];
    } else if(this._cur >= this._lastPage - 2 && this._cur <= this._lastPage) {
      // (마지막 페이지 - 2)보다 크고 마지막 페이지보다 작은 경우
      const center = this._lastPage - 2;
      this.middle(center);
      [...this.$number].forEach((item) => {
        if(+item.textContent === this._cur) {
          this.$current = item;
        }
      });
    } else {
      // 1, 2, 3, 4, 5에서 1, 2, 3 클릭하는 경우
      this.$current = target;
    }
    this.$current.classList.add('clicked');   
  }

  after(target) {
    if(this.$current.textContent == this._lastPage) {
      alert('마지막 페이지입니다');
      return;
    }
    target = this.$current.nextElementSibling;
    this._cur = +target.textContent;
    this.right(target);
    this.getReviews();
  }

  before(target) {
    if(this.$current.textContent == 1) {
      alert('첫 페이지입니다');
      return;
    }
    target = this.$current.previousElementSibling;
    this._cur = +target.textContent;
    this.left(target);
    this.getReviews();
  }

  last() {
    if(this.$current.textContent == this._lastPage) {
      alert('마지막 페이지입니다');
      return;
    }
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    this.middle(this._lastPage - 2);
    this.$current = [...this.$number][4];
    this.$current.classList.add('clicked');   
    this._cur = +this.$current.textContent;
    this.getReviews();
  }

  first() {
    if(this.$current.textContent == 1) {
      alert('첫 페이지입니다');
      return;
    }
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    this.middle(3);
    this.$current = [...this.$number][0];
    this.$current.classList.add('clicked');   
    this._cur = +this.$current.textContent;
    this.getReviews();
  }  
  // 더보기 버튼
  more(e) {
    // 현재 리뷰 박스
    const $box = e.target.closest('.rebox');
    // 더보기가 클릭이 됐다는 건 텍스트가 한도를 넘었다는 뜻, 
    // 그럼 slice버전과 original버전 두개임
    // 텍스트 요소 배열과 화살표 요소
    const $texts = [...$box.querySelectorAll('.rebox__text')];
    const $arrow = $box.querySelector('.more-btn__arrow');
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
  // 공감
  async heart(e) {
    // 로그인 안했으면 접근 금지
    if(!this._userId) {
      alert('로그인 후 이용해주세요');
      return;
    }
    const $box = e.currentTarget.closest('.rebox');
    const id = $box.dataset.reviewId;
    // 위로 올라가는 하트
    const $img = $box.querySelector('.heart-img');
    const $like = $box.querySelector('.heart-total');
    const res = await axios.post(`/review/like`, {
      MemberId: this._userId,
      ReviewId: id,
    });
    // 서버에서 보내온 클릭해도 되는지 안되는지 여부
    const clickAllowed = res.data.clickAllowed;
    if(clickAllowed) {
      // 클릭이 처음이라면
      $like.textContent = res.data.like;
      // 하트 위로 올라가는 효과
      $img.classList.add('back');
    } else {
      // 이미 클릭한 상태라면, 클릭한 거 취소
      const res = await axios.post(`/review/like/cancel`, {
        MemberId: this._userId,
        ReviewId: id,  
      });
      $like.textContent = res.data.like;
      $img.classList.remove('back');
    }
  }
  // 수정
  // 수정 버튼 클릭하면 다시 입력 폼이 나오고, 
  // 그 입력 폼 버튼 클릭하면 수정 내용이 서버에 전송된다.
  async edit(e) {
    // 수정 버튼
    const box = e.target.closest('.rebox');
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
    this.$form.onsubmit = this.submit; 
    this.$inputTitle.value = review.title;
    this.$textarea.value = review.text;
    this._formStar = review.stars;
    this._textCheck = true;
    this._titleCheck = true;
    // 텍스트 현재 글자 수 노출
    this.$textareaLength.textContent = review.text.length;
    // 현재 평점 노출
    [...this.$formStars.children].forEach((item, index) => {
      if(index + 1 <= this._formStar) {
        item.style.opacity = '1';
      } else if(index + 1 > this._formStar) {
        item.style.opacity = '';
      }
    });
  }
  editDOM(c, obj) {
    // 제목, 텍스트, overText, stars, updatedAt수정
    c.querySelector('.rebox__title').textContent = obj.title;
    [...c.querySelectorAll('.rebox__star')].forEach((item, index) => {
      item.className = 'rebox__star';
      item.classList.add(`${obj.stars[index]}`);
    });
    c.querySelector('.rebox__updatedDate').textContent = obj.updatedAt;
    c.querySelectorAll('.rebox__text')[0].hidden = false;
    c.querySelectorAll('.rebox__text')[1].hidden = true;
    if(!obj.text.slice) {
      // original 보여준다.
      c.querySelectorAll('.rebox__text')[0].textContent = obj.text.original;
    } else {
      // 200자를 넘어서 slice를 보여준다.
      c.querySelectorAll('.rebox__text')[0].textContent = `${obj.text.slice}...`;
      c.querySelectorAll('.rebox__text')[1].textContent = obj.text.original;
    }
    if(!obj.overText) {
      c.querySelector('.more-btn').hidden = true;
    } else {
      c.querySelector('.more-btn').hidden = false;
    }
  }
  /* --------------------------------------------------------------------------------------------------------- */
  // 삭제
  async delete(e) {
    const box = e.target.closest('.rebox');
    const reviewId = box.dataset.reviewId;
    box.remove();
    // 삭제
    const res = await axios.delete(`/review/${reviewId}/${this._bookId}`);
    const starArr = res.data.starArr;
    const starSum = res.data.starSum;
    console.log(starSum, starArr);
    this.star(starArr, starSum);
    this.$totalReview.textContent = --this._totalReview;
    if(this._totalReview > 5) {
      // 페이지 버튼이 최소 1, 2 두가지 일때
      this.$after.hidden = false;
      this.$before.hidden = false;
    } else {
      // 페이지 버튼이 1밖에 없을때
      this.$after.hidden = true;
      this.$before.hidden = true;
    }
    // 삭제후 totalReview가 5개 이상이면 하나를 추가해야 하지만
    // 5개 미만이면 추가하지 않는다. 
    // 그리고 마지막 페이지에서 삭제했다면 뭘 추가할 필요가 없다. 
    if(this._totalReview >= 5 && this._cur !== this._lastPage) {
      const res = await axios.get(`/review/delete/${this._bookId}/${this._cur}`);
      const review = res.data.review;   
      // 가장 마지막에 추가
      this.$reivewContainer.append(this.reviewDOM(this.$clone.cloneNode(true), review));
    }
    // 마지막 페이지에서 삭제하면 요소 추가 없이 그냥 사라지고
    // 마지막 페이지의 단 하나를 삭제했을때
    // 페이지를 그 전으로 전환한다.
    if(this._cur == this._lastPage && [...this.$reivewContainer.children].length == 0) {
      if(this._totalReview === 0) {
        this._lastPage = 0;
        this.zeroReview();
        return;
      }  
      const num = this._lastPage - 1;
      this._cur = this._lastPage - 1;
      if(num <= 4) {
        [...this.$number].forEach((item, index) => {
          if(index + 1 <= num) {
            item.hidden = false;
            item.textContent = index + 1;  
          } else {
            item.hidden = true;
          }
        });  
        this.$current = [...this.$number][num - 1];
      } else {
        const arr = [num - 4, num - 3, num - 2, num - 1, num];
        [...this.$number].forEach((item, index) => {
          item.hidden = false;
          item.textContent = arr[index];
        });  
        this.$current = [...this.$number][4];
      }
      this.$ex.classList.remove('clicked');
      this.$current.classList.add('clicked');   
      this.getReviews();
    }
    this._lastPage = (this._totalReview % 5) === 0 ? this._totalReview / 5 : Math.floor(this._totalReview / 5) + 1;
  }
  alert() {
    if(this.searchParams.has('login')) {
      switch(this.searchParams.get('login')) {
        case 'need':
          alert('로그인을 다시 진행해주세요');
          break;
      }
    }
  }

  star(arr, sum) {
    this.$starSum.textContent = sum;
    [...this.$starArr].forEach((item, index) => {
      item.className = `book-star ${arr[index]}`;
    });
  }
}


const book = new Book();
book.showPage();
window.addEventListener('load', book.alert);

