class Search {
  constructor() {
    this.$searchForm = document.querySelector('.search-box');
    this.$searchForm.onsubmit = this.search.bind(this);
    this.$select = document.getElementById('targets');
  }
  async search(e) {
    e.preventDefault();
    const res = await axios.post('/open/search', {
      target: this.$select.value,
      kwd: e.target.kwd.value,
    });
    const lists = res.data.lists;
  }
}

new Search();