/*eslint no-unused-vars: 0*/

// function to modify and style according to design all Marketo forms
var modifyMarketoForm = (function ($, undefined) {
    "use strict";
    let _removeMarketoCSS = function () {
        // remove the external stylesheets
        let links = window.document.getElementsByTagName("link");
        $(links).each(function () {
            let thisLinkElement = $(this);
            let thisLinkURL = thisLinkElement.attr("href");
            if ( thisLinkURL.indexOf("marketo.com") > 1 ) {
                thisLinkElement.remove();
            }
        });
        // and the inline styles
        let marketoForms = $("[id*='mktoForm']");
        marketoForms.each( function () {
            $(this).find("style").remove();
        });
        // if needed we can also strip all style attributes from all form elements
        marketoForms.each(function () {
            var thisForm = this;
            if ( thisForm.hasAttribute("style") ) {
                thisForm.removeAttribute("style");
            }
        });
        marketoForms.find("*").each( function () {
            var thisElement = this;
            if ( thisElement.hasAttribute("style") ) {
                thisElement.removeAttribute("style");
            }
        });
    };

    let init = function () {
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
})(jQuery);