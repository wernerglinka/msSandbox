/*eslint no-unused-vars: 0*/

// function to attach a class to the body element when the hamburger is touched/clicked
var mobileMenu = (function () {
    "use strict";
    let thisPage = $("body");
    let hamburger = $(".hamburger");
    let topMessage = $(".top-message");

    let init = function (MAX_SCREEN_WIDTH) {
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
            if ($(window).width() > MAX_SCREEN_WIDTH) {
                thisPage.removeClass("navActive");
                if (!topMessage.is(":visible")) {
                    topMessage.show();
                }
                $(".main-navigation").show();
                $(".mobile-navigation").hide();
            } else {
                $(".main-navigation").hide();
            }
        });
    };

    return {
        init: init
    };
})();