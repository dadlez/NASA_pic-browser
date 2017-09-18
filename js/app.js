$(() => {
	const myAPIKey = "0zicIRIQ2DgmYwUe3vcIGs1yCaHEqjU98gzHBhcn";
	const epicUrlMeta = "https://epic.gsfc.nasa.gov/api/enhanced/";
	const epicUrlAsset = "https://epic.gsfc.nasa.gov/archive/enhanced/";
	const searchUrl = "https://images-api.nasa.gov/search?q=earth%20view&description=earth%20view&media_type=image";
	const imgUrl = "https://images-assets.nasa.gov/image/";

	const gallery = $('.gallery').find('.images');
	const showMore = $('.more');
	const showGallery = $('.show_gallery').find('button');

// zdjęcie tła pierwszej sekcji
	$.ajax({
		url: epicUrlMeta,
	}).done(function(response){
		let imageID = response[1].image;
		let date = response[1].date.split(" ", 3)[0].split("-");
		let href = epicUrlAsset + date[0] + "/" + date[1] + "/" + date[2] + "/jpg/" + imageID + ".jpg?api_key=" + myAPIKey;
		// let href = "https://epic.gsfc.nasa.gov/archive/enhanced/2017/05/29/jpg/epic_RGB_20170529090040_02.jpg"

		let picture = $('.picture');
		let img = $('<img>').attr('src', href);

		picture.append(img);
		img.fadeIn(2000);
	});

	// galeria
	// let gallery = $('.gallery').find('.images');
	let pictures = [];

	// ładowanie zdjęć z preloadingiem
	function preloadPictures() {
		let j = 0;

		// for (let i = 0; j < 6; i++)
		for (let i = 0; i < 6; i++){
			let src = pictures.shift(i);
			// console.log(src);
			console.log(i);

			// sprawdzenie czy zdjęcie istnieje, jeśli tak, dodaj do galerii
			$.ajax({
				url: src,
				type: 'GET',
				async: true // jeśli jest false, skrypt działa wg założeń. Zostawienie true powoduje, że j nie jes inkrementowane, więc pętla jest nieskończona.
			}).done((response) => {
				console.log("ok");
				let img = $('<img>').attr('src', src);
				img.hide();
				gallery.append(img);
				j++;
			});
		}

		// ładowanie wszystkich zdjęć, niezależnie czy link działa czy nie
		// for (let i = 0; i < 6; i++) {
		// 	let img = $('<img>').attr('src', pictures.shift(i));
		// 	img.hide();
		// 	gallery.append(img);
		// }

	}

	function addPictures() {
		let len = gallery.find('img').length

		// dzięki pętli niwelowane jest opóźnienie przy zastosowaniu: gallery.find('img').show()
		gallery.find('img').each((i, e) => {
			if (i >= len - 7) {
				$(e).show();
			}
		});

		// for (let len = gallery.find('img').length, i = len; i > len - 6; i--) {
		// 	gallery.find('img')[i -1].show();
		// }
	}

	// ładowanie zdjęć bez preloadingu
	// function addPictures() {
	// 	// dodanie kolejnych 6 zdjęć z listy do galerii
	// 	for (let i = 0; i < 6; i++){
	// 		let img = $('<img>').attr('src', pictures.shift(i));
	// 		// img.attr('style', {display: none})
	// 		// console.log(img);
	// 		gallery.append(img);
	// 	}
	// }

	// pobranie listy linków do zdjęć
	$.ajax({
		url: searchUrl
	}).done((response) => {

		response.collection.items.forEach(function(e,i) {
			let nasa_id = e.data[0].nasa_id;
			let href = imgUrl + nasa_id + "/" + nasa_id + "~small.jpg";
			// console.log(href);
			// console.log(nasa_id);
			pictures.push(href)
		});
		preloadPictures();
		addPictures();
		preloadPictures();
	});

	showMore.click(() => {
		addPictures();
		preloadPictures();
	});

	showGallery.click(() => {
		$('.gallery').fadeIn(500);
	});

	$('.close').click(() => {
		$('.gallery').fadeOut(500);
	});

});
