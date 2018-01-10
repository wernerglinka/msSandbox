/*eslint no-unused-vars: 0*/

// function to make the main nav fixed to top on home page when page is scrolled up
var scrollHomeNav = (function ($, undefined) {
    "use strict";
    let hasTopMessage = $(".top-message").length;
    let TopMessageHeight = $(".top-message").height();
    let thisHeader = $("header");

    let init = function () {
        if (hasTopMessage) {
            $(window).scroll(function(){
                let thisWindow = $(this);
                if (thisWindow.scrollTop() >= TopMessageHeight && !thisHeader.hasClass("isFixed")){
                    thisHeader.addClass("isFixed");
                }
                if ($(this).scrollTop() < TopMessageHeight && thisHeader.hasClass("isFixed")) {
                    thisHeader.removeClass("isFixed");
                }
            });
        }
    };

    return {
        init: init
    };
})(jQuery);