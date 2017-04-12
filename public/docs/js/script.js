$(document).ready(function(){


	// Set the grid up
	updateGrid(thumbGrid);
	updateAgenda();


  // Drag some shit
  $('#containment').css({width:$(window).width(),height:$(window).height()});
  $('h2, article div, aside div, img, object').draggable({
    containment:'#containment',
    disabled: false,
    stop: function(){
      $(this).css('z-index', indexUp);
      indexUp += 1;
    }
  });
  $('h2, article div, aside div, img, object, figure').click(function(){
    $(this).css('z-index', indexUp);
    indexUp += 1;
  });
  $('p, h3, h3').click(function() {
    $(this).parent().css('z-index', indexUp);
    indexUp += 1;
  });


	// Where we at ?
    checkURL();
    $('a').click(function (e){
        checkURL(this.hash);
    });
    setInterval("checkURL()",250);


	// Love on top
	// ???????????
	

	// Where the magic happens
	$('img').on('load', function(event) {
		event.preventDefault();
		$(this).css('opacity', 1);
	});


	// Make caption lick the mouse ass
	$('img').hover(function() {
		$('figcaption').html($(this).data('title')).removeClass('hidden').addClass('visible');
		$(document).mousemove(function(event) {
			$('figcaption').css({
				left: event.pageX + 5,
				top: event.pageY +5
			});
			if (event.pageX + $('figcaption').width() >= $(window).width()) {
				$('figcaption').css('left', event.pageX-$('figcaption').width()-20);
			};
			if (event.pageY + $('figcaption').height() * 2 >= $(window).height()) {
				$('figcaption').css('top', event.pageY-$('figcaption').height()-20);
			};
		});
	}, function() {
		$('figcaption').removeClass('visible').addClass('hidden');
	});


	// We have to go back
	// ??????????????????

});