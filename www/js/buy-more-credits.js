function getProductIds(handleData) {
	$.ajax({
		url: 'http://45.79.7.27:81/corkcup/card/getaCard.php',
		success: function(result) {
			handleData(result);
		},
		error: function(error) {
            console.log(error);
        }	
	});
}

function getProducts() {
	document.addEventListener('deviceready', function() {
		getProductIds(function(productIds) {
			productIds =  ['sack_pack', 'back_pack', 'plaque_pack', 'grimey_pack', 'all_pack'];
			inAppPurchase
				.getProducts(productIds)
				.then(function(products) {
					console.log('products', products);
					if(products.length > 0) {
						$("#load_products > button").css("display", "none");
						for(var i=0; i< products.length; i++) {
							products[i].title = products[i].title.replace("(CorkCup)", "");
							$("#products").append('<li><button onclick="buy(\''+ products[i].productId +'\')" id='+ products[i].productId +' class="navigate"><span>'+ products[i].title +'</span>&nbsp;-&nbsp;' + products[i].price +'&nbsp;<span>/&nbsp;'+ products[i].description +'</span></button></li>');
						}
					}
				});
			});
	}, false);
}

function buy(productId) {
	document.addEventListener("deviceready", function () {
		inAppPurchase
			.buy(productId)
			.then(function (data) {
				console.log(JSON.stringify(data));
				var purchased = [];
				if(window.localStorage.getItem('purchased') != null) {
					purchased = JSON.parse(window.localStorage.getItem('purchased'));
				}
				purchased.push(data);
				window.localStorage.setItem('purchased', JSON.stringify(purchased));

				updateCardBought();
			})
			.catch(function (err) {
				console.log(err);
			});
	}, false)
}


function restore() {
	document.addEventListener("deviceready", function () {
		inAppPurchase
			.restorePurchases()
			.then(function (purchases) {
				console.log(JSON.stringify(purchases));
				window.localStorage.setItem('purchased', JSON.stringify(purchases));
				updateCardBought();
			})
			.catch(function (err) {
				console.log(err);
			});
	}, false)
}

function updateCardBought() {
	var purchased = [];

	if(window.localStorage.getItem('purchased') != null) {
		purchased = JSON.parse(window.localStorage.getItem('purchased'));
	}

	for(var i=0; i< purchased.length; i++) {
		$('#' + purchased[i].productId).css('background', '#23d332');
	}
}