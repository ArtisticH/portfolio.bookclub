class Book {
  constructor() {
    this.$reviewForm = document.getElementById('review-form');
    this.$reviewWriteBtn = document.querySelector('.review__write');
    this.$reviewFormCancelBtn = document.querySelector('.review-form__cancel');

    this.$reviewFormCancelBtn.onclick = this.reviewForm.bind(this);
    this.$reviewWriteBtn.onclick = this.reviewForm.bind(this);
  }

  reviewForm(e) {
    if(e.currentTarget === this.$reviewFormCancelBtn) {
      this.$reviewForm.style.display = '';
      document.body.style.overflow = '';
    } else if(e.currentTarget === this.$reviewWriteBtn) {
      this.$reviewForm.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }
}

const book = new Book();
