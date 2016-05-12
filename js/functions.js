var menu = {
	mains: '',
	sides: '',
	desserts: '',
	drinks: '',
},
	current_menu = null,
	language = "",
	restaurant = null,
	historyPage = null,
	current_product = null;
var basket = []; //

Storage.prototype.setArray = function(key, obj) {
	return this.setItem(key, JSON.stringify(obj))
}

Storage.prototype.getArray = function(key) {
	return JSON.parse(this.getItem(key))
}

var checkHistoryArray = (window.localStorage.getArray("checkhistory")) ? window.localStorage.getArray("checkhistory"):[];

$.mobile.loader.prototype.options.text = "loading";
$.mobile.loader.prototype.options.textVisible = false;
$.mobile.loader.prototype.options.theme = "a";
$.mobile.loader.prototype.options.html = "";

function footerMenuBind(){

}

$(document).on("pageinit", function(){
	console.log("pageinit");


	$(".ui-btn").on("taphold", function(){
		return;
	});

	$(".btn").on("click", function(){
		$.blockUI({ message: null, overlayCSS: { backgroundColor: '#00f', opacity: 0 } });
		setTimeout($.unblockUI, 1000);
		/* $.mobile.loading('show');
		 setTimeout(function(){$.mobile.loading('hide');},1000);
		 console.log("double tap"); */
		//return;
	});

	$(".ui-btn").on("doubletap", function(){
		//$.mobile.loading('show');
		setTimeout(function(){$.mobile.loading('hide');},1000);
		return;
	});

	$(".ui-btn").on("dblclick", function(){
		//$.mobile.loading('show');
		setTimeout(function(){$.mobile.loading('hide');},1000);
		console.log("double click");
		return;
	});

	updateBasketIcon();
	$( "body" ).on( "basket:updated", function( event ) {
		updateBasketIcon();
	});

	$("body").on("click", "#check", function(){
		//sendCheck('cash');
	});

	//call waiter start
	$("[id^=openWaiterPopUp]").on("click", function(){
		console.log('test');
		//$.mobile.loading('show');
		$.ajax({
			type: 'POST',
			url: 'http://82.76.210.88:8000/form/garcon.php',
			crossDomain: true,
			data: {qrcode : qrCodeOK, uuid:uuid},
			dataType: 'jsonp',
			success: function(responseData, textStatus, jqXHR) {
				//console.log('POST success');
				//console.log(responseData);
				//alert("responseData.state: " + responseData.state);
				if((responseData.state != undefined) && (responseData.state == "invalid")){
					//$.mobile.loading('hide');
					window.localStorage.setArray("checkhistory", []);
					changePage("ban.html");
					window.localStorage.setArray("checkhistory", []);
					setTimeout(function(){
						console.log('exit1');
						navigator.app.exitApp();
					},5000);
					return;
				}else{
					//$.mobile.loading('hide');
					$("#waiterPopUp").popup("open");
				}
			},
			error: function (responseData, textStatus, errorThrown) {
				//$.mobile.loading('hide');
				alert("Serverul este ocupat. Te rog sa incerci mai tarziu!")
			}
		});
	});
});
var changing = false;
function changePage(page){
	if(!changing){
		changing = true;
		setTimeout(function(){
			$.mobile.changePage(page);
			changing = false;
		}, 100);
	}
}
$(document).on('pagebeforehide', function(){
	//$.mobile.loading('show');
});
$(document).on('pagebeforeshow', function() {
	console.log("pagebeforeshow");
	var currentPage = ($.mobile.activePage) ? ($.mobile.activePage.attr('id')) :  "";
	console.log("current page: " + currentPage);
	if (currentPage === undefined) {
		lang = JSON.parse(JSON.stringify(ro));
		changePage("one.html");
	}else if(currentPage === "one"){

		$(".lang").on('click', function(){
			checkLanguage();
			$("[id^=homeText]").text(lang.home_screen.homeText);
			$("[id^=scancode]").text(lang.home_screen.scancode);
		});
		$("[id^=homeText]").text(lang.home_screen.homeText);
		$("[id^=scancode]").text(lang.home_screen.scancode);
		$('#scan').on('click', function () {
			app.scan();
		});
	} else if (currentPage === "main") {
		$('.rest-name').text(restaurant);
		$(".menu_type").on("click", function(){
			current_menu = $(this).data('type');
			changePage("choose.html");

		});

		var mains_count = 0;
		$.each(menu['mains'], function(idx, category){
			mains_count += category.prod_cat.length;
		});

		var sides_count = 0;
		$.each(menu['sides'], function(idx, category){
			sides_count += category.prod_cat.length;
		});
		var desserts_count = 0;
		$.each(menu['desserts'], function(idx, category){
			desserts_count += category.prod_cat.length;
		});
		var drinks_count = 0;
		$.each(menu['drinks'], function(idx, category){
			drinks_count += category.prod_cat.length;
		});

		$('#mains_count').html(mains_count);
		$('#sides_count').html(sides_count);
		$('#desserts_count').html(desserts_count);
		$('#drinks_count').html(drinks_count);

		$('[id^=basket]').on("click", function(){
			changePage("orders.html");
		});
		$('[id^=check]').on("click", function(){
			changePage("check.html");
		});
		$(".mains .label").text(lang.choose.mains);
		$(".drinks .label").text(lang.choose.drinks);
		$(".desserts .label").text(lang.choose.desserts);
		$(".sides .label").text(lang.choose.sides);

		$("[id^=menuText]").text(lang.main.menuText);
		$("[id^=orderText]").text(lang.main.orderText);
		$("[id^=homeText]").text(lang.main.homeText);
		$("[id^=callWaiterText]").text(lang.main.callWaiterText);
		$("[id^=checkText]").text(lang.main.checkText);
		$("[id^=checkText]").text(lang.main.checkText);
		$("[id^=callWaiterHeaderText]").text(lang.main.callWaiterHeaderText);
		$("[id^=callWaiterMessageText]").text(lang.main.callWaiterMessageText);
		$("[id^=calling]").text(lang.main.calling);

	} else if (currentPage === "choose") {
		switch (current_menu){
			case 'mains':
				$(".ui-title").text(lang.choose.mains);
				break;
			case 'sides':
				$(".ui-title").text(lang.choose.sides);
				break;
			case 'desserts':
				$(".ui-title").text(lang.choose.desserts);
				break;
			case 'drinks':
				$(".ui-title").text(lang.choose.drinks);
				break;
		}
		$('[id^=basket]').on("click", function(){
			changePage("orders.html");
		});
		$('[id^=check]').on("click", function(){
			changePage("check.html");
		});
		$("[id^=menuText]").text(lang.main.menuText);
		$("[id^=orderText]").text(lang.main.orderText);
		$("[id^=homeText]").text(lang.main.homeText);
		$("[id^=callWaiterText]").text(lang.main.callWaiterText);
		$("[id^=checkText]").text(lang.main.checkText);
		$("[id^=checkText]").text(lang.main.checkText);
		$("[id^=callWaiterHeaderText]").text(lang.main.callWaiterHeaderText);
		$("[id^=callWaiterMessageText]").text(lang.main.callWaiterMessageText);
		$("[id^=calling]").text(lang.main.calling);

		refreshList();



		$("body").on("click", ".product", function () {
			current_product = $(this).data('product');
			
				changePage("orderDetails.html");
		});
	}else if (currentPage == "orderDetails") {
		$(".orderBtn").show();
		$(".quantity").hide();
		var basketItem = _.find(basket, function(item) {
			return item.id == current_product.id_prod;
		});
		if(basketItem) {
			$(".orderBtn").hide();
			$(".quantity").show();
			$("#count").html(basketItem.qty);
		}

		$('[id^=basket_icon]').on("click", function(){
			changePage("orders.html");
		});
		$('[id^=basket]').on("click", function(){
			changePage("orders.html");
		});
		$('[id^=check]').on("click", function(){
			changePage("check.html");
		});
		$("[id^=menuText]").text(lang.main.menuText);
		$("[id^=orderText]").text(lang.main.orderText);
		$("[id^=homeText]").text(lang.main.homeText);
		$("[id^=callWaiterText]").text(lang.main.callWaiterText);
		$("[id^=checkText]").text(lang.main.checkText);
		$("[id^=checkText]").text(lang.main.checkText);
		$("[id^=callWaiterHeaderText]").text(lang.main.callWaiterHeaderText);
		$("[id^=callWaiterMessageText]").text(lang.main.callWaiterMessageText);
		$("[id^=calling]").text(lang.main.calling);
		$("[id^=orderitem]").text(lang.orderDetails.order);
		$("[id^=share]").text(lang.orderDetails.share);
		$("[id^=infoText]").text(lang.orderDetails.infoText);
		setProduct(current_product);

		$(".addItem").on("click", function () {
			//check for existence
			if(basketItem) {
				increaseQty(basketItem);
				$(".orderBtn").hide();
				$(".quantity").show();
				$("#count").html(basketItem.qty);
			}else{
				basketItem = {
					id: current_product.id_prod,
					product: current_product,
					qty: 1
				};
				basket.push(basketItem);
				$(".orderBtn").hide();
				$(".quantity").show();
				$("#count").html(basketItem.qty);
			}
			updateCartList();
			$("body").trigger( "basket:updated" );
		});
		$(".removeItem").on("click", function(){
			if(basketItem.qty > 1){
				decreaseQty(basketItem);
				$("#count").html(basketItem.qty);
			}
			updateCartList();


		});

	}else if(currentPage == "orders") {
		$("[id^=titleText]").text(lang.orders.title);
		$("[id^=orderText]").text(lang.orders.orderBtn);
		updateCartList();
		$('.price').text(getCartTotal() + ' LEI');

		$('#cart_list').on('click', '.cart_item_increase', function () {
			increaseQty($(this).closest('li').data('product'));
			$('.price').text(getCartTotal() + ' LEI');
		});
		$('#cart_list').on('click', '.cart_item_decrease', function () {
			decreaseQty($(this).closest('li').data('product'));
			$('.price').text(getCartTotal() + ' LEI');
		});

		$('.payBtn').on('click', function () {
			if ($('.payBtn').data('disabled') !== true) {
				sendOrder();
				$('.payBtn').data('disabled', true);
			}
		});
	}else if(currentPage == "check"){
		$('.ui-title').text(lang.checkPage.checkHeaderText);
		$('.ui-title').text(lang.checkPage.checkHeaderText);
		$('.cashBtn label').text(lang.checkPage.cash);
		$('.cardBtn label').text(lang.checkPage.card);

		$("#checkThanksPopupHeaderText").text(lang.notice.checkThanksPopupHeaderText);
		$("#checkThanksPopupText").text(lang.notice.checkThanksPopupText);
		updateCheckList();
		$('.cardBtn').on('click', function () {
			if ($('.cardBtn').data('disabled') !== true) {
				$('.cardBtn').data('disabled', true);
				sendCheck('card');
				$('.cardBtn').data('disabled', false);
			}
		});
		$('.cashBtn').on('click', function () {
			if ($('.cashBtn').data('disabled') !== true) {
				$('.cashBtn').data('disabled', true);
				sendCheck('cash');
				$('.cashBtn').data('disabled', false);
			}
		});
	}else if(currentPage == "ban"){
		$("#goodbye").text(lang.ban.goodbye);
	}else if(currentPage == "notice"){

	}
});

