(function(globals) {
    'use strict';

    function ViewerCommunication (targetURL, integration = 'study') {
        let windowReference;
        const integrationType = integration === 'study' ? 'study' : 'token';
        const callbacks = {};
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
            window.addEventListener('message', this.onMessageReceived.bind(this));
        };

        functions.onMessageReceived = function ({data, origin}) {
            if (origin === targetURL) {
                this.performCallback(data.actionType, data.actionData);
            }
        };

        functions.performCallback = function (actionType, actionData) {
            if (actionType === 'COMMUNICATION_SERVICE_READY') {
                this.performOnCommunicationServiceReadyCallback();
            }
            if (actionType === 'GET_OPENED_STUDIES') {
                this.performOnGetOpenedStudiesCallback(actionData);
            }
            if (actionType === 'GET_SNAPSHOT') {
                this.performGetSnapshotCallback(actionData);
            }
            if (actionType === 'ANNOTATIONS_SAVED') {
                this.performOnAnnotationsSavedCallback(actionData);
            }
        };

        functions.performOnCommunicationServiceReadyCallback = function () {
            if (callbacks.onCommunicationServiceReadyCallback) {
                callbacks.onCommunicationServiceReadyCallback();
            }
        }

        functions.performOnGetOpenedStudiesCallback = function (actionData) {
            if (callbacks.onGetOpenedStudiesCallback) {
                callbacks.onGetOpenedStudiesCallback(actionData);
            }
        }

        functions.performGetSnapshotCallback = function (actionData) {
            if (callbacks.onGetSnapshotCallback) {
                callbacks.onGetSnapshotCallback(actionData);
            }
        }

        functions.performOnAnnotationsSavedCallback = function (actionData) {
            if (callbacks.onAnnotationsSavedCallback) {
                callbacks.onAnnotationsSavedCallback(actionData);
            }
        }

        functions.openInMedDreamWindow = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}`, '_blank');
        };

        functions.addToMedDreamWindow = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}&add=true`, '_blank');
        };

        functions.replaceInMedDreamWindow = function (value) {
            windowReference = window.open(`${targetURL}?${integrationType}=${value}&replace=true`, '_blank');
        };

        functions.openMedDreamToIframe = function (iframeId, value) {
            const iframe = document.getElementById(iframeId);
            iframe.src = `${targetURL}?${integrationType}=${value}`;
            windowReference = iframe.contentWindow;
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

            functions.cacheStudies = function (studies) {
                this.postActionMessage('CACHE_STUDIES', {studies});
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

            functions.cacheStudies = function (token) {
                this.postActionMessage('CACHE_STUDIES_WITH_TOKEN', {token});
            };

            functions.closeStudies = function (token) {
                this.postActionMessage('CLOSE_STUDIES_WITH_TOKEN', {token});
            };
        }

        functions.cacheAllStudies = function () {
            this.postActionMessage('CACHE_ALL_STUDIES');
        };

        functions.closeAllStudies = function () {
            this.postActionMessage('CLOSE_ALL_STUDIES');
        };

        functions.setLayout = function (columns, rows) {
            this.postActionMessage('SET_LAYOUT', {columns, rows});
        };

        functions.openInstance = function (instanceUid, viewportColumn, viewportRow, viewportActions) {
            this.postActionMessage('OPEN_INSTANCE', {instanceUid, viewportColumn, viewportRow, viewportActions});
        };

        functions.exportInstance = function (viewportColumn, viewportRow) {
            this.postActionMessage('EXPORT_INSTANCE', {viewportColumn, viewportRow});
        };

        functions.updateSegmentationToolPermissions = function (permissions) {
            this.postActionMessage('UPDATE_SEGMENTATION_TOOL_PERMISSIONS', {permissions});
        };

        functions.getOpenedStudies = function () {
            this.postActionMessage('GET_OPENED_STUDIES');
        };

        functions.getSnapshot = function () {
            this.postActionMessage('GET_SNAPSHOT');
        };

        functions.setSnapshot = function (snapshot) {
            this.postActionMessage('SET_SNAPSHOT', {snapshot});
        };

        functions.subscribeEvent = function (eventType) {
            this.postActionMessage('SUBSCRIBE_EVENT', {eventType});
        };

        functions.unsubscribeEvent = function (eventType) {
            this.postActionMessage('UNSUBSCRIBE_EVENT', {eventType});
        };

        functions.subscribeCommunicationServiceReadyEvent = function (callback) {
            callbacks.onCommunicationServiceReadyCallback = callback;
        }

        functions.unsubscribeCommunicationServiceReadyEvent = function () {
            callbacks.onCommunicationServiceReadyCallback = undefined;
        }

        functions.subscribeGetOpenedStudiesEvent = function (callback) {
            callbacks.onGetOpenedStudiesCallback = callback;
        };

        functions.unsubscribeGetOpenedStudiesEvent = function () {
            callbacks.onGetOpenedStudiesCallback = undefined;
        }

        functions.subscribeGetSnapshotEvent = function (callback) {
            callbacks.onGetSnapshotCallback = callback;
        };

        functions.unsubscribeGetSnapshotEvent = function () {
            callbacks.onGetSnapshotCallback = undefined;
        }

        functions.subscribeAnnotationsSavedEvent = function (callback) {
            callbacks.onAnnotationsSavedCallback = callback;
            this.subscribeEvent('ANNOTATIONS_SAVED');
        };

        functions.unsubscribeAnnotationsSavedEvent = function () {
            callbacks.onAnnotationsSavedCallback = undefined;
            this.unsubscribeEvent('ANNOTATIONS_SAVED');
        };

        functions.registerMessageReceivedEvent();

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
