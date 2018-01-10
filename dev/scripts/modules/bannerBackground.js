/*eslint no-unused-vars: 0*/

// function for change nav background opacity when banner is scrolled up
var bannerBackground = (function ($, undefined) {
    "use strict";
    let bannerHeight = $(".banner").height();
    let hasBanner = $(".has-page-banner").length;
    let init =  function () {
        if (hasBanner) {
            $(window).scroll(function(){
                let thisWindow = $(this);
                let thisHeader = $("header");
                if (thisWindow.scrollTop() >= bannerHeight && !thisHeader.hasClass("noOpacity")) {
                    thisHeader.addClass("noOpacity");
                }
                if (thisWindow.scrollTop() < bannerHeight && thisHeader.hasClass("noOpacity")) {
                    thisHeader.removeClass("noOpacity");
                }
            });
        }
    };
    return {
        init: init
    };
})(jQuery);