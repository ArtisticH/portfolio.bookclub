
class Member {
  constructor() {
    this.$members = document.getElementById('members');
    // 지금까지 진행한 책 권수
    this._totalBooks = this.$members.dataset.bookTotal;
    // 각 멤버들 이름 클릭할때
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
    // 이 멤버 아이디
    this._memberId = target.dataset.id;
    if(!target) return;
    // 이 멤버만 강조
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
    // 책의 아이디를 순회하면서 이 멤버가 추천한 책아이디 배열에 포함한다면 강조
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
  // 미팅 참여 횟수 / 총 미팅 횟수
  attend(attend, total) {
    this.$attend.querySelector('.attend-num-count').textContent = attend;
    this.$attend.querySelector('.attend-num-total').textContent = total;
  }
  // 책 추천 횟수 / 총 미팅 횟수
  recommend(rec, total) {
    this.$recommend.querySelector('.recommend-num-count').textContent = rec;
    this.$recommend.querySelector('.recommend-num-total').textContent = total;
  }
  // 멤버 아이디 선택한 상태에서만 위시리스트 버튼 활성화된다.
  async wishlist() {
    if(!this._memberId) {
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
