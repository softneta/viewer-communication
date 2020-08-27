(function(globals) {
    'use strict';

    function ViewerCommunication (url) {
        const targetURL = url;
        const functions = {};

        functions.test = function () {
            console.log(targetURL);
        };

        return functions;
    }

    if (typeof define !== 'undefined' && define.amd) {
        define([], function() {                             // RequireJS
            return ViewerCommunication;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = ViewerCommunication;               // CommonJS
    } else {
        globals.ViewerCommunication = ViewerCommunication;  // <script>
    }
})(this);