$(document).on("pageshow", function(){
	//$.mobile.loading('hide');
	var thisPage = ($.mobile.activePage) ? ($.mobile.activePage.attr('id')) :  "";
	if(thisPage === 'main'){

	}else if(thisPage==='one'){
		navigator.splashscreen.hide();
	}

});

$(window).on("navigate", function (event, data) {
	var activePage = $.mobile.activePage.attr('id');
	console.log("activePage is: " + activePage);

	var direction = data.state.direction;
	console.log("directionPage: " + direction);

});

function translate(parameterRo, parameterEn){
	//console.log("language is: " + language);

	if(language == "ro"){
		return parameterRo;
	}else if((language == "en") && (parameterEn != "") && (parameterEn != undefined)){
		//console.log("parameterEn: " + parameterEn);
		return parameterEn;
	}else{
		return parameterRo;
	}
}
function checkLanguage() {
	var langCheck = document.getElementsByName("lang");
	for (var i = 0; i < langCheck.length; i++) {
		if (langCheck.item(i).checked) {
			language = langCheck.item(i).id + "";
		} else {
			language = "ro";
		}
	}
	console.log("language: " + language);

	if (language == "ro") {
		lang = JSON.parse(JSON.stringify(ro));
		//console.log("ro");
		//console.dir(ro);
	} else if (language == "en") {
		lang = JSON.parse(JSON.stringify(en));
		//console.log("en");
		//console.dir(en);
	}
}
function refreshList(){
	var add = setInterval(function(){
		var product_template = $('#product_template');
		var category_template = $('#category_template');
		var list = $('#list');

		$.each(menu[current_menu], function(idx, category){
			//add header
			var this_category = category_template.clone();
			this_category = this_category.show();
			this_category = this_category.removeAttr('id');
			this_category = this_category.find('span').text(translate(category.cat_name, category.en_cat_name));

			list.append(this_category);
			$.each(category.prod_cat, function(idx, product){
				product.category = {
					"cat_name": category.cat_name,
					"en_cat_name": category.en_cat_name
				};
				console.log(product);
				//add product
				var this_product = product_template.clone();
				this_product.show();
				this_product.removeAttr('id');
				this_product.data('product', product);
				this_product.find('.product_title').text(translate(product.nume_prod, product.en_nume_prod));
				if(product.img_prod){
					this_product.find('img').attr('src', product.img_prod);
				}else{
					this_product.find('img').attr('src', 'http://placehold.it/350x150');
				}
				this_product.find('.price').text(product.pret_prod + ' LEI');
				list.append(this_product);
			});

		});

		$("#foodList").trigger("create");
	}, 50);
	setTimeout(function(){
			clearInterval(add);}
		, 55);
//	$.mobile.loading('hide');
}
function addMenu() {
	$.each(rest.rest_menus, function (key, m) {
		menu[key] = m;
	});
}
function setProduct(current_product){
	$('#product_title').text(translate(current_product.nume_prod, current_product.en_nume_prod));

	if(current_product.img_prod){
		$('.product_img').attr('src', current_product.img_prod);
	}else {
		$('.product_img').attr('src', 'http://placehold.it/350x150');
	}
	$('#addProducts').data('id', current_product.id_prod);
	$('#product_label').text(translate(current_product.desc_prod, current_product.en_desc_prod));
	$('#product_price').text(current_product.pret_prod + ' LEI');

}
function updateCartList(){
	//generate cart content;
	var cart_item_template = $('#cart_item_template');
	var cart_list = $('#cart_list');
	cart_list.empty();
	$.each(basket, function(idx, basketItem){
		var this_cart_item = cart_item_template.clone();
		this_cart_item.data('product', basketItem);
		if(basketItem.product.img_prod){
			this_cart_item.find('.cart_item_photo').attr('src', basketItem.product.img_prod);
		}else{
			this_cart_item.find('.cart_item_photo').attr('src', 'http://placehold.it/350x150');
		}

		this_cart_item.find('.cart_item_name').text(translate(basketItem.product.nume_prod, basketItem.product.en_nume_prod));
		this_cart_item.find('.cart_item_category').text(translate(basketItem.product.category.cat_name, basketItem.product.category.en_cat_name));
		this_cart_item.find('.cart_item_price').html(basketItem.product.pret_prod + " LEI <small>x " + basketItem.qty+"</small>");
		this_cart_item.show();
		this_cart_item.removeAttr('id');
		cart_list.append(this_cart_item);
		cart_list.listview("refresh");
	});
}
function updateCheckList(){
	//generate check content;
	var check_item_template = $('#check_item_template');
	var check_list = $('#check_list');
	check_list.empty();
	var total = 0;
	if(checkHistoryArray.length > 0){

		checkHistory = window.localStorage.getArray("checkhistory");
		if(checkHistory.length > 0){
			$.each(checkHistory, function(idx, commands){

				$.each(commands, function(idx, checkItem){
					console.log("CHECK ITEM: ");
					console.log(checkItem);
					console.log(checkItem.product);
					var this_check_item = check_item_template.clone();
					this_check_item.data('product', checkItem);

					this_check_item.find('.check_item_name').text(translate(checkItem.product.nume_prod, checkItem.product.en_nume_prod));
					this_check_item.find('.check_item_price').html(checkItem.product.pret_prod + " LEI <small>x " + checkItem.qty+"</small>");
					this_check_item.find('.check_item_total_price').html(checkItem.product.pret_prod * checkItem.qty + " LEI");
					total += checkItem.product.pret_prod * checkItem.qty;
					this_check_item.show();
					this_check_item.removeAttr('id');
					check_list.append(this_check_item);

				});
			});
		}
	}
	$('.check_total').text(total + " LEI");
	check_list.listview("refresh");
}
function updateBasketIcon(){
	var itemsInBasket = basket.length;
	var totalInBasket = 0;
	$.each(basket, function(idx, basketItem){
		totalInBasket += basketItem.product.pret_prod * basketItem.qty;
	});

	if(totalInBasket > 0){
		$('[id^=basket_icon]').find('.ordersNo').show();
	}else{
		$('[id^=basket_icon]').find('.ordersNo').hide();
	}
	$('[class^=ordersNo]').text(itemsInBasket);
}
function getCartTotal(){
	var total = 0;
	$.each(basket, function(idx, basketItem){
		console.log(basketItem);
		total += basketItem.product.pret_prod * basketItem.qty;
	});
	return total;
}
function increaseQty(basketItem){
	console.log(basketItem);
	basketItem.qty += 1;
	updateCartList();
}
function decreaseQty(basketItem){
	basketItem.qty -= 1;
	if(basketItem.qty < 1){
		basket.splice( $.inArray(basketItem, basket), 1 );
	}
	updateCartList();
}
function sendOrder(){
	console.log(basket);
	console.log("basket at start sendOrder");
	console.dir(basket);
	//$.mobile.loading('show');
	id_prod_val = "";
	cant_val = "";

	$.each(basket, function(idx, basketItem){
		console.log(basketItem.product);
		id_prod_val += basketItem.id + " ";
		cant_val += basketItem.qty + " ";
	});

	id_prod_val = id_prod_val.trim();
	cant_val = cant_val.trim();

	console.log("id_prod_val: " + id_prod_val);
	console.log("cant_val: " + cant_val);
	var dataToSend = {qrcode : qrCodeOK, id_prod : id_prod_val, cant: cant_val, comment : '', uuid:uuid};
	//console.dir(dataToSend);

	$.ajax({
		type: 'POST',
		url: 'http://82.76.210.88:8000/form/place_order_app.php',
		crossDomain: true,
		data: dataToSend,
		dataType: 'jsonp',
		success: sendOrderSuccess,
		error: sendOrderError
	});

	function sendOrderSuccess(responseData, textStatus, jqXHR) {
		//$.mobile.loading('hide');
		console.log("dataToSend");
		console.dir(dataToSend);
		console.log('POST success');
		console.log('responseData: ');
		console.dir(responseData);
		console.log('textStatus: '+ textStatus);
		//alert("responseData.state: " + responseData.state);
		if((responseData.state != undefined) && (responseData.state == "invalid")){
			//$.mobile.loading('hide');
			window.localStorage.setArray("checkhistory", []);
			basket = [];
			checkHistoryArray = [];
			changePage("ban.html");
			setTimeout(function(){
				console.log('exit2');
				navigator.app.exitApp();
			},5000);
			return;
		}else if((responseData.state != undefined) && (responseData.state == "valid")){
			//$.mobile.loading('hide');
			//console.log(responseData);
			orderId = responseData;
			console.log(orderId);
			// add order to check history
			console.log("basket on send order success");
			console.dir(basket);
			//basketBefore.push(basket);
			//orderIdArray.push(orderId);

			checkHistoryArray.push(basket); //add order to history
			window.localStorage.setArray("checkhistory", checkHistoryArray); //set array

			checkHistory = window.localStorage.getArray("checkhistory"); //get array

			console.log("checkHistory");
			console.dir(checkHistory);
			basket = []; //empty the basket after sent the order
			
				changePage("main.html");


		}else{
			console.log("order don't send");
			//$.mobile.loading('hide');
			$("#errorOrderPopUp").popup("open");
		}
	};

	function sendOrderError(responseData, textStatus, errorThrown) {
		//	$.mobile.loading('hide');
		console.log('POST failed.');
		console.log(responseData);
		console.log("Erroare sendOrder!")
		//alert("Comanda NU a fost trimisa!")
		//$.mobile.loading('hide');
		$("#errorOrderPopUp").popup("open");
	}

}
function sendCheck(payment) {
	//	$.mobile.loading('show');
	//	setTimeout(function(){$.mobile.loading('hide');}, 1000);
	// payment = cash or card
	//dataToSend = {id_order: orderIdArray, met_plata: payment}
	dataToSend = {qrcode: qrCodeOK, met_plata: payment, uuid: uuid}
	console.log("dataToSend");
	console.dir(dataToSend);

	$.ajax({
		type: 'POST',
		url: 'http://82.76.210.88:8000/form/req_tab.php',
		crossDomain: true,
		data: dataToSend,
		dataType: 'jsonp',
		success: sendCheckSuccess,
		error: sendCheckError
	});

	function sendCheckSuccess(responseData, textStatus, jqXHR) {
		//	$.mobile.loading('hide');
		console.log('POST Success.');
		console.log(responseData);
		//alert("responseData.state: " + responseData.state);
		if ((responseData.state != undefined) && (responseData.state == "invalid")) {
			//	$.mobile.loading('hide');
			checkHistoryArray = [];
			basket = [];
			window.localStorage.setArray("checkhistory", []); //set array on ban
			changePage("ban.html");
			setTimeout(function () {
				console.log('exit3');
				navigator.app.exitApp();
			}, 5000);
			return;
		} else if ((responseData.status != undefined) && (responseData.status == "valid")) {
			checkHistoryArray = [];
			basket = [];
			window.localStorage.setArray("checkhistory", []); //set array

			setTimeout(function () {
				// $("#checkThanksPopup").popup("open").on({
				// 	popupafterclose: function() {
					changePage("one.html");
					// }
				// });
				// $(".ui-popup-active").css();
			}, 100);


			/*setTimeout(function(){
			 $("#checkThanksPopup").popup("close");
			 },5000); */

			setTimeout(function () {
				//console.log('exit4');
				//navigator.app.exitApp();
				changePage("one.html", {reload: true, changeHash: true});
			}, 10000);
		} else {
			alert("Error!");
		}
	}

	function sendCheckError(responseData, textStatus, errorThrown) {
		console.log('POST failed.');
		console.log(responseData);
		console.log("Error sendCheck!")
	}
}

setInterval(function(){
	if(checkValid == 1){
		//$.mobile.loading('show');
		$.ajax({
			type: 'POST',
			url: 'http://82.76.210.88:8000/form/get_status.php',
			crossDomain: true,
			data: {qrcode : qrCodeOK, uuid:uuid},
			dataType: 'jsonp',
			success: function(responseData, textStatus, jqXHR) {
				//console.log('POST success');
				console.log(responseData);
				//alert("responseData.state: " + responseData.state);
				if((responseData.state != undefined) && (responseData.state == "invalid")){
					console.log("responseData.state if: " + responseData.state);
					//$.mobile.loading('hide');
					checkHistoryArray = [];
					basket = [];
					window.localStorage.setArray("checkhistory", []); //set array on ban
					changePage("one.html");
					return;
				}else{
					//$.mobile.loading('hide');
					console.log("responseData.state else: " + responseData.state);
					return;
				}
			},
			error: function (responseData, textStatus, errorThrown) {
				console.log('POST failed.');
				console.log(responseData);
				//$.mobile.loading('hide');
				console.log("Server error - state.");
				return;
			}
		});
	}
}, 10000);

