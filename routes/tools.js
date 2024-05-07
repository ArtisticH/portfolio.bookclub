module.exports = {
  date (dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  },
  rate (star) {
    let array = [];
    if(star % 1 === 0) {
      // 정수라면, 소수점이 없다면, 만약 3이라면
      // 5개의 별을 3개는 채우고, 두개는 비워라
      array = Array.from({ length: 5 }, (_, index) => {
        if(index + 1 <= star) {
          return 'full';
        } else {
          return 'empty';
        }  
      });
    } else {
      // 정수가 아니라면, 소수점이 있다면,
      // 3.8과 2.3를 예로 들어
      // decimal은 소수점, 0.8이나 0.3,
      let decimal = star % 1;
      // essence은 내린 수, 3.8은 3으로, 2.3은 2로, 
      const essence = Math.floor(star);
      // 만약 소수점이 0.5보다 작다면 0으로
      // 0.5보다 크다면 0.5로,
      // 그래서 2.3은 2로 내리고, 3.8은 3.5로 내릴 수 있게,
      if (decimal < 0.5) {
        decimal = 0;
      } else if (0.5 <= decimal) {
        decimal = 0.5;
      }
      array = Array.from({ length: 5 }, (_, index) => {
        // essence까지는 채우고, 
        if(index + 1 <= essence) {
          return 'full';
          // decimal이 0.5라면 그 다음 별을 반개 채운다
        } else if(index === essence && decimal === 0.5) {
          return 'half';
        } else {
          // 그 외는 빈별
          return 'empty';
        }  
      });
    }
    return array;
  },
}