/* Grid variables */

thumbGrid = {
	parent: '#content ul',
	isRandom: false,
	columns: 4,
	lines: 3,
	margin: 100,
	gutter: 20,
	children: [
		{
			selector: 'figure',
			width: 1,
			height: 1
		}
	],
	cascade: {
		isTrue: true,
		selector: '.thumb',
		amount: 10
	}
};



/* Grid functions */

grid = function(table, setup) {
	var g = {
		columns: table.columns,
		lines: table.lines,
		margin: setup.margin,
		gutter: setup.gutter,
		width: setup.width,
		height: setup.height
	};
	return g;
};


table = function(columns, lines) {
	var table = {
		columns: columns,
		lines: lines
	};
	return table;
};


setup = function(margin, gutter) {
	var setup = {
		margin: margin,
		gutter: gutter,
		width: $(window).width() - 2*margin,
		height: $(window).height() - 2*margin
	};
	return setup;
};

calculate = function(grid) {
	var position = {};
	position.x = [];
	position.y = [];

	for (var x=0; x<grid.columns; x++) {
		var positionX = grid.width / grid.columns * x + grid.margin + grid.gutter / grid.columns * x;
		position.x.push(positionX);
	};
	for (var y=0; y<grid.lines; y++) {
		var positionY = grid.height / grid.lines * y + grid.margin + grid.gutter / grid.columns * y;
		position.y.push(positionY);
	};

	return position;
};

size = function(grid, amplitude) {
	var x = grid.width / grid.columns - grid.gutter * (grid.columns-1) / grid.columns,
		y = grid.height / grid.lines - grid.gutter * (grid.lines-1) / grid.lines;

	var size = {
		x: x * amplitude + grid.gutter * (amplitude - 1),
		y: y * amplitude + grid.gutter * (amplitude - 1)
	};
	return size;
};

append = function(grid, container) {
	var setGrid = calculate(grid);

	$(container).each(function() {
		$(this).css({
			left: setGrid.x[$(this).data('x')],
			top: setGrid.y[$(this).data('y')],
			width: size(grid, $(this).data('width')).x,
			height: size(grid, $(this).data('height')).y
		});
	});
};

isNew = function(array, newPosition) {
	for (var position in array) {
		if (newPosition.x === array[position].x && newPosition.y === array[position].y) {
			return false;
		}
	}
	return true;
};

getNewPosition = function(array, xMax, yMax) {
	var newPosition = {};
	do {
		newPosition.x = parseInt(Math.random() * xMax);
		newPosition.y = parseInt(Math.random() * yMax);
	} while (isNew(array, newPosition) == false);

	return newPosition;
};

cascade = function(container, xI, yI) {
	$(container).each(function(index){
		$(this).css({
			left: xI * index,
			top: yI * index
		});
	});
};

updateGrid = function(gridValues) {
	var g = gridValues;

	var thisTable = table(g.columns, g.lines),
		thisSetup = setup(g.margin, g.gutter);
	var thisGrid = grid(thisTable, thisSetup);

	var thisOccupied = [];
	for (var i=0; i<g.children.length; i++) {
		$(g.parent).children(g.children[i].selector).each(function(){
			var thisNewPosition = getNewPosition(thisOccupied, g.columns - (g.children[i].width - 1), g.lines - (g.children[i].height - 1));
			if (!g.isRandom) {
				for (var x=0; x<g.children[i].width; x++) {
				for (var y=0; y<g.children[i].height; y++) {
					var thisPushedPosition = {
						x: thisNewPosition.x + x,
						y: thisNewPosition.y + y
					}
					thisOccupied.push(thisPushedPosition);
				};
				};
			};
			
			if (thisOccupied.length == g.columns * g.lines) { thisOccupied = []; };

			$(this).data({
				x: thisNewPosition.x,
				y: thisNewPosition.y,
				width: g.children[i].width,
				height: g.children[i].height
			});

			if (g.cascade.isTrue) {	cascade($(this).find(g.cascade.selector), g.cascade.amount, g.cascade.amount); };
		});
		append(thisGrid, $(g.parent).children(g.children[i].selector));
	};

};

updateProjectGrid = function(url) {
	var projectTable = table(36, 36),
		projectSetup = setup(20, 40);
	var projectGrid = grid(projectTable, projectSetup);

	$(url).children('h2').data({
		x: parseInt(Math.random() * 2),
		y: parseInt(Math.random() * 2),
		width: parseInt(Math.random() * 4) + 12,
		height: parseInt(Math.random() * 2) + 6
	});
	$(url).children('article').data({
		x: parseInt(Math.random() * 4),
		y: parseInt(Math.random() * 6) + 2,
		width: parseInt(Math.random() * 4) + 14,
		height: parseInt(Math.random() * 2) + 24
	});
	$(url).children('aside').data({
		x: parseInt(Math.random() * 2) + 20,
		y: parseInt(Math.random() * 4),
		width: parseInt(Math.random() * 4) + 8,
		height: parseInt(Math.random() * 4) + 8
	});
	$(url).children('figure').data({
		x: parseInt(Math.random() * 4) + 20,
		y: parseInt(Math.random() * 4) + 16,
		width: parseInt(Math.random() * 4) + 16,
		height: parseInt(Math.random() * 4) + 16
	});


	append(projectGrid,$(url).children());
	cascade($(url+' article div'), 10, 10);
	cascade($(url+' aside div'), -10, 10);
	cascade(url+' figure > a img', -10, -10);
};


