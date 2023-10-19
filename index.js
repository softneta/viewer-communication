(function(globals) {
    'use strict';

    function ViewerCommunication (targetURL, integration = 'study') {
        let windowReference;
        let integrationType = integration === 'study' ? 'study' : 'token';
        const callbacks = {};
        const functions = {};

        functions.getWindowReference = function () {
            return windowReference;
        };

        functions.findWindowReference = function () {
            if (!windowReference || windowReference && windowReference.closed) {
                windowReference = window.open('', 'MedDreamViewer');
            }
            return windowReference;
        };

        functions.focusWindow = function () {
            const reference = this.findWindowReference();
            if (reference) {
                reference.focus();
            }
        };

        functions.postActionMessage = function (actionType, actionData) {
            const reference = this.findWindowReference();
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
            switch (actionType) {
                case 'COMMUNICATION_SERVICE_READY':
                    this.performOnCommunicationServiceReadyCallback();
                    break;
                case 'GET_OPENED_STUDIES':
                    this.performOnGetOpenedStudiesCallback(actionData);
                    break;
                case 'GET_VIEWPORT_DATA':
                    this.performOnGetViewportDataCallback(actionData);
                    break;
                case 'GET_VIEWPORTS_INFORMATION':
                    this.performOnGetViewportsInformationCallback(actionData);
                    break;
                case 'GET_INSTANCE_METADATA':
                    this.performOnGetInstanceMetadataCallback(actionData);
                    break;
                case 'GET_SNAPSHOT':
                    this.performGetSnapshotCallback(actionData);
                    break;
                case 'STUDY_LOADED':
                    this.performOnStudyLoadedCallback(actionData);
                    break;
                case 'ANNOTATIONS_SAVE_STARTED':
                    this.performOnAnnotationsSaveStartedCallback(actionData);
                    break;
                case 'ANNOTATIONS_SAVED':
                    this.performOnAnnotationsSavedCallback(actionData);
                    break;
                case 'STRUCTURE_SET_EDITED':
                    this.performOnStructureSetEditedCallback(actionData);
                    break;
                case 'INSTANCE_CHANGED':
                    this.performOnInstanceChangedCallback(actionData);
                    break;
                case 'ACTIVE_CONTAINER_CHANGED':
                    this.performOnActiveContainerChangedCallback(actionData);
                    break;
                case 'MEASUREMENT_CREATED':
                    this.performOnMeasurementCreatedCallback(actionData);
                    break;
                case 'MEASUREMENT_UPDATED':
                    this.performOnMeasurementUpdatedCallback(actionData);
                    break;
                case 'MEASUREMENT_DELETED':
                    this.performOnMeasurementDeletedCallback(actionData);
                    break;
                default:
                    break;
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

        functions.performOnGetViewportDataCallback = function (actionData) {
            if (callbacks.onGetViewportDataCallback) {
                callbacks.onGetViewportDataCallback(actionData);
            }
        }

        functions.performOnGetViewportsInformationCallback = function (actionData) {
            if (callbacks.onGetViewportsInformationCallback) {
                callbacks.onGetViewportsInformationCallback(actionData);
            }
        }

        functions.performOnGetInstanceMetadataCallback = function (actionData) {
            if (callbacks.onGetInstanceMetadataCallback) {
                callbacks.onGetInstanceMetadataCallback(actionData);
            }
        }

        functions.performGetSnapshotCallback = function (actionData) {
            if (callbacks.onGetSnapshotCallback) {
                callbacks.onGetSnapshotCallback(actionData);
            }
        }

        functions.performOnStudyLoadedCallback = function (actionData) {
            if (callbacks.onStudyLoadedCallback) {
                callbacks.onStudyLoadedCallback(actionData);
            }
        }

        functions.performOnAnnotationsSaveStartedCallback = function (actionData) {
            if (callbacks.onAnnotationsSaveStartedCallback) {
                callbacks.onAnnotationsSaveStartedCallback(actionData);
            }
        }

        functions.performOnAnnotationsSavedCallback = function (actionData) {
            if (callbacks.onAnnotationsSavedCallback) {
                callbacks.onAnnotationsSavedCallback(actionData);
            }
        }

        functions.performOnStructureSetEditedCallback = function (actionData) {
            if (callbacks.onStructureSetEditedCallback) {
                callbacks.onStructureSetEditedCallback(actionData);
            }
        }

        functions.performOnInstanceChangedCallback = function (actionData) {
            if (callbacks.onInstanceChangedCallback) {
                callbacks.onInstanceChangedCallback(actionData);
            }
        }

        functions.performOnActiveContainerChangedCallback = function (actionData) {
            if (callbacks.onActiveContainerChangedCallback) {
                callbacks.onActiveContainerChangedCallback(actionData);
            }
        }

        functions.performOnMeasurementCreatedCallback = function (actionData) {
            if (callbacks.onMeasurementCreatedCallback) {
                callbacks.onMeasurementCreatedCallback(actionData);
            }
        }

        functions.performOnMeasurementUpdatedCallback = function (actionData) {
            if (callbacks.onMeasurementUpdatedCallback) {
                callbacks.onMeasurementUpdatedCallback(actionData);
            }
        }

        functions.performOnMeasurementDeletedCallback = function (actionData) {
            if (callbacks.onMeasurementDeletedCallback) {
                callbacks.onMeasurementDeletedCallback(actionData);
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

        functions.addStudyIntegrationFunctions = function () {
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
        };

        functions.addTokenIntegrationFunctions = function () {
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
        };

        functions.addIntegrationFunctions = function () {
            if (integrationType === 'study') {
                functions.addStudyIntegrationFunctions();
            } else {
                functions.addTokenIntegrationFunctions();
            }
        };

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

        functions.getViewportData = function (showLabels) {
            this.postActionMessage('GET_VIEWPORT_DATA', {showLabels});
        };

        functions.getViewportsInformation = function () {
            this.postActionMessage('GET_VIEWPORTS_INFORMATION');
        };

        functions.getInstanceMetadata = function (instanceUid) {
            this.postActionMessage('GET_INSTANCE_METADATA', {instanceUid});
        };

        functions.getSnapshot = function () {
            this.postActionMessage('GET_SNAPSHOT');
        };

        functions.setSnapshot = function (snapshot) {
            this.postActionMessage('SET_SNAPSHOT', {snapshot});
        };

        functions.showInfoLabels = function (showLabels) {
            this.postActionMessage('SHOW_INFO_LABELS', {showLabels});
        };

        functions.updateButtonVisibility = function (buttonVisibility) {
            this.postActionMessage('UPDATE_BUTTON_VISIBILITY', {buttonVisibility});
        };

        functions.setAdditionalInfoLabels = function (labels) {
            this.postActionMessage('SET_ADDITIONAL_INFO_LABELS', {labels});
        };

        functions.setCustomStudyLabel = function (studyUid, label) {
            this.postActionMessage('SET_CUSTOM_STUDY_LABEL', {studyUid, label})
        }

        functions.setCustomTags = function (tags) {
            this.postActionMessage('SET_CUSTOM_TAGS', {tags})
        }

        functions.generateInstanceMpr = function (containerId) {
            this.postActionMessage('GENERATE_INSTANCE_MPR', {containerId});
        };

        functions.changeViewportOrientation = function (containerId, orientation) {
            this.postActionMessage('CHANGE_VIEWPORT_ORIENTATION', {containerId, orientation});
        };

        functions.createNewMeasurement = function (containerId, measurementData) {
            this.postActionMessage('CREATE_NEW_MEASUREMENT', {containerId, measurementData});
        };

        functions.deleteMeasurementById = function (measurementId) {
            this.postActionMessage('DELETE_MEASUREMENT_BY_ID', {measurementId});
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

        functions.subscribeGetViewportDataEvent = function (callback) {
            callbacks.onGetViewportDataCallback = callback;
        };

        functions.unsubscribeGetViewportDataEvent = function () {
            callbacks.onGetViewportDataCallback = undefined;
        }

        functions.subscribeGetViewportsInformationEvent = function (callback) {
            callbacks.onGetViewportsInformationCallback = callback;
        };

        functions.unsubscribeGetViewportsInformationEvent = function () {
            callbacks.onGetViewportsInformationCallback = undefined;
        }

        functions.subscribeGetInstanceMetadataEvent = function (callback) {
            callbacks.onGetInstanceMetadataCallback = callback;
        };

        functions.unsubscribeGetInstanceMetadataEvent = function () {
            callbacks.onGetInstanceMetadataCallback = undefined;
        }

        functions.subscribeGetSnapshotEvent = function (callback) {
            callbacks.onGetSnapshotCallback = callback;
        };

        functions.unsubscribeGetSnapshotEvent = function () {
            callbacks.onGetSnapshotCallback = undefined;
        }

        functions.subscribeStudyLoadedEvent = function (callback) {
            callbacks.onStudyLoadedCallback = callback;
            this.subscribeEvent('STUDY_LOADED');
        };

        functions.unsubscribeStudyLoadedEvent = function () {
            callbacks.onStudyLoadedCallback = undefined;
            this.unsubscribeEvent('STUDY_LOADED');
        };

        functions.subscribeAnnotationsSaveStartedEvent = function (callback) {
            callbacks.onAnnotationsSaveStartedCallback = callback;
            this.subscribeEvent('ANNOTATIONS_SAVE_STARTED');
        };

        functions.unsubscribeAnnotationsSaveStartedEvent = function () {
            callbacks.onAnnotationsSaveStartedCallback = undefined;
            this.unsubscribeEvent('ANNOTATIONS_SAVE_STARTED');
        };

        functions.subscribeAnnotationsSavedEvent = function (callback) {
            callbacks.onAnnotationsSavedCallback = callback;
            this.subscribeEvent('ANNOTATIONS_SAVED');
        };

        functions.unsubscribeAnnotationsSavedEvent = function () {
            callbacks.onAnnotationsSavedCallback = undefined;
            this.unsubscribeEvent('ANNOTATIONS_SAVED');
        };

        functions.subscribeStructureSetEditedEvent = function (callback) {
            callbacks.onStructureSetEditedCallback = callback;
            this.subscribeEvent('STRUCTURE_SET_EDITED');
        };

        functions.unsubscribeStructureSetEditedEvent = function () {
            callbacks.onStructureSetEditedCallback = undefined;
            this.unsubscribeEvent('STRUCTURE_SET_EDITED');
        };

        functions.subscribeInstanceChangedEvent = function (callback) {
            callbacks.onInstanceChangedCallback = callback;
            this.subscribeEvent('INSTANCE_CHANGED');
        };

        functions.unsubscribeInstanceChangedEvent = function () {
            callbacks.onInstanceChangedCallback = undefined;
            this.unsubscribeEvent('INSTANCE_CHANGED');
        };

        functions.subscribeActiveContainerChangedEvent = function (callback) {
            callbacks.onActiveContainerChangedCallback = callback;
            this.subscribeEvent('ACTIVE_CONTAINER_CHANGED');
        };

        functions.unsubscribeActiveContainerChangedEvent = function () {
            callbacks.onActiveContainerChangedCallback = undefined;
            this.unsubscribeEvent('ACTIVE_CONTAINER_CHANGED');
        };

        functions.subscribeMeasurementCreatedEvent = function (callback) {
            callbacks.onMeasurementCreatedCallback = callback;
            this.subscribeEvent('MEASUREMENT_CREATED');
        };

        functions.unsubscribeMeasurementCreatedEvent = function () {
            callbacks.onMeasurementCreatedCallback = undefined;
            this.unsubscribeEvent('MEASUREMENT_CREATED');
        };

        functions.subscribeMeasurementUpdatedEvent = function (callback) {
            callbacks.onMeasurementUpdatedCallback = callback;
            this.subscribeEvent('MEASUREMENT_UPDATED');
        };

        functions.unsubscribeMeasurementUpdatedEvent = function () {
            callbacks.onMeasurementUpdatedCallback = undefined;
            this.unsubscribeEvent('MEASUREMENT_UPDATED');
        };

        functions.subscribeMeasurementDeletedEvent = function (callback) {
            callbacks.onMeasurementDeletedCallback = callback;
            this.subscribeEvent('MEASUREMENT_DELETED');
        };

        functions.unsubscribeMeasurementDeletedEvent = function () {
            callbacks.onMeasurementDeletedCallback = undefined;
            this.unsubscribeEvent('MEASUREMENT_DELETED');
        };

        functions.getIntegrationType = function () {
            return integrationType;
        };

        functions.updateIntegrationType = function (newIntegrationType) {
            integrationType = newIntegrationType;

            functions.openStudy = undefined;
            functions.openStudies = undefined;
            functions.replaceStudies = undefined;
            functions.preloadStudies = undefined;
            functions.cacheStudies = undefined;
            functions.closeStudies = undefined;
            this.addIntegrationFunctions();
        };

        functions.addIntegrationFunctions();
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
