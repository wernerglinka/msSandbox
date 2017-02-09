/*global jQuery, body, window*/
/*eslint no-console: "allow"*/

(function ($) {

    'use strict';

    var MAX_SCREEN_WIDTH = 768;
    var TOP_MESSAGE_HEIGHT = 70;
    var TO_TOP_VISIBLE = 400;

    // to deal with touch and clicks we extend jQuery event >> touchclick
    var touchClick = {
        init: function () {
            var isMobile = false;

            if ($('html').hasClass('touch')) {
                isMobile = true;
            }

            //var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
            var eventType = isMobile ? "touchstart" : "click";

            $.event.special.touchclick = {
                bindType: eventType,
                delegateType: eventType
            };
        }
    };

    // function to make the main nav fixed to top on home page when page is scrolled up
    var scrollHomeNav = {
        config: {
            hasTopMessage : $('.top-message').length
        },
        init: function () {
            var hasTopMessage = this.config.hasTopMessage;
            if (hasTopMessage) {
                $(window).scroll(function(e){
                  var thisWindow = $(this);
                  var thisHeader = $('header');

                  if (thisWindow.scrollTop() >= TOP_MESSAGE_HEIGHT && !thisHeader.hasClass('isFixed')){
                    thisHeader.addClass('isFixed');
                  }
                  if ($(this).scrollTop() < TOP_MESSAGE_HEIGHT && thisHeader.hasClass('isFixed'))
                  {
                    thisHeader.removeClass('isFixed');
                  }
                });
            }
        }
    };

    // function for change nav background when banner is scrolled up
    var bannerBackground = {
        config: {
            bannerHeight: $('.banner').height(),
            hasBanner: $('.has-page-banner').length

        },
        init: function () {
            var bannerHeight = this.config.bannerHeight;
            var hasBanner = this.config.hasBanner;
            if (hasBanner) {
                $(window).scroll(function(e){
                    var thisWindow = $(this);
                    var thisHeader = $('header');

                    if (thisWindow.scrollTop() >= bannerHeight && !thisHeader.hasClass('noOpacity')) {
                        thisHeader.addClass('noOpacity')
                    }
                    if (thisWindow.scrollTop() < bannerHeight && thisHeader.hasClass('noOpacity')) {
                        thisHeader.removeClass('noOpacity')
                    }

                });
            }
        }
    };

    // the scroll to top function for long pages
    var scrollToTop = {
        config: {
            hasToTop: $('#toTop').length,
            toTop: $('#toTop')
        },
        init: function () {
            var hasToTop = this.config.hasToTop;
            var toTop = this.config.toTop;
            if (hasToTop) {
                toTop.on('touchclick', function () {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 500, 'easeOutCubic');
                    return false;
                });

                // hide scroll icon if content is at top already
                // normally we would check for $(window).scrollTop() but IE8 always return 0, what else is new
                if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                    $('#toTop').hide();
                }

                // update scroll icon if window is resized
                $(window).resize(function () {
                    if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                        $('#toTop').hide();
                    }
                });

                // manage scroll icon when scrolling
                $(window).scroll(function () {

                    // scrolling behavior
                    //
                    //          $(window).scrollTop()   $('html').scrollTop()
                    //  FF               value                  value
                    //  WK               value                    0
                    //  IE8                0                    value
                    //  IE9+             value                  value
                    //console.log($(window).scrollTop());
                    //console.log($('html').scrollTop());


                    if ($("body").scrollTop() < TO_TOP_VISIBLE && $("html").scrollTop() < TO_TOP_VISIBLE) {
                        $('#toTop').fadeOut(400);
                    } else {
                        $('#toTop').fadeIn(400);
                    }
                });
            }
        }
    };

    // function to provide hover behavior for main menu for wide screens
    var hoverMenu = {
        config: {
            linkContainer: $('.main-menu').find('.dropdown'),
            thisDocument: $(document)
        },
        init: function () {
            var linkContainer = this.config.linkContainer;
            var screenWidth = $(window).width();
            var thisDocument = this.config.thisDocument;
            var self = this;

            if (screenWidth >= MAX_SCREEN_WIDTH) {
                // open/close menu on hover
                linkContainer.hoverIntent(self._showMenu, self._hideMenu);
            }

            // open menu to stay open on click
            linkContainer.on('touchclick', function (event) {
                event.stopImmediatePropagation()
                var thisLinkContainer = $(this);
                var thisMenu = thisLinkContainer.find('.dropdown-menu');
                if (thisLinkContainer.hasClass('stayOpen')) {
                    thisMenu.slideUp();
                    thisLinkContainer.removeClass('stayOpen');
                } else {
                    linkContainer.removeClass('stayOpen');
                    thisMenu.slideDown();
                    thisLinkContainer.addClass('stayOpen');
                }
            });
            // close menu when user clicks in document
            thisDocument.on('touchclick', function () {
                linkContainer.each(function () {
                    var thisLinkContainer = $(this);
                    var thisMenu = thisLinkContainer.find('.dropdown-menu');
                    thisLinkContainer.removeClass('stay-open');
                    thisMenu.slideUp();
                });
            });

            $(window).resize(function () {
                if ($(window).width() >= MAX_SCREEN_WIDTH) {
                    linkContainer.hoverIntent(self._showMenu, self._hideMenu);
                }
            });

        },
        _showMenu: function () {
            if ($(window).width() >= MAX_SCREEN_WIDTH) {
                var thisLinkContainer = $(this);
                thisLinkContainer.siblings().each(function () {
                    var thisSibling = $(this);
                    thisSibling.removeClass('stay-open');
                    thisSibling.find('.dropdown-menu').slideUp();
                });
                thisLinkContainer.find('.dropdown-menu').slideDown();
            }
        },
        _hideMenu: function () {
            var thisLinkContainer = $(this)
            if (!thisLinkContainer.hasClass('stayOpen')) {
                thisLinkContainer.find('.dropdown-menu').slideUp();
            }
        }
    };

    // function to attach a class to the body element when the hamburger is touched/clicked
    var mobileMenu = {
        config: {
            thisPage: $('body'),
            hamburger: $('.hamburger'),
            topMessage: $('.top-message')
        },
        init: function () {
            var thisPage = this.config.thisPage;
            var hamburger = this.config.hamburger;
            var topMessage = this.config.topMessage;

            hamburger.on('click', function () {
                var thisMenuLayer = $('.mobile-navigation');
                var thisMenu = $('.main-menu');
                if (thisPage.hasClass('navActive')) {
                    if (topMessage) {
                        topMessage.slideDown();
                    }
                    thisPage.removeClass('navActive');
                    thisMenuLayer.fadeOut();
                } else {
                    if (topMessage) {
                        topMessage.slideUp();
                    }
                    thisMenuLayer.fadeIn();
                    thisPage.toggleClass('navActive');
                }
            });

            $(window).resize(function () {
                if ($(window).width() > MAX_SCREEN_WIDTH) {
                    thisPage.removeClass('navActive');
                    if (!topMessage.is(':visible')) {
                        topMessage.show();
                    }
                    $('.main-navigation').show();
                    $('.mobile-navigation').hide();
                } else {
                    $('.main-navigation').hide();
                }
            });
        }
    };

    // function to play youTube videos
    // allows videos to be inserted with minimal html
    // example: "<div class="youtube-video" data-video-tn="<path/to/img>" data-video-id="<youtube id>" data-additional-attributes="?enablejsapi=1&rel=0"></div>
    var youTubeVideos = {
        config: {
            allVideos: $('.youtube-video')

        },
        init: function () {
            var self = this;
            var allVideos = this.config.allVideos;
            var allPlayers = [];

            // add all videos to the DOM
            allVideos.each( function (i) {
                var thisVideo = $(this);
                var thisVideoIndex = i;
                // add the thumbnail
                var thisVideoTnHTML = self._getTnHTML(thisVideo.data('video-tn'));
                thisVideo.append(thisVideoTnHTML);
                // and the video
                var thisVideoHTML = self._getVideoHTML(thisVideo.data('video-id'), thisVideoIndex, thisVideo.data('additional-attributes'));
                thisVideo.append(thisVideoHTML);
            });

            // initialize all video players on a page
            $(window).on('videoAPIReady', function () {
                allVideos.each(function (i) {
                    allPlayers[i] = new YT.Player('player' + i, {
                        events: {
                            'onStateChange': function (event) {
                                if (event.data === YT.PlayerState.PAUSED) {
                                }
                                if (event.data == YT.PlayerState.PLAYING) {

                                }
                                if (event.data == YT.PlayerState.ENDED) {
                                    // get the player ID
                                    var currentPlayer = $('#' + event.target.a.id);
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
                    thisVideo.find('.video-tn').on('touchclick', function () {
                        var thisVideoTn = $(this);
                        thisVideoTn.fadeOut();
                        thisVideoTn.next().fadeIn();
                        allPlayers[i].playVideo();
                    });
                });
            });
        },
        _getTnHTML: function (videoTn) {
            var videoHTML = "<div class='video-tn'>";
            videoHTML += "<img src='" + videoTn + "' alt='' />";
            videoHTML +=  "</div>";
            return videoHTML;
        },
        _getVideoHTML: function (videoID, videoIndex, addAttr) {
            var videoHTML = "<div class='video-wrapper'>";
            var addAttributes = addAttr ? addAttr : "";
            videoHTML += "<iframe id='player" + videoIndex + "' src='https://www.youtube.com/embed/" + videoID + addAttributes + " frameborder='0'></iframe>";
            videoHTML += "</div>";
            return videoHTML;
        }
    };

    // function to add line numbers wrapper to syntax code lines
    // numbers are added via CSS counter
    var lineNumbers = {
        config: {
            codeContainers: $('pre.line-numbers')
        },
        init: function () {
            var codeContainers = this.config.codeContainers;
            var codeArray, i;

            codeContainers.each(function () {
                var thisCodeContainer = $(this);
                //insert a new line after open <code> tag
                thisCodeContainer.find('code').prepend('\n');

                // add a line wrapper to each code line
                codeArray = thisCodeContainer[0].outerHTML.split('\n');
                // start with the second array element and stop before the last so we don't wrap the <pre><code> tags
                for (i = 1; i < codeArray.length-1; i++) {
                    codeArray[i] = "<span class='code-line'>" + codeArray[i] + "</span>";
                }
                // replace code
                thisCodeContainer[0].outerHTML = codeArray.join('\n');
            });
        }
    };

    // function to add "target='_blank'" to all external links
    var externalLinks = {
        config: {
            allExternalLinks: $('a[href^="http://"], a[href^="https://"]')
        },
        init: function () {
            var allExternalLinks = this.config.allExternalLinks;
            allExternalLinks.each(function () {
                var thisExternalLink = $(this);
                thisExternalLink.attr('target', '_blank');
            });
        }
    };

    // function to modify and style according to design all Marketo forms
    var modifyMarketoForm = {
        init: function () {
            var self = this;
            // custom event 'mktoFormLoaded' is invoked when forms are all loaded
            $(document).on('mktoFormLoaded', function (event) {
                var allMarketoForms = $("[id*='mktoForm']");
                // remove all the Marketo css cruft
                self._removeMarketoCSS();
                allMarketoForms.each(function () {
                    var thisMarketoForm = $(this);
                    //thisMarketoForm.find('select').niceSelect();
                    thisMarketoForm.find(':checkbox').after("<i class='icon icon-checkmark'></i>");
                });
            });
        },
        _removeMarketoCSS: function (){
            // remove the external stylesheets
            var links = window.document.getElementsByTagName('link');
            $(links).each(function () {
                var thisLinkElement = $(this);
                var thisLinkURL = thisLinkElement.attr('href');
                if ( thisLinkURL.indexOf('marketo.com') > 1 ) {
                    thisLinkElement.remove();
                }
            });
            // and the inline styles
            var marketoForms = $("[id*='mktoForm']");
            marketoForms.each( function () {
                $(this).find('style').remove();
            });
        }
    }

    // on small screens exchange image for a small one
    var smallImage = {
        init: function () {
            var allImages = $('img');
            if($(window).width() < 500) {
                allImages.each(function () {
                    var thisImage = $(this);
                    if(thisImage.attr('data-small-image')) {
                        thisImage.data('large-image', thisImage.attr('src'));
                        thisImage.attr('src', thisImage.data('small-image'));
                    }
                });
            }

            $(window).on('resize', function () {
                var allImages = $('img');

                if($(window).width() < 600) {
                    allImages.each(function () {
                        var thisImage = $(this);
                        if(thisImage.attr('data-small-image') && !thisImage.data('isSmall')) {
                            thisImage.data('large-image', thisImage.attr('src'));
                            thisImage.attr('src', thisImage.data('small-image'));
                            thisImage.data('isSmall', true);
                        }
                    });
                } else {
                    allImages.each(function () {
                        var thisImage = $(this);
                        if(thisImage.attr('data-small-image') && thisImage.data('isSmall')) {
                            thisImage.attr('src', thisImage.data('large-image'));
                            thisImage.data('isSmall', false);
                        }
                    });
                }
            });
        }
    }



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

    });
    // end ready function

}(jQuery));