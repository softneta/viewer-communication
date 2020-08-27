(function(globals) {
    'use strict';

    function ViewerCommunication (targetURL, integration = 'study') {
        let windowReference;
        const integrationType = integration === 'study' ? 'study' : 'token';
        const functions = {};

        functions.getWindowReference = function () {
            if (!windowReference || windowReference && windowReference.closed) {
                windowReference = window.open('', 'MedDreamViewer');
            }
            return windowReference;
        };

        functions.postActionMessage = function (actionType, actionData) {
            const reference = this.getWindowReference();
            if (reference) {
                reference.postMessage({actionType, actionData}, targetURL);
            }
        };

        functions.openInMedDream = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}`, "_blank");
        };

        functions.addToMedDream = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}&add=true`, "_blank");
        };

        functions.replaceInMedDream = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}&replace=true`, "_blank");
        };

        /*if (integration === 'study') {

        } else {

        }*/

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