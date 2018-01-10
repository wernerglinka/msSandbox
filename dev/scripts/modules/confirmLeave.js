/*eslint no-unused-vars: 0*/

// function to extend jQuery event >> touchclick for touch and click
var confirmLeave = (function ($, undefined) {
    "use strict";
    let init = function () {
        if ($("body").hasClass("confirm-leave")) {

            $("#test").hide();

            let letGo = false;

            var onbeforeunload = function(e) {

                $("#test").show();

                var dialogText = "Dialog text here";
                e.returnValue = dialogText;
                return dialogText;
            };

            window.addEventListener("beforeunload", onbeforeunload);

        }
    };

    return  {
        init: init
    };
})(jQuery);