/* Agenda */

updateAgenda = function() {
	$('#content #agenda aside').each(function(){
		var selector = '#' + $(this).data('slug') + ' figure';
		$(this).css({
			left: parseFloat($(selector).css('left')) - (Math.random() * 10),
			top: parseFloat($(selector).css('top')) - (Math.random() * 10),
			width: parseFloat($(selector).css('width')) - 40,
			height: parseFloat($(selector).css('height')) - 30
		});
		$(this).children().each(function(index){
			$(this).css({
				left: -10 * index,
				top: 10 * index
			});
	});
	});
};


/* URL functions */

var lastUrl = 'start';
var previousUrl;
var indexUp = 1;
var root = '#content ul';

checkURL = function(hash) {
    if(!hash) hash=window.location.hash;

    if(hash != lastUrl) {
        previousUrl=lastUrl;
        lastUrl=hash;
        loadPage(hash, grid);
    };
};

classOn = function(element) { element.removeClass('hidden').addClass('visible'); };
classOff = function(element) { element.removeClass('visible').addClass('hidden'); };

dragOn = function(element) { element.css('pointer-events', 'auto'); };
dragOff = function(element) { element.css('pointer-events', 'none'); };
resetDrag = function() { dragOff($('#content ul *')); };


clickOutside = function(url) {
	$(document).click(function() {
	    window.location.hash = '';
	});
	$(url).find('h2, article *, aside *, figure *, figure *').click(function(event) {
	    event.stopPropagation();
	});
};

hidePage = function(element) {
	var c = $(element).find('h2, article div, aside div, figure div, img, object');
	classOff(c);
};

blurPage = function(element) {
	var p = $(element).find('h2, article, aside, figure');
	var c = $(element).find('h2, article div, aside div, img, object');

	if (!element || element==='') {
		$(root).find('figure').removeClass('noblur').addClass('blur');
		classOn($(root).find('.thumb'));
	} else if (element === '#expositions' || element === '#conferences' || element === '#evenements') {
		element=element.replace('#','.');
		$(root).find('figure').removeClass('noblur').addClass('blur');
		classOn($(element).find('.thumb'));
	} else {
		p.removeClass('noblur').addClass('blur');
		classOn(c);
	};
};

showPage = function(element) {
	var p = $(element).find('h2, article, aside, figure');
	var c = $(element).find('h2, article div, aside div, figure div, img, object');

	p.removeClass('blur').addClass('noblur');
	classOn(c);

	resetDrag();
	dragOn($(element+' *'));

	$(element).css('z-index', indexUp);
	c.css('z-index', indexUp+1);
	indexUp+=2;
};

loadPage = function(url) {
	if (!url || url === '') {

		updateGrid(thumbGrid);
		updateAgenda();

		hidePage(root);
		blurPage(previousUrl);

		classOff($('img'));
		classOn($('.thumb'));

		resetDrag();
		dragOn($('.thumb'));

		$('figure').removeClass('blur').addClass('noblur');
		$(root).css('z-index', indexUp);
		$('img').css('z-index', indexUp+1);
		indexUp+=2;
		
		$('figcaption').css('opacity', 1);

	} else if (url === '#agenda') {

		updateAgenda();

		hidePage(root);
		blurPage(previousUrl);

		showPage(url);

		$('figcaption').css('opacity', 0);


	} else if (url === '#expositions' || url === '#conferences' || url === '#evenements') {
		
		updateGrid(thumbGrid);
		updateAgenda();

		hidePage(root);
		blurPage(previousUrl);

		classOff($('img'));
		url=url.replace('#','.');
		classOn($(url+' .thumb, '+url+'.title h2'));

		resetDrag();
		dragOn($(url+' .thumb, '+url+'.title h2'));

		$(url+' figure, '+url+'.title h2').removeClass('blur').addClass('noblur');
		$(url).css('z-index', indexUp);
		$('img').css('z-index', indexUp+1);
		indexUp+=2;
		
		$('figcaption').css('opacity', 1);

	} else {
		
	    clickOutside(url);
	    updateProjectGrid(url);

		hidePage(root);
		blurPage(previousUrl);

		showPage(url);

		if (url === '#venir-au-havre') {
			initialize();
		}

	};
};




