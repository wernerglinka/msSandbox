/*eslint no-unused-vars: 0*/

// on small screens exchange image for a small one
var smallImage = (function ($, undefined) {
    "use strict";
    const USE_SMALL_IMAGE = 600;

    let init = function () {
        var allImages = $("img");
        if($(window).width() < USE_SMALL_IMAGE) {
            allImages.each(function () {
                var thisImage = $(this);
                if(thisImage.attr("data-small-image")) {
                    thisImage.data("large-image", thisImage.attr("src"));
                    thisImage.attr("src", thisImage.data("small-image"));
                }
            });
        }

        $(window).on("resize", function () {
            let allImages = $("img");
            if($(window).width() < USE_SMALL_IMAGE) {
                allImages.each(function () {
                    let thisImage = $(this);
                    if(thisImage.attr("data-small-image") && !thisImage.data("isSmall")) {
                        thisImage.data("large-image", thisImage.attr("src"));
                        thisImage.attr("src", thisImage.data("small-image"));
                        thisImage.data("isSmall", true);
                    }
                });
            } else {
                allImages.each(function () {
                    let thisImage = $(this);
                    if(thisImage.attr("data-small-image") && thisImage.data("isSmall")) {
                        thisImage.attr("src", thisImage.data("large-image"));
                        thisImage.data("isSmall", false);
                    }
                });
            }
        });
    };

    return {
        init: init
    };
})(jQuery);
