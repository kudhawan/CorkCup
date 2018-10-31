$(document).ready(function(){
	$("#load_products > button").css("display", "none");
	getProducts();
});

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

						updateCardBought();
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
				if(window.localStorage.getItem('purchased') != null) {
					purchased = JSON.parse(window.localStorage.getItem('purchased'));
				}
				purchased.push(data);
				window.localStorage.setItem('purchased', JSON.stringify(purchased));

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

	if(window.localStorage.getItem('purchased') != null) {
		purchased = JSON.parse(window.localStorage.getItem('purchased'));
	}

	for(var i=0; i< purchased.length; i++) {
		$('#' + purchased[i].productId).addClass('disabled').attr("disabled", true);
	}
}

function userOrder(data) {

	window.plugins.uniqueDeviceID.get(function (uuid) {
		var data = {
			user_id: uuid,
			products: [{
				productId: data.productId,
				signature: data.signature,
				receipt: data.receipt,
				transactionId: data.transactionId
			}],
			platform:  device.platform,
		};

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