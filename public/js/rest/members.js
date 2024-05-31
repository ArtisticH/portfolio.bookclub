
class Member {
  constructor() {
    // 멤버 클릭
    this.$members = document.getElementById('members');
    this._totalBooks = this.$members.dataset.bookTotal;
    this.$names = document.querySelector('.members-names');
    this.$name = document.querySelectorAll('.members-name');
    this.$names.onclick = this.names.bind(this);
    // 책 보여주기
    this.$books = document.querySelector('.member-books');
    // 참여 횟수
    this.$attend = document.querySelector('.attend');
    this.$recommend = document.querySelector('.recommend');
    this._memberId = null;
    this.$wishlist = document.querySelector('.wishlist');
    this.$wishlist.onclick = this.wishlist.bind(this);
    // 위시리스트
    this.$wishlist = document.querySelector('.wishlist');
    // 멤버 타이틀 클릭시
    this.$title = document.querySelector('.members-title');
    this.$title.onclick = this.reset.bind(this);
  }
  async names(e) {
    const target = e.target.closest('.members-name');
    this._memberId = target.dataset.id;
    if(!target) return;
    [...this.$name].forEach(item => {
      if(item == target) {
        target.classList.add('clicked');
      } else {
        item.classList.remove('clicked');
      }
    });
    const res = await axios.get(`/members/${this._memberId}`);
    // 이 멤버가 추천한 책들 아이디
    const ids = res.data.ids;
    // 이 멤버가 참여한 미팅 횟수
    const attend = res.data.attend;
    [...this.$books.children].forEach(item => {
      const id = +item.dataset.id;
      if(ids.includes(id)) {
        item.classList.add('clicked');
      } else {
        item.classList.remove('clicked');
      }
    });
    this.$attend.hidden = false;
    this.$recommend.hidden = false;
    this.attend(attend, this._totalBooks);
    this.recommend(ids.length, this._totalBooks);
    this.$wishlist.style.backgroundColor = '#039753';
    this.$wishlist.style.cursor = 'pointer';
  }

  attend(attend, total) {
    this.$attend.querySelector('.attend-num-count').textContent = attend;
    this.$attend.querySelector('.attend-num-total').textContent = total;
  }
  recommend(rec, total) {
    this.$recommend.querySelector('.recommend-num-count').textContent = rec;
    this.$recommend.querySelector('.recommend-num-total').textContent = total;
  }

  async wishlist() {
    if(!this._memberId) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    const url = `wishlist/${this._memberId}`;
    window.location.href = url;
  }
  reset() {
    // 책 강조 없애고
    [...this.$books.children].forEach(item => {
      if(item.classList.contains('clicked')) {
        item.classList.remove('clicked');
      }
    });
    // 위시리스트 없애고
    this.$wishlist.style.backgroundColor = '';
    this.$wishlist.style.cursor = '';
    // 횟수 없애고
    this.$attend.hidden = true;
    this.$recommend.hidden = true;
    // 이름 강조 없애
    [...this.$name].forEach(item => {
      if(item.classList.contains('clicked')) {
        item.classList.remove('clicked');
      }
    });
  }
}

new Member();
