module.exports = {
  dateChange (dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 해주고, 2자리로 만들기 위해 slice 사용
    const day = ("0" + date.getDate()).slice(-2); // 일자를 2자리로 만들기 위해 slice 사용
    const formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  },
  memberType (type) {
    switch(type) {
      case 'member':
        type = 'MEMBER';
        break;
      case 'guest':
        type = 'GUEST';
        break;  
    }
    return type;
  },
  calculateRate (star) {
    let array = [];
  
    if(star % 1 === 0) {
      array = Array.from({ length: 5 }, (_, index) => {
        if(index + 1 <= star) {
          return 'full';
        } else {
          return 'empty';
        }  
      });
  
    } else {
      let decimal = star % 1;
      const essence = Math.floor(star);
  
      if (decimal < 0.5) {
        decimal = 0;
      } else if (0.5 <= decimal) {
        decimal = 0.5;
      }
  
      array = Array.from({ length: 5 }, (_, index) => {
        if(index + 1 <= essence) {
          return 'full';
        } else if(index + 1 === essence + 1 && decimal === 0.5) {
          return 'half';
        } else {
          return 'empty';
        }  
      });
    }
    return array;
  },
}