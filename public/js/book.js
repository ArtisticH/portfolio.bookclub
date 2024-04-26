class Book {
  constructor() {
    this.$reviewForm = document.getElementById('review-form');
    this.$reviewWriteBtn = document.querySelector('.review__write');
    this.$reviewFormCancelBtn = document.querySelector('.review-form__cancel');

    this.$reviewFormCancelBtn.onclick = this.reviewForm.bind(this);
    this.$reviewWriteBtn.onclick = this.reviewForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.$reviewForm.addEventListener('submit', this.submitForm);
  }

  reviewForm(e) {
    if(e.currentTarget === this.$reviewFormCancelBtn) {
      this.$reviewForm.style.display = '';
      document.body.style.overflow = '';
    } else if(e.currentTarget === this.$reviewWriteBtn) {
      this.$reviewForm.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  async submitForm(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const text = e.target.text.value
    const bookId = new URL(location.href).pathname.split('/')[2];
    await axios.post('/review', {
      title,
      text,
      bookId,
    });
  }
}

const book = new Book();
