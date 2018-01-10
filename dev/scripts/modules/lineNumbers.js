/*eslint no-unused-vars: 0*/

// function to add line numbers wrapper to syntax code lines
// numbers are added via CSS counter
var lineNumbers = (function ($, undefined) {
    "use strict";
    let codeContainers = $("pre.line-numbers");
    let init = function () {
        let codeArray;
        codeContainers.each(function () {
            let thisCodeContainer = $(this);
            //insert a new line after open <code> tag
            thisCodeContainer.find("code").prepend("\n");
            // add a line wrapper to each code line
            codeArray = thisCodeContainer[0].outerHTML.split("\n");
            // start with the second array element and stop before the last so we don't wrap the <pre><code> tags
            for (let i = 1; i < codeArray.length-1; i++) {
                codeArray[i] = "<span class='code-line'>" + codeArray[i] + "</span>";
            }
            // replace code
            thisCodeContainer[0].outerHTML = codeArray.join("\n");
        });
    };

    return {
        init: init
    };
})(jQuery);