/*eslint no-unused-vars: 0*/

// function to provide hover behavior for main menu for wide screens
var hoverMenu = (function ($, undefined) {
    "use strict";
    let linkContainer = $(".main-menu").find(".dropdown");
    let thisDocument = $(document);
    const MAX_SCREEN_WIDTH = 768;

    let _showMenu = function () {
        if ($(window).width() >= MAX_SCREEN_WIDTH) {
            var thisLinkContainer = $(this);
            thisLinkContainer.siblings().each(function () {
                var thisSibling = $(this);
                thisSibling.removeClass("stay-open");
                thisSibling.find(".dropdown-menu").slideUp();
            });
            thisLinkContainer.find(".dropdown-menu").slideDown();
        }
    };

    let _hideMenu = function () {
        var thisLinkContainer = $(this);
        if (!thisLinkContainer.hasClass("stayOpen")) {
            thisLinkContainer.find(".dropdown-menu").slideUp();
        }
    };

    let init = function () {
        let screenWidth = $(window).width();
        if (screenWidth >= MAX_SCREEN_WIDTH) {
            // open/close menu on hover
            linkContainer.hoverIntent(_showMenu, _hideMenu);
        }

        // open menu to stay open on click
        linkContainer.on("touchclick", function (event) {
            event.stopImmediatePropagation();
            let thisLinkContainer = $(this);
            let thisMenu = thisLinkContainer.find(".dropdown-menu");
            if (thisLinkContainer.hasClass("stayOpen")) {
                thisMenu.slideUp();
                thisLinkContainer.removeClass("stayOpen");
            } else {
                linkContainer.removeClass("stayOpen");
                thisMenu.slideDown();
                thisLinkContainer.addClass("stayOpen");
            }
        });

        // close menu when user clicks in document
        thisDocument.on("touchclick", function () {
            linkContainer.each(function () {
                var thisLinkContainer = $(this);
                var thisMenu = thisLinkContainer.find(".dropdown-menu");
                thisLinkContainer.removeClass("stay-open");
                thisMenu.slideUp();
            });
        });

        $(window).resize(function () {
            if ($(window).width() >= MAX_SCREEN_WIDTH) {
                linkContainer.hoverIntent(_showMenu, _hideMenu);
            }
        });
    };

    return {
        init: init
    };
})(jQuery);