
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
    // 전체 리뷰 보여주는 요소
    this.$totalReview = document.querySelector('.review-total');
    // 리뷰들을 담는 요소
    this.$container = document.querySelector('.review-container');
    // 현재 리뷰 갯수
    this._totalReview = +this.$totalReview.textContent;
    // 마지막 페이지
    this._lastPage = (this._totalReview % 5) === 0 ? (this._totalReview / 5) : (Math.floor(this._totalReview / 5) + 1);
    this.stopSubmit = this.stopSubmit.bind(this);
    this.submit = this.submit.bind(this);
    // 등록, 삭제, 업데이트 시 평점 업데이트
    this.$starArr = document.querySelectorAll('.book-star');
    // 책 전체 평점
    this.$starSum = document.querySelector('.book-numbers__current');    
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
    // 페이지가 감소하는지 증가하는지에 따라 왼쪽 오른쪽으로 구분
    this._direction = null;
    // 현재 페이지
    this._cur = 1;
    // 이전 페이지
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
  }
  // 리뷰 등록 버튼 누르기
  showForm(e) {
    if(!this._userId) {
      alert('로그인 후 이용하세요.');
      return;
    }
    // 폼 등장
    this.flexForm();
    // 등록 버튼 비활성화, 버튼 눌러도 아무일도 안 일어남
    this.stopSubmitBtn(); 
    // 조건들 null로 초기화
    this.resetCondition();
  }
  flexForm() {
    this.$form.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  noneForm() {
    this.$form.style.display = '';
    document.body.style.overflow = '';
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
  // 세 가지 조건이 다 충족됐을때
  playSubmitBtn() {
    this.$submitBtn.style.opacity = '';
    this.$submitBtn.style.cursor = ''; 
    // 리뷰를 데이터베이스에 등록
    this.$form.onsubmit = this.submit;
  }  
  // 별점 선택
  clickStars(e) {
    const target = e.target.closest('.form__star');
    // 별이 아니면 나가
    if(!target) return;
    // 0, 1, 2, 3, 4 중 하나
    const rate = +target.dataset.star;
    // 만약 세번째 별을 클릭하면, 첫번째, 두번째, 세번째 별에 색깔 칠해지는 효과
    [...this.$formStars.children].forEach((item, index) => {
      if(index <= rate) {
        item.style.opacity = '1';
      } else if(index > rate) {
        // 기본이 불투명 0.5
        item.style.opacity = '';
      }
    });
    // 등록 버튼 활성화 조건 중 하나
    // this._formStar에 선택한 별의 갯수 할당
    this._formStar = rate + 1;
    // 등록 조건을 모두 갖췄는지 별선택, 제목입력, 텍스트 입력할때마다 확인
    this.check();
  }  
  // 텍스트 입력할때, 내용 입력할때, 별점 클릭할때마다 확인
  check() {
    if(this._textCheck && this._formStar && this._titleCheck) {
      this.playSubmitBtn();
    } else {
      this.stopSubmitBtn();
    }
  }
  // 리뷰 폼 사라지기
  disappearForm() {
    // 텍스트, 타이틀, 글자 수, 평점 다 초기화
    this.resetForm();
    // 사라지기
    this.noneForm();
  }
  resetForm() {
    // 별점 다 지우고
    [...this.$formStars.children].forEach((item) => {
      // opacity: 0.5로 
      item.style.opacity = '';
    });    
    this.$inputTitle.value = '';
    this.$textareaLength.textContent = 0;
    this.$textarea.value = '';
  }
  // 몇 글자 입력했는지 보여주고, 등록 조건 변경 결정, 
  countText(e) {
    if(e.target.value.length > this.TEXTAREA_LIMIT) {
      alert(`${this.TEXTAREA_LIMIT}자 이내로 입력해주세요.`);
      // 글자 더 이상 입력 못하게
      e.target.value = e.target.value.slice(0, this.TEXTAREA_LIMIT); // 마지막 미포함
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
  // 리뷰 DB에 등록
  // 조건이 다 갖춰졌을때 이 함수가 연결된다.
  async submit(e) {
    try {
      e.preventDefault();
      // 만약 업데이트라면 리뷰 ID가 있을 것이고 
      // 새로 추가하는 거라면 리뷰 ID가 서버에서 생성될 터
      const id = this.$form.dataset.id;
      const title = e.target.title.value;
      const text = e.target.text.value;
      const overText = (e.target.text.value.length > this.OVERTEXT_LIMIT) ? true : false;
      // 폼 사라지기
      this.disappearForm();
      if(!id) {
        // 수정이 아닌 새로 등록
        const res = await axios.post('/review', {
          title,
          text,
          overText,
          stars: this._formStar,
          BookId: this._bookId,
          MemberId: this._userId,
        }); 
        // 내가 작성한 리뷰
        const review = res.data.review; 
        // 방금 내가 작성한 리뷰로 업데이트된 전체 평점 배열
        const starArr = res.data.starArr;
        // 방금 내가 작성한 리뷰로 업데이트된 전체 평점
        const starSum = res.data.starSum;
        // 맨 위에 책 전체 평점 업데이트
        this.star(starArr, starSum);    
        // 리뷰 + 1
        this.$totalReview.textContent = ++this._totalReview;
        // 마지막 페이지 다시 계산
        this._lastPage = (this._totalReview % 5) === 0 ? this._totalReview / 5 : Math.floor(this._totalReview / 5) + 1;
        // 만약 추가된 리뷰까지 합해서 5개 이하라면 하나씩 맨 앞에 추가하고
        // 5개 초과라면 가장 위에 리뷰 추가고 동시에 가장 아래의 리뷰도 삭제
        if(this._totalReview <= 5) {
          // prepend: node 맨 앞에
          this.$container.prepend(this.reviewDOM(this.$clone.cloneNode(true), review));
        } else {
          this.$container.prepend(this.reviewDOM(this.$clone.cloneNode(true), review));
          const length = [...this.$container.children].length;
          // 가장 마지막 삭제
          [...this.$container.children][length - 1].remove();
        }
        // 페이지 버튼, 페이지 넘버 뭐 보여줄지
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
        // this.$edit은 해당 .rebox
        this.editDOM(this.$edit, review);
      }
    } catch (err) {
      console.error(err);
    }
  }
  star(arr, sum) {
    this.$starSum.textContent = sum;
    [...this.$starArr].forEach((item, index) => {
      item.className = `book-star ${arr[index]}`;
    });
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
    c.querySelector('.rebox__nickname').href = `/members`;
    c.querySelector('.rebox__date').textContent = obj.createdAt;
    c.querySelector('.rebox__updatedDate').textContent = obj.updatedAt;
    // 유저의 아이디와 작성자의 아이디가 다르다면 수정/삭제 비활성화
    if(this._userId != obj.MemberId) {
      c.querySelector('.rebox__user').hidden = true;
    } 
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
  // 0개 이상이면
  // 페이지버튼 노출, 페이지넘버 노출, 리뷰 박스 담는 컨테이너 노출
  isZero() {
    if(this._totalReview > 0) {
      this.firstReview();
    } else {
      this.zeroReview();
    }
  }
  firstReview() {
    this.$empty.hidden = true;
    this.$pagenation.hidden = false;
    this.$numbers.hidden = false;
    this.$container.hidden = false;
  }
  zeroReview() {
    this.$empty.hidden = false;
    this.$pagenation.hidden = true;
    this.$numbers.hidden = true;
    this.$container.hidden = true;
  }
  // 리뷰가 5개 이하면
  // 숫자 1만 보여준다.
  underFive() {
    this.$after.hidden = true;
    this.$before.hidden = true;
    this.$last.hidden = true;
    this.$first.hidden = true;
  }
  // 리뷰가 25개 이하면
  // <, >와 숫자만 보여준다.
  under25() {
    this.$after.hidden = false;
    this.$before.hidden = false;
    this.$last.hidden = true;
    this.$first.hidden = true;
  }
  // 25개 이하이면, 
  // 1, 2, 3 혹은 1, 2, 3, 4혹은 1, 2, 3, 4, 5가 될지를 결정
  under25Page() {
    [...this.$number].forEach((item, index) => {
      if(index + 1 <= this._lastPage) {
        item.hidden = false;
        item.textContent = index + 1;
      } else {
        item.hidden = true;
      }
    });
  }
  // 숫자, <, <<, >, >> 다 노출
  over25() {
    this.$after.hidden = false;
    this.$before.hidden = false;
    this.$last.hidden = false;
    this.$first.hidden = false;
  }
  // 그냥 무조건 1, 2, 3, 4, 5보여주기
  over25Page() {
    [...this.$number].forEach((item, index) => {
      item.hidden = false;
      item.textContent = index + 1;
    });  
  }
  showPage() {
    this.isZero(); // 0개냐 아니냐
    if(this._totalReview <= 5) {
      this.underFive();
      this.under25Page();
    } else if(this._totalReview > 5 && this._totalReview <= 25) {
      // 페이지가 1이상이고, 5 미만일때
      this.under25();
      this.under25Page();
    } else if(this._totalReview > 25 ) {
      this.over25();
      this.over25Page();
    }
  }
  pagenation(e) {
    const target = e.target;
    if(target.className === 'page-number') {
      // 넘버 클릭시에는 방향 설정해야돼
      this.direction(target);
      this.number(target);
    } else if(target === this.$after) {
      this.after();
    } else if(target === this.$before) {
      this.before();
    } else if(target === this.$last) {
      this.last();
    } else if(target === this.$first) {
      this.first();
    }
  }
  direction(target) {
    // 현재 페이지 넘버
    this._ex = +this.$current.textContent;
    // 내가 클릭한 페이지 넘버
    this._cur = +target.textContent;
    this._direction = this._ex < this._cur ? 'right' : 'left';
  }
  number(target) {
    if(this._direction === 'right') {
      this.right(target);
    } else if(this._direction === 'left') {
      this.left(target);
    }
    // 페이지 번호에 맞는 리뷰 가져와
    this.getReviews();
  }
  // 페이지 넘버를 재배열하고
  // 현재 강조 요소 결정
  right(target) {
    // 현재 페이지 넘버 강조 제거하고
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    if(this._cur >= 4 && this._cur <= this._lastPage - 2) {
      // 4이상 클릭하고, (마지막 페이지 - 2)보다 같거나 작은 경우
      // 센터에 위치
      // 예를 들어 마지막 페이지가 6이고 나는 4를 클릭했어.
      // 그럼 2, 3, 4, 5, 6이런식으로..
      this.middle(this._cur);
      // 가운데 강조
      this.$current = [...this.$number][2];
    } else if(this._cur >= 4 && this._cur === this._lastPage) {
      // 마지막 페이지를 클릭했을떄
      this.middle(this._lastPage - 2);
      this.$current = [...this.$number][4];
    } else if(this._cur >= 4 && this._cur === this._lastPage - 1) {
      // 예를 들어 1, 2, 3, 4, 5 상태에서 마지막 페이지가 6이고 나는 5를 클릭했어.
      // 그럼 2, 3, 4, 5, 6식으로 있어야돼
      this.middle(this._lastPage - 2);
      [...this.$number].forEach((item) => {
        if(+item.textContent === this._cur) {
          this.$current = item;
        }
      });  
    } else {
      // 그게 아니면 그냥 강조만
      this.$current = target;
    }
    this.$current.classList.add('clicked');   
  }
  middle(num) {
    const arr = [num - 2, num - 1, num, num + 1, num + 2];
    [...this.$number].forEach((item, index) => {
      item.hidden = false;
      item.textContent = arr[index];
    });
  }
  left(target) {
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    if(this._cur >= 3 && this._cur <= this._lastPage - 2) {
      this.middle(this._cur);
      this.$current = [...this.$number][2];
    } else if(this._cur >= 4 && this._cur === this._lastPage) {
      // 마지막 페이지를 클릭했을떄
      this.middle(this._lastPage - 2);
      this.$current = [...this.$number][4];
    } else if(this._cur >= 4 && this._cur === this._lastPage - 1) {
      // 예를 들어 1, 2, 3, 4, 5 상태에서 마지막 페이지가 6이고 나는 5를 클릭했어.
      // 그럼 2, 3, 4, 5, 6식으로 있어야돼
      this.middle(this._lastPage - 2);
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
  async getReviews() {
    const res = await axios.get(`/review/page/${this._bookId}/${this._cur}`);
    const reviews = res.data.reviews;
    [...this.$container.children].forEach(item => {
      item.remove();
    });
    reviews.forEach(item => {
      this.$container.append(this.reviewDOM(this.$clone.cloneNode(true), item));
    });
  }
  after() {
    if(+this.$current.textContent === this._lastPage) {
      alert('마지막 페이지입니다');
      return;
    }
    const target = this.$current.nextElementSibling;
    this._cur++;
    this.right(target);
    this.getReviews();
  }
  before() {
    if(+this.$current.textContent === 1) {
      alert('첫 페이지입니다');
      return;
    }
    const target = this.$current.previousElementSibling;
    this._cur--;
    this.left(target);
    this.getReviews();
  }
  last() {
    if(+this.$current.textContent === this._lastPage) {
      alert('마지막 페이지입니다');
      return;
    }
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    this.middle(this._lastPage - 2);
    this.$current = [...this.$number][4];
    this.$current.classList.add('clicked');   
    this._cur = this._lastPage;
    this.getReviews();
  }
  first() {
    if(+this.$current.textContent === 1) {
      alert('첫 페이지입니다');
      return;
    }
    this.$ex = this.$current;
    this.$ex.classList.remove('clicked');
    this.middle(3);
    this.$current = [...this.$number][0];
    this.$current.classList.add('clicked');   
    this._cur = 1;
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
    this.flexForm();
    this.$inputTitle.value = review.title;
    this.$textarea.value = review.text;
    this._formStar = review.stars;
    this._textCheck = true;
    this._titleCheck = true;
    this.check();
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
      item.className = `rebox__star ${obj.stars[index]}`;
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
  // 삭제
  async delete(e) {
    const box = e.target.closest('.rebox');
    const reviewId = box.dataset.reviewId;
    box.remove();
    // 삭제
    const res = await axios.delete(`/review/${reviewId}/${this._bookId}`);
    const starArr = res.data.starArr;
    const starSum = res.data.starSum;
    this.star(starArr, starSum);
    this.$totalReview.textContent = --this._totalReview;
    this._lastPage = (this._totalReview % 5) === 0 ? this._totalReview / 5 : Math.floor(this._totalReview / 5) + 1;
    // 삭제 후 리뷰가 5개 미만이면 추가하지 않고 삭제만 한다.
    // 마지막 페이지에서 삭제 + 남은 게시글 하나 이상 => 삭제만
    // 삭제 후 리뷰가 5개 이상이고, 현재 페이지와 마지막 페이지가 같지 않을때 => 하나만 아래에 추가
    if(this._totalReview >= 5 && [...this.$container.children].length !== 0 && this._lastPage !== this._cur) {
      const res = await axios.get(`/review/delete/${this._bookId}/${this._cur}`);
      const review = res.data.review;   
      // 가장 마지막에 추가
      this.$container.append(this.reviewDOM(this.$clone.cloneNode(true), review));
    } 
    if(this._lastPage === 0 && [...this.$container.children].length == 0) {
      this._cur = 1;
      this.$current = [...this.$number][0];
    }
    // 마지막 페이지의 마지막 게시글 삭제 
    // => 페이지를 그 전 페이지로 전환하고, 그 전 페이지 가져오기
    if(this._lastPage !== 0 && [...this.$container.children].length == 0) {
      // 페이지가 1이 아닌 곳에서 마지막 게시글을 삭제한 경우
      this._cur = this._lastPage;
      if(this._lastPage <= 5) {
        this.under25Page();
        this.$current = [...this.$number][this._lastPage - 1];
      } else {
        const arr = [this._cur - 4, this._cur - 3, this._cur - 2, this._cur - 1, this._cur];
        [...this.$number].forEach((item, index) => {
          item.hidden = false;
          item.textContent = arr[index];
        });  
        // 마지막
        this.$current = [...this.$number][4];
      }
      this.$ex.classList.remove('clicked');
      this.$current.classList.add('clicked');   
      this.getReviews();
    }
    this.showPage();
  }
}


const book = new Book();
book.showPage();


