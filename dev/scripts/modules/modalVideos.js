/* global YT*/
/*eslint no-unused-vars: 0*/

var modalVideos = (function ($, undefined) {
    "use strict";

    let init = function () {

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
                var videoHTML = "<iframe id='playerModal" + videoIndex + "' src='https://www.youtube.com/embed/" + videoID + "?enablejsapi=1&rel=0&autoplay=1" + (videoAttr ? "&" + videoAttr : "")  + "' frameborder='0'></iframe>";
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
                        "onStateChange": function (event) {
                            if (event.data === YT.PlayerState.PAUSED) {
                            }
                            if (event.data == YT.PlayerState.PLAYING) {

                            }
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
}) (jQuery);