"use strict";

/*eslint no-unused-vars: 0*/

// function for change nav background opacaity when banner is scrolled up
var bannerBackground = function () {
    "use strict";

    var bannerHeight = $(".banner").height();
    var hasBanner = $(".has-page-banner").length;
    var init = function init() {
        if (hasBanner) {
            $(window).scroll(function () {
                var thisWindow = $(this);
                var thisHeader = $("header");
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// function to extend jQuery event >> touchclick for touch and click
var confirmLeave = function () {
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// function to add "target='_blank'" to all external links
var externalLinks = function () {
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// function to provide hover behavior for main menu for wide screens
var hoverMenu = function () {
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// function to add line numbers wrapper to syntax code lines
// numbers are added via CSS counter
var lineNumbers = function () {
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// function to attach a class to the body element when the hamburger is touched/clicked
var mobileMenu = function () {
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
}();
"use strict";

/* global YT*/
/*eslint no-unused-vars: 0*/

var modalVideos = function () {
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
                        "onStateChange": function onStateChange(event) {
                            if (event.data === YT.PlayerState.PAUSED) {}
                            if (event.data == YT.PlayerState.PLAYING) {}
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// function to modify and style according to design all Marketo forms
var modifyMarketoForm = function () {
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
}();
"use strict";

/* eslint-disable */

var cvs = document.createElement('canvas'),
    context = cvs.getContext("2d");
document.body.appendChild(cvs);

var numDots = 210,
    n = numDots,
    currDot,
    maxRad = 300,
    minRad = 100,
    radDiff = maxRad - minRad,
    dots = [],
    pairs = [];
PI = Math.PI, centerPt = { x: 0, y: 0 };

resizeHandler();
window.onresize = resizeHandler;

// create dots
n = numDots;
while (n--) {
  currDot = {};
  currDot.x = currDot.y = 0;
  currDot.radius = minRad + Math.random() * radDiff;
  currDot.radiusV = 10 + Math.random() * 50, currDot.radiusVS = (1 - Math.random() * 2) * 0.015, currDot.radiusVP = Math.random() * PI, currDot.ang = (1 - Math.random() * 2) * PI;
  currDot.speed = 1 - Math.random() * 2;
  //currDot.speed = 1-Math.round(Math.random())*2;
  //currDot.speed = 1;
  currDot.intensity = Math.round(Math.random() * 255);
  currDot.fillColor = "rgb(" + currDot.intensity + "," + currDot.intensity + "," + currDot.intensity + ")";
  dots.push(currDot);
}

//create all pairs

n = numDots;
while (n--) {
  ni = n;
  while (ni--) {
    pairs.push([n, ni]);
  }
}

function drawPoints() {
  n = numDots;
  var _centerPt = centerPt,
      _context = context,
      dX = 0,
      dY = 0;

  _context.clearRect(0, 0, cvs.width, cvs.height);

  var radDiff;
  //move dots
  n = numDots;
  while (n--) {
    currDot = dots[n];
    currDot.radiusVP += currDot.radiusVS;
    radDiff = currDot.radius + Math.sin(currDot.radiusVP) * currDot.radiusV;
    currDot.x = _centerPt.x + Math.sin(currDot.ang) * radDiff;
    currDot.y = _centerPt.y + Math.cos(currDot.ang) * radDiff;

    //currDot.ang += currDot.speed;
    currDot.ang += currDot.speed * radDiff / 20000;
  }

  var pair,
      dot0,
      dot1,
      dist,
      bright,
      maxDist = Math.pow(100, 2);
  //draw lines
  n = pairs.length;
  while (n--) {
    pair = pairs[n];
    dot0 = dots[pair[0]];
    dot1 = dots[pair[1]];
    dist = Math.pow(dot1.x - dot0.x, 2) + Math.pow(dot1.y - dot0.y, 2);
    if (dist < maxDist) {
      bright = Math.round(50 * (maxDist - dist) / maxDist);
      _context.beginPath();
      _context.moveTo(dot0.x, dot0.y);
      _context.lineTo(dot1.x, dot1.y);
      _context.lineWidth = 1;
      _context.strokeStyle = "rgb(" + bright + "," + bright + "," + bright + ")";
      _context.stroke();
    }
  }

  //draw dots
  n = numDots;
  while (n--) {
    //console.log(currDot);
    _context.fillStyle = dots[n].fillColor;
    _context.fillRect(dots[n].x, dots[n].y, 1, 1);
  }
  window.requestAnimationFrame(drawPoints);
}

function resizeHandler() {
  var box = cvs.getBoundingClientRect();
  var w = box.width;
  var h = box.height;
  cvs.width = w;
  cvs.height = h;
  centerPt.x = Math.round(w / 2);
  centerPt.y = Math.round(h / 2);
}

drawPoints();
"use strict";

/*eslint no-unused-vars: 0*/

// function to make the main nav fixed to top on home page when page is scrolled up
var scrollHomeNav = function () {
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// the scroll to top function for long pages
var scrollToTop = function () {
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// on small screens exchange image for a small one
var smallImage = function () {
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
}();
"use strict";

/*eslint no-unused-vars: 0*/

// function to extend jQuery event >> touchclick for touch and click
var touchClick = function () {
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
}();
"use strict";

/* global YT */
/*eslint no-unused-vars: 0*/

// function to play youTube videos
// allows videos to be inserted with minimal html
// example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-additional-attributes="?enablejsapi=1&rel=0"></div>
var youTubeVideos = function () {
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
}();
"use strict";

/* global jQuery, window, touchClick, hoverMenu, mobileMenu, youTubeVideos, lineNumbers, externalLinks,
   modifyMarketoForm, scrollHomeNav, smallImage, bannerBackground, scrollToTop, confirmLeave, modalVideos, OP_MESSAGE_HEIGHT */
/*eslint no-unused-vars: 0*/

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
    window.dispatchEvent(videoAPIReady);
}

(function () {
    //the document ready function
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
})();
//# sourceMappingURL=main.js.map
