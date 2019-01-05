$(document).ready(function(){

  $('#start').click(function(){
    $.get('stt', function(data){
      console.log(data);
    });
  });

});
