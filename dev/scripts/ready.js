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
}(jQuery));


