(function(globals) {
    'use strict';

    function ViewerCommunication (targetURL, integration = 'study') {
        let windowReference;
        let messageReceivedEvent;
        let onGetOpenedStudiesCallback;
        const integrationType = integration === 'study' ? 'study' : 'token';
        const functions = {};

        functions.getWindowReference = function () {
            if (!windowReference || windowReference && windowReference.closed) {
                windowReference = window.open('', 'MedDreamViewer');
            }
            return windowReference;
        };

        functions.focusWindow = function () {
            const reference = this.getWindowReference();
            if (reference) {
                reference.focus();
            }
        };

        functions.postActionMessage = function (actionType, actionData) {
            const reference = this.getWindowReference();
            if (reference) {
                reference.postMessage({actionType, actionData}, targetURL);
            }
        };

        functions.registerMessageReceivedEvent = function () {
            if (!messageReceivedEvent) {
                messageReceivedEvent = window.addEventListener('message', this.onMessageReceived.bind(this));
            }
        };

        functions.onMessageReceived = function ({data, origin}) {
            if (origin === targetURL) {
                this.performCallback(data.actionType, data.actionData);
            }
        };

        functions.performCallback = function (actionType, actionData) {
            if (actionType === 'GET_OPENED_STUDIES' && onGetOpenedStudiesCallback) {
                onGetOpenedStudiesCallback(actionData.studies);
            }
        };

        functions.onGetOpenedStudies = function (callback) {
            this.registerMessageReceivedEvent();
            onGetOpenedStudiesCallback = callback;
        };

        functions.openInMedDream = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}`, '_blank');
        };

        functions.addToMedDream = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}&add=true`, '_blank');
        };

        functions.replaceInMedDream = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}&replace=true`, '_blank');
        };

        if (integrationType === 'study') {
            functions.openStudy = function (study) {
                this.postActionMessage('OPEN_STUDY', {study});
            };

            functions.openStudies = function (studies) {
                this.postActionMessage('OPEN_STUDIES', {studies});
            };

            functions.replaceStudies = function (studies) {
                this.postActionMessage('REPLACE_STUDIES', {studies});
            };

            functions.preloadStudies = function (studies) {
                this.postActionMessage('PRELOAD_STUDIES', {studies});
            };

            functions.closeStudies = function (studies) {
                this.postActionMessage('CLOSE_STUDIES', {studies});
            };
        } else {
            functions.openStudies = function (token) {
                this.postActionMessage('OPEN_STUDIES_WITH_TOKEN', {token});
            };

            functions.replaceStudies = function (token) {
                this.postActionMessage('REPLACE_STUDIES_WITH_TOKEN', {token});
            };

            functions.preloadStudies = function (token) {
                this.postActionMessage('PRELOAD_STUDIES_WITH_TOKEN', {token});
            };

            functions.closeStudies = function (token) {
                this.postActionMessage('CLOSE_STUDIES_WITH_TOKEN', {token});
            };
        }

        functions.preloadAllStudies = function () {
            this.postActionMessage('PRELOAD_ALL_STUDIES');
        };

        functions.closeAllStudies = function () {
            this.postActionMessage('CLOSE_ALL_STUDIES');
        };

        functions.setLayout = function (columns, rows) {
            this.postActionMessage('SET_LAYOUT', {columns, rows});
        };

        functions.exportActiveInstance = function () {
            this.postActionMessage('EXPORT_ACTIVE_INSTANCE');
        };

        functions.openInstance = function (instanceUid, viewportColumn, viewportRow, viewportActions) {
            this.postActionMessage('OPEN_INSTANCE', {instanceUid, viewportColumn, viewportRow, viewportActions});
        };

        functions.getOpenedStudies = function () {
            this.postActionMessage('GET_OPENED_STUDIES');
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