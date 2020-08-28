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

        if (integrationType === 'study') {
            functions.openStudy = function (study) {
                this.postActionMessage("OPEN_STUDY", {study});
            };

            functions.openStudies = function (studies) {
                this.postActionMessage("OPEN_STUDIES", {studies});
            };

            functions.replaceStudies = function (studies) {
                this.postActionMessage("REPLACE_STUDIES", {studies});
            };

            functions.preloadStudies = function (studies) {
                this.postActionMessage("PRELOAD_STUDIES", {studies});
            };
        } else {
            functions.openStudies = function (token) {
                this.postActionMessage("OPEN_STUDIES_WITH_TOKEN", {token});
            };

            functions.replaceStudies = function (token) {
                this.postActionMessage("REPLACE_STUDIES_WITH_TOKEN", {token});
            };

            functions.preloadStudies = function (token) {
                this.postActionMessage("PRELOAD_STUDIES_WITH_TOKEN", {token});
            };
        }

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