class Book {
  constructor() {
    this.$bookElem = document.getElementById('book');
    this.$bookBtn = document.querySelector('.book-btn');
    this.$bookLeft = document.querySelector('.book-left');
    this.$reviewBtn = document.querySelector('.review-btn');

    this.$reviewBtn.onclick = this.gridChange.bind(this);
    this.$bookBtn.onclick = this.gridChange.bind(this);
  }

  gridChange(e) {
    if(e.currentTarget === this.$reviewBtn) {
      for(let elem of this.$bookLeft.children) {
        elem.style.display = 'none';
      }
      this.$bookElem.style.gridTemplateColumns = '1fr 9fr';
      this.$bookLeft.style.padding = '0';
      this.$bookBtn.style.display = 'block'; 
      this.$reviewBtn.style.display = 'none'; 
    } else if(e.currentTarget === this.$bookBtn) {
      this.$bookBtn.style.display = 'none';  
      this.$bookLeft.style.padding = '';
      this.$bookElem.style.gridTemplateColumns = '9fr 1fr';
      for(let elem of this.$bookLeft.children) {
        elem.style.display = '';
      }
      this.$reviewBtn.style.display = ''; 
    }
  }
}

new Book();