TIME = {
    now: function(){
        return new Date();
    },

    format12h: function(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        if (hours > 12) {
          hours -= 12;
        } else if (hours === 0) {
          hours = 12;
        }
        return hours + ':' + minutes;
      },
      formatHMS: function(date){
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        if (hours > 12) {
          hours -= 12;
        } else if (hours === 0) {
          hours = 12;
        }
        return hours + ':' + minutes + ':' + seconds;
      },
      msAgo: function(time){
        return (this.now() - new Date(time))
      },
      
      sAgo: function(time){
        return (this.now() - new Date(time)) / 1000;
      }
}