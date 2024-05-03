class Wishlist {
  constructor() {
    this.memberId = new URL(location.href).pathname.split('/')[2];
    this.$wishlist = document.getElementById('wishlist');
    this.$wishlistArea = document.querySelector('.wishlist-contents');
    this.$wishlistArea.oncontextmenu = this.funContextmenu.bind(this);
    this.$wishlist.onclick = this.funClick.bind(this);
    this.$folderMenu = document.getElementById('folder-menu');
    this.$areaMenu = document.getElementById('area-menu');
    this.$sortMenu = document.getElementById('sort-menu');
    this.$sortElem = document.querySelector('[data-menu="sort"]')
    this.$sortElem.onpointerenter = this.fucSort.bind(this);
    this.$folders = document.querySelectorAll('.wishlist-folder');
    this.funDblclick = this.funDblclick.bind(this);
    [...this.$folders].forEach(item => {
      item.addEventListener('dblclick', this.funDblclick);
    })
  }

  funContextmenu(e) {
    // 폴더를 클릭한 경우와 폴더 외 영역을 클릭한 경우로 나눈다. 
    const target = e.target;
    const folder = target.closest('.wishlist-folder');
    if(folder) {
      // 폴더를 클릭한 경우
      // 폴더 삭제, 폴더 이름 변경, 폴더 열기
      this.$folderMenu.hidden = false;
      this.$areaMenu.hidden = true;
      this.$folderMenu.style.left = e.clientX + 'px';
      this.$folderMenu.style.top = e.clientY + 'px';
    } else {
      // 그 외의 영역
      // 폴더 추가, 폴더 정렬 - 이름순, 생성일순
      this.$areaMenu.hidden = false;
      this.$folderMenu.hidden = true;
      this.$areaMenu.style.left = e.clientX + 'px';
      this.$areaMenu.style.top = e.clientY + 'px';
    } 
    // 기존 브라우저의 컨텍스트 메뉴 안 보이게
    return false;
  }
  // 각각 메뉴 클릭 시
  funClick(e) {
    const target = e.target;
    const type = target.dataset.menu;
    if(type === 'open') {
      this.funDblclick();
    } else if(type === 'name') {
      console.log('이름 변경');
    } else if(type === 'delete') {
      console.log('삭제');
    } else if(type === 'add') {
      console.log('새로운 폴더');
    } else if(type === 'sort-name') {
      console.log('이름');
    } else if(type === 'sort-updated') {
      console.log('수정일');
    } else if(type === 'sort-created') {
      console.log('생성일');
    } else {
      this.$folderMenu.hidden = true;
      this.$areaMenu.hidden = true;
    }
  }
  // 정렬 메뉴 보이고 안 보이고
  fucSort(e) {
    this.$sortMenu.hidden = false;
    e.currentTarget.onpointerleave = () => {
      this.$sortMenu.hidden = true;
    }
  }

  funDblclick(e) {
    // 더블클릭 시 href효과
  }
}

new Wishlist();