//Map
function initialize() {

    //Places
    var ESADHaR = new google.maps.LatLng(49.497400, 0.131852);
    var BU = new google.maps.LatLng(49.496358, 0.129121);
    var MaisonEtudiant = new google.maps.LatLng(49.497048, 0.131472);
    var BM = new google.maps.LatLng(49.493907, 0.111749);
    var Gare = new google.maps.LatLng(49.492951, 0.124864);
    var THV = new google.maps.LatLng(49.494352, 0.109147);
    var PiedNu = new google.maps.LatLng(49.503805, 0.121824);
    var Tetris = new google.maps.LatLng(49.504069, 0.120649);
    var LePhare = new google.maps.LatLng(49.492708, 0.135132);
    var Esplanade = new google.maps.LatLng(49.493682, 0.094648);
    
    //Initialize
    var mapOptions = {
      center: new google.maps.LatLng(49.498368, 0.112093),
      zoom: 13,
      disableDefaultUI: true
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    
    //Markers 
	var image = 'public/marker.png'; 

    var marker1 = new google.maps.Marker({
      position: BU,
      icon: image
    });  
    var marker2 = new google.maps.Marker({
      position: ESADHaR,
      icon: image
    });
    var marker3 = new google.maps.Marker({
      position: MaisonEtudiant,
      icon: image
    });
    var marker4 = new google.maps.Marker({
      position: BM,
      icon: image
    });
    var marker5 = new google.maps.Marker({
      position: Gare,
      icon: image
    });
    var marker6 = new google.maps.Marker({
      position: THV,
      icon: image
    });
    var marker7 = new google.maps.Marker({
      position: PiedNu,
      icon: image
    });
    var marker8 = new google.maps.Marker({
      position: Tetris,
      icon: image
    });
    var marker9 = new google.maps.Marker({
      position: LePhare,
      icon: image
    });
	var marker10 = new google.maps.Marker({
      position: Esplanade,
      icon: image
    });

    marker1.setMap(map);
    marker2.setMap(map);
    marker3.setMap(map);
    marker4.setMap(map);
    marker5.setMap(map);
    marker6.setMap(map);
    marker7.setMap(map);
    marker8.setMap(map);
	marker9.setMap(map);
	marker10.setMap(map);
    
    //Style
    var styles = [
    	{
    		stylers: [
    			{ hue: "#fd2c38" }
    		]
		  },{
    		featureType: 'water',
    		elementType: 'all',
    		stylers: [
      			{ hue: '#0046ff' }
   	 		]
  		}
	];
    map.setOptions({styles: styles});

    //InfoWindows
    var content1 = '<b>EXPOSITION RICHARD NIESSEN</b><br><br><p>Bibliothèque universitaire du Havre - 25, rue Philippe Lebon</p><br><p>Entrée libre du lundi au vendredi de 8h30 à 19h et le samedi de 10h à 18h.</p>';
    var content2 = '<b>EXPOSITION FANETTE MELLIER </b><br><br><p>Galerie 65 de l’ESADHaR, École Supérieure d’Art et Design Le Havre-Rouen - 65 rue Demidoff</p><br><p>Entrée libre du lundi au vendredi, de 14h à 18h.</p>';
    var content3 = '<b>EXPOSITION DIANE BOIVIN</b><br><br><p>Galerie de la Maison de l’étudiant, 50 rue Jean-Jacques Rousseau</p><br><p>Entrée libre du lundi au vendredi de 9h à 17h30.</p>';
    var content4 = '<b>EXPOSITION « CHEZ GEORGES »</b><br><br><p>Réseau Lire au Havre / Bibliothèque Municipale Armand Salacrou, 17 rue Jules Lecesne</p><br><p>Entrée libre les mardis et vendredis de 10h à 19h, les mercredis et samedis de 10h à 18h et les jeudis de 12h à 18h.</p>';
    var content5 = '<b>C’EST AFFICHÉ PRES DE CHEZ VOUS</b><br><br><p>Galerie «La Consigne» - Paris de la Gare SNCF</p><br><p>Entrée libre du 9 mai au 27 juin - Visites du mardi au samedi de 14h à 18h.</p>';
    var content6 = '<b>EXPOSITION FELIX PFÄFFLI </b><br><br><p>Le Carré du Théâtre de l’Hôtel de Ville, Esplanade Jacques Tournant.</p><br><p>Entrée libre du mardi au samedi de 12h45 à 18h30, le mercredi de 9h30 à 11h30.</p>';
    var content7 = '<b>UNE KERMESSE GRAPHIQUE</b><br><br><p>Fort de Tourneville, rue du 329ème.</p><br><p>Samedi 10 mai 2014 de 14h à 19h. Entrée libre.</p>';
    var content8 = '<b>RASTER NOTON PARTY</b><br><br><p>Fort de Tourneville, rue du 329ème.</p><br><p>Samedi 10 mai 2014 à partir de 21h.</p>';
    var content9 = '<b>LE PHARE INAUGURE SA NOUVELLE FACADE</b><br><br><p>Le Phare, Centre Chorégraphique National du Havre Haute Normandie - 30 rue des Briquetiers</p><br><p>Samedi 24 mai 2014 à partir de 18h30</p>';
    var content10 = '<b>BIKE POLO SHOW #4</b><br><p>Esplanade de la Plage.</p><br><br><p>Samedi 14 juin 2014 de 11h à 17h. Entrée libre.</p>';

    var infowindow1 = new google.maps.InfoWindow({content: content1,maxWidth: 150});
    var infowindow2 = new google.maps.InfoWindow({content: content2,maxWidth: 150});
    var infowindow3 = new google.maps.InfoWindow({content: content3,maxWidth: 150});
    var infowindow4 = new google.maps.InfoWindow({content: content4,maxWidth: 150});
    var infowindow5 = new google.maps.InfoWindow({content: content5,maxWidth: 150});
    var infowindow6 = new google.maps.InfoWindow({content: content6,maxWidth: 150});
    var infowindow7 = new google.maps.InfoWindow({content: content7,maxWidth: 150});
    var infowindow8 = new google.maps.InfoWindow({content: content8,maxWidth: 150});
    var infowindow9 = new google.maps.InfoWindow({content: content9,maxWidth: 150});
    var infowindow10 = new google.maps.InfoWindow({content: content9,maxWidth: 150});
    
   	google.maps.event.addListener(marker1, 'mouseover', function() {infowindow1.open(map,marker1)});
   	google.maps.event.addListener(marker1, 'mouseout', function() {infowindow1.close(map,marker1)});
   	google.maps.event.addListener(marker1, 'click', function() {map.setCenter(marker1.getPosition())});
   	google.maps.event.addListener(marker2, 'mouseover', function() {infowindow2.open(map,marker2)});
   	google.maps.event.addListener(marker2, 'mouseout', function() {infowindow2.close(map,marker2)});
   	google.maps.event.addListener(marker2, 'click', function() {map.setCenter(marker2.getPosition())});
    google.maps.event.addListener(marker3, 'mouseover', function() {infowindow3.open(map,marker3)});
   	google.maps.event.addListener(marker3, 'mouseout', function() {infowindow3.close(map,marker3)});
   	google.maps.event.addListener(marker3, 'click', function() {map.setCenter(marker3.getPosition())});
   	google.maps.event.addListener(marker4, 'mouseover', function() {infowindow4.open(map,marker4)});
   	google.maps.event.addListener(marker4, 'mouseout', function() {infowindow4.close(map,marker4)});
   	google.maps.event.addListener(marker4, 'click', function() {map.setCenter(marker4.getPosition())});
   	google.maps.event.addListener(marker5, 'mouseover', function() {infowindow5.open(map,marker5)});
   	google.maps.event.addListener(marker5, 'mouseout', function() {infowindow5.close(map,marker5)});
   	google.maps.event.addListener(marker5, 'click', function() {map.setCenter(marker5.getPosition())});
   	google.maps.event.addListener(marker6, 'mouseover', function() {infowindow6.open(map,marker6)});
   	google.maps.event.addListener(marker6, 'mouseout', function() {infowindow6.close(map,marker6)});
   	google.maps.event.addListener(marker6, 'click', function() {map.setCenter(marker6.getPosition())});
   	google.maps.event.addListener(marker7, 'mouseover', function() {infowindow7.open(map,marker7)});
   	google.maps.event.addListener(marker7, 'mouseout', function() {infowindow7.close(map,marker7)});
   	google.maps.event.addListener(marker7, 'click', function() {map.setCenter(marker7.getPosition())});
   	google.maps.event.addListener(marker8, 'mouseover', function() {infowindow8.open(map,marker8)});
   	google.maps.event.addListener(marker8, 'mouseout', function() {infowindow8.close(map,marker8)});
   	google.maps.event.addListener(marker8, 'click', function() {map.setCenter(marker8.getPosition())});
   	google.maps.event.addListener(marker9, 'mouseover', function() {infowindow9.open(map,marker9)});
   	google.maps.event.addListener(marker9, 'mouseout', function() {infowindow9.close(map,marker9)});
   	google.maps.event.addListener(marker9, 'click', function() {map.setCenter(marker9.getPosition())});
   	google.maps.event.addListener(marker10, 'mouseover', function() {infowindow10.open(map,marker10)});
   	google.maps.event.addListener(marker10, 'mouseout', function() {infowindow10.close(map,marker10)});
   	google.maps.event.addListener(marker10, 'click', function() {map.setCenter(marker10.getPosition())});
};