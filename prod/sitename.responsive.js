(function($) {

	var siteResponsive = (function() {

		// Selections
		var $sel = {};
		$sel.window = $(window);
		$sel.body = $("body");
		$sel.menuBurger = $(".menu-burger", $sel.body);

		return {



			// Adds href="tel" to the phone numbers
			mobilizePhones: function($phones) {
				$phones.each(function() {
					var $phone = $(this),
						phoneText = $phone.text(),
						phoneNum = phoneText.replace(/ /g,"").replace(/-/g,"").replace(/\(/g,"").replace(/\)/g,""),
						phoneLink = '<a href="tel:phoneNum">' + phoneText + '</a>';
					$phone.empty().html(phoneLink);
				});
			},



			// Initialize horizontal touch slider
			slider: {
				make: function($list, params) {
					$list.slick(params);
				},
				remove: function($list) {
					$list.slick("unslick");
				}
			},



			// Initialize simple horizontal scroll
			scroll: {
				make: function($list, params) {
					var $listItems = $list.find(params.items),
						listWidth = 0;
					$listItems.each(function() {
						var $item = $(this);
						listWidth += $item.outerWidth();
					});
					$list
						.addClass("mobile-scroll")
						.css({
							"width": listWidth + "px"
						})
						.wrap('<div class="mobile-scroll-holder" />');
				},
				remove: function($list) {
					$list
						.removeClass("mobile-scroll")
						.css({
							"width": "auto"
						})
						.unwrap()
				}
			},



			// Initialize and add actions for menu burger
			menu: {
				isShow: false,
				init: function() {
					var self = this;
					$sel.body.append('<div class="menu-overlay"></div>');
					$sel.menuBurger.on("click", function() {
						self.isShow ? self.hide() : self.show();
					});
					$(".menu-overlay", $sel.body).on("click", function() {
						self.hide();
					});
				},
				show: function() {
					this.isShow = true;
					$sel.menuBurger.addClass("active");
					$sel.body.addClass("show-menu");
				},
				hide: function() {
					this.isShow = false;
					$sel.menuBurger.removeClass("active");
					$sel.body.removeClass("show-menu");
				}
			},

			// Initialize scripts for each window size
			initSSM: function() {
				var self = this;

				ssm.addStates([
					{
						id: "tablet",
						query: "(max-width: 900px)",
						onEnter: function() {

						},
						onLeave: function() {

						}
					}, {
						id: "mobileLandscape",
						query: "(max-width: 680px)",
						onEnter: function() {
							self.menu.init();
							
							self.mobilizePhones($(".header-phone", $sel.body));
							
							self.scroll.make($(".rates", $sel.body), {
								items: "span"
							});
							
							self.slider.make($(".products", $sel.body), {
								infinite: true,
								arrows: false,
								dots: false,
								responsive: [
									{
										breakpoint: 600,
										settings: {
											slidesToShow: 2
										}
									}, {
										breakpoint: 400,
										settings: {
											slidesToShow: 1,
											dots: true
										}
									}
								]
							});
						},
						onLeave: function() {
							self.slider.remove($(".products", $sel.body));
							self.scroll.remove($(".rates", $sel.body));
						}
					}, {
						id: "mobilePortrait",
						query: "(max-width: 560px)",
						onEnter: function() {

						},
						onLeave: function() {
							
						}
					}
				]);
			}
		}

	})();

	siteResponsive.initSSM();




})(jQuery);