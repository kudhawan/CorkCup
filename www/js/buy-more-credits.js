$(document).ready(function(){
	$("#load_products > button").css("display", "none");
	getProducts();
});

var all_pack = 'all_pack';

function getProductIds(handleData, handleErr) {
	$.ajax({
		url: 'http://45.79.7.27:81/corkcup/card/allproducts.php',
		success: function(result) {
			if(result.success == 1) {
				handleData(result.allproducts);
			} else{
				handleErr(result);
			}
		},
		error: function(error) {
			console.log(error);
			handleErr(error);
        }	
	});
}

function getProducts() {
	document.addEventListener('deviceready', function() {
		showSpinner();
		getProductIds(function(result) {
			var productIds = result.map(function(r) { return r.name });
			window.sessionStorage.setItem('productIds', JSON.stringify(productIds));
			inAppPurchase
				.getProducts(productIds)
				.then(function(products) {
					hideSpinner();
					console.log('products', products);
					if(products.length > 0) {
						$("#load_products > button").css("display", "none");						
						for(var i=0; i< products.length; i++) {
							products[i].title = products[i].title.replace("(CorkCup)", "");
							$("#products").append('<li><button onclick="buy(\''+ products[i].productId +'\')" id='+ products[i].productId +' class="navigate" ><span>'+ products[i].title +'</span>&nbsp;-&nbsp;' + products[i].price +'&nbsp;<span>/&nbsp;'+ products[i].description +'</span></button></li>');										
							$("#" + products[i].productId).css('background', result.find(function(r) { return r.name == products[i].productId })['color_code']);
						}

						restorePurchases();
						
					} else {
						$("#load_products > button").css("display", "block");
					}
				}).catch(function(err){
					hideSpinner();
					$("#load_products > button").css("display", "block");
				});
			}, function(err) {
				hideSpinner();
				$("#load_products > button").css("display", "block");
			});
	}, false);
}

function buy(productId) {
	document.addEventListener("deviceready", function () {
		showSpinner();
		inAppPurchase
			.buy(productId)
			.then(function (data) {
				hideSpinner();
				data['productId'] = productId;
				console.log(JSON.stringify(data));
				var purchased = [];
				if(window.sessionStorage.getItem('purchased') != null) {
					purchased = JSON.parse(window.sessionStorage.getItem('purchased'));
				}

				if(productId === 'all_pack') {
					purchased = JSON.parse(window.sessionStorage.getItem('productIds'));
				} else {
					purchased.push(productId);
				}

				window.sessionStorage.setItem('purchased', JSON.stringify(purchased));

				updateCardBought();
				userOrder(data);
			})
			.catch(function (err) {
				hideSpinner();
				console.log(err);
			});
	}, false)
}

function updateCardBought() {
	var purchased = [];

	if(window.sessionStorage.getItem('purchased') != null) {
		purchased = JSON.parse(window.sessionStorage.getItem('purchased'));
	}

	if(purchased.indexOf(all_pack) > -1) {
		purchased = JSON.parse(window.sessionStorage.getItem('productIds'));
	};

	for(var i=0; i< purchased.length; i++) {
		$('#' + purchased[i]).addClass('disabled').attr("disabled", true);
	}
}

function restorePurchases() {
	inAppPurchase
	.restorePurchases()
	.then(function (purchases) {
		console.log(JSON.stringify(purchases));
		purchases = purchases.map(function(p) { return p.productId; });
		window.sessionStorage.setItem('purchased', JSON.stringify(purchases));

		updateCardBought();
	})
	.catch(function (err) {
		console.log(err);
	});
}

function userOrder(data) {

	window.plugins.uniqueDeviceID.get(function (uuid) {
		var data = {
			user_id: device.uuid,
			products: [{
				productId: data.productId,
				signature: data.signature,
				receipt: data.receipt,
				transactionId: data.transactionId
			}],
			platform:  device.platform,
		};

		if(device.platform.toLowerCase() == 'ios') {
			data['user_id'] = uuid
		}

		$.ajax({
			url:'http://45.79.7.27:81/corkcup/team/userOrder.php',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'JSON',
			success: function(result) {
				console.log(result);
			}
		});
	});
}