

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