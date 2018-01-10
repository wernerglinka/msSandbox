/*eslint no-unused-vars: 0*/

// function to attach a class to the body element when the hamburger is touched/clicked
var mobileMenu = (function ($, undefined) {
    "use strict";

    let init = function () {

        let thisPage = $("body");
        let hamburger = $(".hamburger");
        let topMessage = $(".top-message");

        var mobileScreenWidth = 768;

        hamburger.on("click", function () {
            let thisMenuLayer = $(".mobile-navigation");
            if (thisPage.hasClass("navActive")) {
                if (topMessage) {
                    topMessage.slideDown();
                }
                thisPage.removeClass("navActive");
                thisMenuLayer.fadeOut();
            } else {
                if (topMessage) {
                    topMessage.slideUp();
                }
                thisMenuLayer.fadeIn();
                thisPage.toggleClass("navActive");
            }
        });

        $(window).resize(function () {
            if ($(window).width() > mobileScreenWidth) {
                thisPage.removeClass("navActive");
            }
        });
    };

    return {
        init: init
    };
})(jQuery);