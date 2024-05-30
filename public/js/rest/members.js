
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
    const id = target.dataset.id;
    const res = await axios.get(`/members/${id}`);
    const ids = res.data.ids;
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
}

new Member();
