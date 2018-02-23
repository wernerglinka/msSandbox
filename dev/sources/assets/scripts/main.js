"use strict";

/*jslint browser: true*/
/*global jQuery, undefined, window */

// function for change nav background opacity when banner is scrolled up
var bannerBackground = function ($, undefined) {
    "use strict";

    var bannerHeight = $(".banner").height(),
        hasBanner = $(".has-page-banner").length,
        init = function init() {
        if (hasBanner) {
            $(window).scroll(function () {
                var thisWindow = $(this),
                    thisHeader = $("header");
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
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to extend jQuery event >> touchclick for touch and click
var confirmLeave = function ($, undefined) {
    "use strict";

    var init = function init() {
        if ($("body").hasClass("confirm-leave")) {

            $("#test").hide();

            var letGo = false;

            var onbeforeunload = function onbeforeunload(e) {

                $("#test").show();

                var dialogText = "Dialog text here";
                e.returnValue = dialogText;
                return dialogText;
            };

            window.addEventListener("beforeunload", onbeforeunload);
        }
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to add "target='_blank'" to all external links
var externalLinks = function ($, undefined) {
    "use strict";

    var allExternalLinks = $('a[href^="http://"], a[href^="https://"]');
    var init = function init() {
        allExternalLinks.each(function () {
            var thisExternalLink = $(this);
            thisExternalLink.attr("target", "_blank");
        });
    };
    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to provide hover behavior for main menu for wide screens
var hoverMenu = function ($, undefined) {
    "use strict";

    var linkContainer = $(".main-menu").find(".dropdown");
    var thisDocument = $(document);
    var MAX_SCREEN_WIDTH = 768;

    var _showMenu = function _showMenu() {
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

    var _hideMenu = function _hideMenu() {
        var thisLinkContainer = $(this);
        if (!thisLinkContainer.hasClass("stayOpen")) {
            thisLinkContainer.find(".dropdown-menu").slideUp();
        }
    };

    var init = function init() {
        var screenWidth = $(window).width();
        if (screenWidth >= MAX_SCREEN_WIDTH) {
            // open/close menu on hover
            linkContainer.hoverIntent(_showMenu, _hideMenu);
        }

        // open menu to stay open on click
        linkContainer.on("touchclick", function (event) {
            event.stopImmediatePropagation();
            var thisLinkContainer = $(this);
            var thisMenu = thisLinkContainer.find(".dropdown-menu");
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
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to add line numbers wrapper to syntax code lines
// numbers are added via CSS counter
var lineNumbers = function ($, undefined) {
    "use strict";

    var codeContainers = $("pre.line-numbers");
    var init = function init() {
        var codeArray = void 0;
        codeContainers.each(function () {
            var thisCodeContainer = $(this);
            //insert a new line after open <code> tag
            thisCodeContainer.find("code").prepend("\n");
            // add a line wrapper to each code line
            codeArray = thisCodeContainer[0].outerHTML.split("\n");
            // start with the second array element and stop before the last so we don't wrap the <pre><code> tags
            for (var i = 1; i < codeArray.length - 1; i++) {
                codeArray[i] = "<span class='code-line'>" + codeArray[i] + "</span>";
            }
            // replace code
            thisCodeContainer[0].outerHTML = codeArray.join("\n");
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to attach a class to the body element when the hamburger is touched/clicked
var mobileMenu = function ($, undefined) {
    "use strict";

    var init = function init() {

        var thisPage = $("body");
        var hamburger = $(".hamburger");
        var topMessage = $(".top-message");

        var mobileScreenWidth = 768;

        hamburger.on("click", function () {
            var thisMenuLayer = $(".mobile-navigation");
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
}(jQuery);
"use strict";

/* global YT*/
/*eslint no-unused-vars: 0*/

var modalVideos = function ($, undefined) {
    "use strict";

    var init = function init() {
        var modalVideoTriggers = $(".modal-video");

        if (!$("body").hasClass("hasVideo")) return;
        var overlay = $('<div id="overlay"><i class="icon icon-close"></i><div class="responsive-wrapper"><div class="video-container"></div></div></div>');
        var allPlayers = [];

        // append the overlay html
        $("body").append(overlay);
        // attach click handler to each video link
        modalVideoTriggers.each(function (i) {
            var thisVideoTrigger = $(this);
            var videoIndex = i;

            thisVideoTrigger.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                // fade in overlay
                $("#overlay").fadeIn();
                var thisVideo = $(this);
                var videoID = thisVideo.data("video-id");
                var videoAttr = thisVideo.data("video-attr");
                var videoHTML = "<iframe id='playerModal" + videoIndex + "' src='https://www.youtube.com/embed/" + videoID + "?enablejsapi=1&rel=0&autoplay=1" + (videoAttr ? "&" + videoAttr : "") + "' frameborder='0'></iframe>";
                $(".video-container").append(videoHTML);
            });
        });

        // on click on close icon close overlay
        $("#overlay").find(".icon-close").on("click", function () {
            var thisOverlay = $(this).parent();
            // remove the current video
            thisOverlay.find(".video-container").empty();
            // and fadeout the overlay
            thisOverlay.fadeOut();
        });

        // initialize all video players on a page
        $(window).on("videoAPIReady", function () {
            modalVideoTriggers.each(function (i) {
                allPlayers[i] = new YT.Player("playerModal" + i, {
                    events: {
                        onStateChange: function onStateChange(event) {
                            //if (event.data === YT.PlayerState.PAUSED) {
                            //}
                            //if (event.data === YT.PlayerState.PLAYING) {
                            //}
                            if (event.data === YT.PlayerState.ENDED) {
                                // get the player ID
                                var currentPlayer = $("#" + event.target.a.id);
                                var videoTn = currentPlayer.parent().prev();
                                currentPlayer.parent().fadeOut();
                                videoTn.fadeIn();
                            }
                        }
                    }
                });
            });

            modalVideoTriggers.each(function (i) {
                var thisVideo = $(this);
                thisVideo.find(".video-tn").on("touchclick", function () {
                    allPlayers[i].playVideo();
                });
            });
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to modify and style according to design all Marketo forms
var modifyMarketoForm = function ($, undefined) {
    "use strict";

    var _removeMarketoCSS = function _removeMarketoCSS() {
        // remove the external stylesheets
        var links = window.document.getElementsByTagName("link");
        $(links).each(function () {
            var thisLinkElement = $(this);
            var thisLinkURL = thisLinkElement.attr("href");
            if (thisLinkURL.indexOf("marketo.com") > 1) {
                thisLinkElement.remove();
            }
        });
        // and the inline styles
        var marketoForms = $("[id*='mktoForm']");
        marketoForms.each(function () {
            $(this).find("style").remove();
        });
        // if needed we can also strip all style attributes from all form elements
        marketoForms.each(function () {
            var thisForm = this;
            if (thisForm.hasAttribute("style")) {
                thisForm.removeAttribute("style");
            }
        });
        marketoForms.find("*").each(function () {
            var thisElement = this;
            if (thisElement.hasAttribute("style")) {
                thisElement.removeAttribute("style");
            }
        });
    };

    var init = function init() {
        // custom event 'mktoFormLoaded' is invoked when forms are all loaded
        $(document).on("mktoFormLoaded", function () {
            var allMarketoForms = $("[id*='mktoForm']");
            // remove all the Marketo css cruft
            _removeMarketoCSS();
            allMarketoForms.each(function () {
                var thisMarketoForm = $(this);
                //thisMarketoForm.find('select').niceSelect();
                thisMarketoForm.find(":checkbox").after("<i class='icon icon-checkmark'></i>");
            });
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to make the main nav fixed to top on home page when page is scrolled up
var scrollHomeNav = function ($, undefined) {
    "use strict";

    var hasTopMessage = $(".top-message").length;
    var TopMessageHeight = $(".top-message").height();
    var thisHeader = $("header");

    var init = function init() {
        if (hasTopMessage) {
            $(window).scroll(function () {
                var thisWindow = $(this);
                if (thisWindow.scrollTop() >= TopMessageHeight && !thisHeader.hasClass("isFixed")) {
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
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// the scroll to top function for long pages
var scrollToTop = function ($, undefined) {
    var hasToTop = $("#toTop").length;
    var toTop = $("#toTop");
    var TO_TOP_VISIBLE = 400;

    var init = function init() {
        if (hasToTop) {
            toTop.on("touchclick", function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 500, "easeOutCubic");
                return false;
            });
            // hide scroll icon if content is at top already
            // normally we would check for $(window).scrollTop() but IE8 always return 0, what else is new
            if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                $("#toTop").hide();
            }
            // update scroll icon if window is resized
            $(window).resize(function () {
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $("#toTop").hide();
                }
            });
            // manage scroll icon when scrolling
            $(window).scroll(function () {
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $("#toTop").fadeOut(400);
                } else {
                    $("#toTop").fadeIn(400);
                }
            });
        }
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// on small screens exchange image for a small one
var smallImage = function ($, undefined) {
    "use strict";

    var USE_SMALL_IMAGE = 600;

    var init = function init() {
        var allImages = $("img");
        if ($(window).width() < USE_SMALL_IMAGE) {
            allImages.each(function () {
                var thisImage = $(this);
                if (thisImage.attr("data-small-image")) {
                    thisImage.data("large-image", thisImage.attr("src"));
                    thisImage.attr("src", thisImage.data("small-image"));
                }
            });
        }

        $(window).on("resize", function () {
            var allImages = $("img");
            if ($(window).width() < USE_SMALL_IMAGE) {
                allImages.each(function () {
                    var thisImage = $(this);
                    if (thisImage.attr("data-small-image") && !thisImage.data("isSmall")) {
                        thisImage.data("large-image", thisImage.attr("src"));
                        thisImage.attr("src", thisImage.data("small-image"));
                        thisImage.data("isSmall", true);
                    }
                });
            } else {
                allImages.each(function () {
                    var thisImage = $(this);
                    if (thisImage.attr("data-small-image") && thisImage.data("isSmall")) {
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
}(jQuery);
"use strict";

/*eslint no-unused-vars: 0*/

// function to extend jQuery event >> touchclick for touch and click
var touchClick = function ($, undefined) {
    "use strict";

    var init = function init() {
        var isMobile = false;
        if ($("html").hasClass("touch")) {
            isMobile = true;
        }
        //var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        var eventType = isMobile ? "touchstart" : "click";

        $.event.special.touchclick = {
            bindType: eventType,
            delegateType: eventType
        };
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/* global YT */
/*eslint no-unused-vars: 0*/

// function to play youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-additional-attributes="?enablejsapi=1&rel=0"></div>
var youTubeVideos = function ($, undefined) {
    "use strict";

    var allVideos = $(".youtube-video");

    var _getTnHTML = function _getTnHTML(videoTn) {
        var videoHTML = "<div class='video-tn'>";
        videoHTML += "<img src='" + videoTn + "' alt='' />";
        videoHTML += "</div>";
        return videoHTML;
    };

    var _getVideoHTML = function _getVideoHTML(videoID, videoIndex, addAttr) {
        var videoHTML = "<div class='video-wrapper'>";
        var addAttributes = addAttr ? addAttr : "";
        videoHTML += "<iframe id='player" + videoIndex + "' src='https://www.youtube.com/embed/" + videoID + addAttributes + " frameborder='0'></iframe>";
        videoHTML += "</div>";
        return videoHTML;
    };

    var init = function init() {
        var allPlayers = [];

        // add all videos to the DOM
        allVideos.each(function (i) {
            var thisVideo = $(this);
            var thisVideoIndex = i;
            // add the thumbnail
            var thisVideoTnHTML = _getTnHTML(thisVideo.data("video-tn"));
            thisVideo.append(thisVideoTnHTML);
            // and the video
            var thisVideoHTML = _getVideoHTML(thisVideo.data("video-id"), thisVideoIndex, thisVideo.data("additional-attributes"));
            thisVideo.append(thisVideoHTML);
        });

        // initialize all video players on a page
        // videoAPIReady is a custom event triggered when the Youtube API has been loaded
        $(window).on("videoAPIReady", function () {
            allVideos.each(function (i) {
                allPlayers[i] = new YT.Player("player" + i, {
                    events: {
                        "onStateChange": function onStateChange(event) {
                            //if (event.data === YT.PlayerState.PAUSED) {}
                            //if (event.data == YT.PlayerState.PLAYING) {}
                            if (event.data == YT.PlayerState.ENDED) {
                                // get the player ID
                                var currentPlayer = $("#" + event.target.a.id);
                                var videoTn = currentPlayer.parent().prev();
                                currentPlayer.parent().fadeOut();
                                videoTn.fadeIn();
                            }
                        }
                    }
                });
            });

            // initially the video thumbnail is visible. on click fadeout the tn, show and play the video]
            allVideos.each(function (i) {
                var thisVideo = $(this);
                thisVideo.find(".video-tn").on("touchclick", function () {
                    var thisVideoTn = $(this);
                    thisVideoTn.fadeOut();
                    thisVideoTn.next().fadeIn();
                    allPlayers[i].playVideo();
                });
            });
        });
    };

    return {
        init: init
    };
}(jQuery);
"use strict";

/*jslint browser: true*/
/*global Event, jQuery, document, window, touchClick, hoverMenu, mobileMenu, youTubeVideos, lineNumbers, externalLinks, modifyMarketoForm, scrollHomeNav, smallImage, bannerBackground, scrollToTop, confirmLeave, modalVideos*/

// custom event for api loaded
var videoAPIReady = new Event("videoAPIReady");

// load the youTube video JS api
// https://developers.google.com/youtube/iframe_api_reference
// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    'use strict';

    window.dispatchEvent(videoAPIReady);
}

(function ($) {
    'use strict';

    $(function () {

        touchClick.init();
        hoverMenu.init();
        mobileMenu.init();
        youTubeVideos.init();
        lineNumbers.init();
        externalLinks.init();
        modifyMarketoForm.init();
        scrollHomeNav.init();
        smallImage.init();
        bannerBackground.init();
        scrollToTop.init();
        confirmLeave.init();
        modalVideos.init();
    });
    // end ready function
})(jQuery);
//# sourceMappingURL=main.js.map
