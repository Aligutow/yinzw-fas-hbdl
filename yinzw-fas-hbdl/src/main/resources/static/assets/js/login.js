/**
 * Particleground demo
 * @author Jonathan Nicol - @mrjnicol
 */

$(document).ready(function() {
  $('#particles').particleground({
    dotColor: '#c9d9ed',
    lineColor: '#c9d9ed'
  });
  $('.intro').css({
    'margin-top': -($('.intro').height() / 2)
  });
  $(document).keydown(function(event){ 
    if(event.keyCode==13){ 
      $("#btnLogin").click(); 
    }
  });
});