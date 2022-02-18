var massgEmpty = ('Favorite Article List Empty'),
	articleLabel = ('View All Posts'),
	link_articleLabel = ('https://www.ibloggospel.com/');
(function($) {
	"use strict";
	var OptionManager = (function() {
		var objToReturn = {};
		var defaultOptions = {
			bookmarkIcon: 'bookmarkIcon',
			bookmarkBadge: 'show-bookmark',
			articleQuantity: 'article-quantity',
			affixBookmarkIcon: true,
			showBookmarkModal: true,
			clickOnAddToBookmark: function($addTobookmark) {},
			clickOnbookmarkIcon: function($bookmarkIcon, konten) {},
		};
		var getOptions = function(customOptions) {
			var options = $.extend({}, defaultOptions);
			if (typeof customOptions === 'object') {
				$.extend(options, customOptions);
			}
			return options;
		}
		objToReturn.getOptions = getOptions;
		return objToReturn;
	}());
	var articleManager = (function() {
		var objToReturn = {};
		localStorage.konten = localStorage.konten ? localStorage.konten : "";
		var getIndexOfarticle = function(id) {
			var articleIndex = -1;
			var konten = getAllkonten();
			$.each(konten, function(index, value) {
				if (value.id == id) {
					articleIndex = index;
					return;
				}
			});
			return articleIndex;
		}
		var setAllkonten = function(konten) {
			localStorage.konten = JSON.stringify(konten);
		}
		var addarticle = function(id, title, link, summary, quantity, borkimage) {
			var konten = getAllkonten();
			konten.push({
				id: id,
				title: title,
				link: link,
				summary: summary,
				quantity: quantity,
				borkimage: borkimage
			});
			setAllkonten(konten);
		}
		var getAllkonten = function() {
			try {
				var konten = JSON.parse(localStorage.konten);
				return konten;
			} catch (e) {
				return [];
			}
		}
		var updatePoduct = function(id, quantity) {
			var articleIndex = getIndexOfarticle(id);
			if (articleIndex < 0) {
				return false;
			}
			var konten = getAllkonten();
			konten[articleIndex].quantity = typeof quantity === "undefined" ? konten[articleIndex].quantity : quantity;
			setAllkonten(konten);
			return true;
		}
		var setarticle = function(id, title, link, summary, quantity, borkimage) {
			if (typeof id === "undefined") {
				console.error("id required")
				return false;
			}
			if (typeof title === "undefined") {
				console.error("title required")
				return false;
			}
			if (typeof link === "undefined") {
				console.error("link required")
				return false;
			}
			if (typeof borkimage === "undefined") {
				console.error("borkimage required")
				return false;
			}
			summary = typeof summary === "undefined" ? "" : summary;
			if (!updatePoduct(id)) {
				addarticle(id, title, link, summary, quantity, borkimage);
			}
		}
		var cleararticle = function() {
			setAllkonten([]);
		}
		var removearticle = function(id) {
			var konten = getAllkonten();
			konten = $.grep(konten, function(value, index) {
				return value.id != id;
			});
			setAllkonten(konten);
		}
		var getTotalQuantity = function() {
			var total = 0;
			var konten = getAllkonten();
			$.each(konten, function(index, value) {
				total += value.quantity;
			});
			return total;
		}
		objToReturn.getAllkonten = getAllkonten;
		objToReturn.updatePoduct = updatePoduct;
		objToReturn.setarticle = setarticle;
		objToReturn.cleararticle = cleararticle;
		objToReturn.removearticle = removearticle;
		objToReturn.getTotalQuantity = getTotalQuantity;
		return objToReturn;
	}());
	var loadBookmarkEvent = function(userOptions) {
		var options = OptionManager.getOptions(userOptions);
		var $bookmarkIcon = $("." + options.bookmarkIcon);
		var $bookmarkBadge = $("." + options.bookmarkBadge);
		var articleQuantity = options.articleQuantity;
		var idBookmarkModal = 'cart-modal';
		var idbookmarkTable = 'cart-table';
		var idEmptyBookmarkMessage = 'cart-empty-message';
		var AffixMybookmarkIcon = 'bookmarkIcon-affix';
		$bookmarkBadge.text(articleManager.getTotalQuantity());
		if (!$("#" + idBookmarkModal).length) {
			$('body').append(
				'<div class="pop-area" id="' + idBookmarkModal + '">' +
				'<div class="pop-html">' +
				'<div class="head-pop"><a class="close-btn buka-tutup">X</a></div>' +
				'<div class="body-content">' +
				'<span class="table-responsive" id="' + idbookmarkTable + '"></span>' +
				'</div>' +
				'</div>' +
				'</div>'
			);
		}
		var drawTable = function() {
			var $bookmarkTable = $("#" + idbookmarkTable);
			$bookmarkTable.empty();
			var konten = articleManager.getAllkonten();
			$.each(konten, function() {
				$bookmarkTable.append(
					'<table class="table">' +
					'<tbody>' +
					'<tr title="' + this.summary + '" data-id="' + this.id + '">' +
					'<td class="item-left img-left"><img width="60px" height="60px" src="' + this.borkimage + '"/></td>' +
					'<td class="item-left"><a href="' + this.link + '">' + this.title + '</a></td>' +
					'<td class="item-left" title="Remove favorit" class="text-center" style="width: 30px;"><a class="btn-remove"><svg class="line" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g transform="translate(3.500000, 2.000000)"><path d="M15.3891429,7.55409524 C15.3891429,15.5731429 16.5434286,19.1979048 8.77961905,19.1979048 C1.01485714,19.1979048 2.19295238,15.5731429 2.19295238,7.55409524"></path><line x1="16.8651429" y1="4.47980952" x2="0.714666667" y2="4.47980952"></line><path d="M12.2148571,4.47980952 C12.2148571,4.47980952 12.7434286,0.714095238 8.78914286,0.714095238 C4.83580952,0.714095238 5.36438095,4.47980952 5.36438095,4.47980952"></path></g></svg></a></td>' +
					'</tr>' +
					'</tbody>' +
					'</table>'
				);
			});
			$bookmarkTable.append(konten.length ? '' :
				'<div role="alert" id="' + idEmptyBookmarkMessage + '"><div class="text-center"><svg width="80" height="80" viewBox="0 0 24 24"><path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V7.5L21,13V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V13L12,8.5V6.5C10.55,5.4 8.45,5 6.5,5V5Z" fill="#007bff"/></svg><center>' + massgEmpty + '</center><a class="btn btn-outline-info m-2" href="' + link_articleLabel + '">' + articleLabel + '</a></div></div>'
			);
		}
		var showModal = function() {
			drawTable();
		}
		/*
		EVENT ADD TO BOOKMARK LIST
		*/
		if (options.affixBookmarkIcon) {
			var bookmarkIconBottom = $bookmarkIcon.offset().top * 1 + $bookmarkIcon.css("height").match(/\d+/) * 1;
			$(window).scroll(function() {
				$(window).scrollTop() >= bookmarkIconBottom ? $bookmarkIcon.addClass(AffixMybookmarkIcon) : $bookmarkIcon.removeClass(AffixMybookmarkIcon);
			});
		}
		$bookmarkIcon.click(function() {
			options.showBookmarkModal ? showModal() : options.clickOnbookmarkIcon($bookmarkIcon, articleManager.getAllkonten());
		});
		$(document).on('keypress', "." + articleQuantity, function(evt) {
			if (evt.keyCode == 38 || evt.keyCode == 40) {
				return;
			}
			evt.preventDefault();
		});
		$(document).on({
			click: function() {
				var $tr = $(this).closest("tr");
				var id = $tr.data("id");
				$tr.hide(500, function() {
					articleManager.removearticle(id);
					drawTable();
					$bookmarkBadge.text(articleManager.getTotalQuantity());
				});
			}
		}, '.btn-remove');
	}
	$(document).on({
		click: function() {
			$('.pop-area').toggleClass('open');
			return false;
		}
	}, '.buka-tutup');
	$(function() {
		var goTohartomyBookmark = function($addTobookmarkBtn) {}
		$('.hartomy-bookmark-btn').hartomyBookmark({
			'bookmarkIcon': 'buka-tutup',
			'affixBookmarkIcon': !0x0,
			'clickOnAddToBookmark': function(a) {
				goTohartomyBookmark(a)
			},
			'afterAddOnBookmark': function(a) {
				console.log('afterAddOnBookmark', a)
			},
			'clickOnAddToBookmark': function(a) {
				goTohartomyBookmark(a)
			}
		})
	});
	var MyBookmark = function(target, userOptions) {
		/*
		PRIVATE
		*/
		var $target = $(target);
		var options = OptionManager.getOptions(userOptions);
		var $bookmarkBadge = $("." + options.bookmarkBadge);
		/*
		EVENT TARGET ADD TO BOOKMARK
		*/
		$target.click(function() {
			options.clickOnAddToBookmark($target);
			var id = $target.data('id');
			var title = $target.data('title');
			var link = $target.data('link');
			var summary = $target.data('summary');
			var quantity = $target.data('quantity');
			var borkimage = $target.data('borkimage');
			articleManager.setarticle(id, title, link, summary, quantity, borkimage);
			$bookmarkBadge.text(articleManager.getTotalQuantity());
		});
	}
	$.fn.hartomyBookmark = function(userOptions) {
		loadBookmarkEvent(userOptions);
		return $.each(this, function() {
			new MyBookmark(this, userOptions);
		});
	}
})(jQuery);
