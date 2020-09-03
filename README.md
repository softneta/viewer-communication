# MedDream Viewer Communication

## Add component to your project
Import and create new Viewer Communication component in your project:

```js
const viewerCommunication = new ViewerCommunication(targetURL, integration);
```

Parameters:

- `targetURL` - MedDream Viewer URL;
- `integration` (Optional) - Integration type: `study` or `token`. Default value: `study`.

## Window reference functions

#### Get available Viewer window reference
```js
const windowReference = viewerCommunication.getWindowReference();
```

#### Focus available window
```js
viewerCommunication.focusWindow();
```

#### Post action message to MedDream Viewer
```js
viewerCommunication.postActionMessage(actionType, actionData);
```

Parameters:

- `actionType` - Action message command type;
- `actionData` - Data needed for action message.

For more details about available action messages check: `MedDream communication documentation`

## Functions to open MedDream Viewer

#### Open studies in MedDream
```js
viewerCommunication.openInMedDream(studies/token);
```

Parameters:

- `studies` (For `study` integration) - Study uid's list separated with `,`;
- `token` (For `token` integration) - Token with study information.

#### Add studies to MedDream
```js
viewerCommunication.addToMedDream(studies/token);
```

Parameters:

- `studies` (For `study` integration) - Study uid's list separated with `,`;
- `token` (For `token` integration) - Token with study information.

#### Replace studies in MedDream
```js
viewerCommunication.replaceInMedDream(studies/token);
```

Parameters:

- `studies` (For `study` integration) - Study uid's list separated with `,`;
- `token` (For `token` integration) - Token with study information.

## Communication functions

### Functions only for Study integration

#### Open study
```js
viewerCommunication.openStudy(study);
```

Parameter:

- `study` - Study uid.

#### Open studies
```js
viewerCommunication.openStudies(studies);
```

Parameter:

- `studies` - Array of study uid's.

#### Replace studies
```js
viewerCommunication.replaceStudies(studies);
```

Parameter:

- `studies` - Array of study uid's.

#### Preload studies
```js
viewerCommunication.preloadStudies(studies);
```

Parameter:

- `studies` - Array of study objects. Each study object has **_studyUid_** and **_storageId_** parameters.

Array example:

```js
const studies = [
    {
        studyUid: 'study-uid-1',
        storageId: 'storage-id'
    },
    {
        studyUid: 'study-uid-2',
        storageId: 'storage-id'
    }
];
```

#### Close studies
```js
viewerCommunication.closeStudies(studies);
```

Parameter:

- `studies` - Array of study objects. Each study object has **_studyUid_** and **_storageId_** parameters.

Array example:

```js
const studies = [
    {
        studyUid: 'study-uid-1',
        storageId: 'storage-id'
    }
];
```

### Functions only for Token integration

#### Open studies
```js
viewerCommunication.openStudies(token);
```

Parameter:

- `token` - Generated token with studies information.

#### Replace studies
```js
viewerCommunication.replaceStudies(token);
```

Parameter:

- `token` - Generated token with studies information.

#### Preload studies
```js
viewerCommunication.preloadStudies(token);
```

Parameter:

- `token` - Generated token with studies information.

#### Close studies
```js
viewerCommunication.closeStudies(token);
```

Parameter:

- `token` - Generated token with studies information.

### Common functions

#### Preload all studies
```js
viewerCommunication.preloadAllStudies();
```

#### Close all studies
```js
viewerCommunication.closeAllStudies();
```

#### Set layout
```js
viewerCommunication.setLayout(columns, rows);
```

Parameters:

- `columns` - Number of columns;
- `rows` - Number of rows.

#### Open instance
```js
viewerCommunication.openInstance(instanceUid, viewportColumn, viewportRow, viewportActions);
```

Parameters:

- `instanceUid` - Unique instance uid which has to be opened to viewport;
- `viewportColumn` - Column number of desired viewport;
- `viewportRow` - Row number of desired viewport;
- `viewportActions` - Object of actions which have to be performed on viewport after instance is loaded.

Available viewport actions:

- `windowing` - Windowing level. Available options: **_"DEFAULT"_**, **_"AUTO"_**, **_"CUSTOM"_**.
If **_"CUSTOM"_** windowing is selected, **_customWindowing_** parameter has to be defined in **_viewportActions_** object;
- `customWindowing` - Custom windowing level. This parameter allows to set custom windowing **_width_** and **_center_** levels.
**_customWindowing_** has to be defined only when **_"CUSTOM"_** windowing is selected;
- `rotation` - Instance rotation by defined number of degrees;
- `verticalFlip` - Vertical instance flip. Available options: **_true_**/**_false_**;
- `horizontalFlip` - Horizontal instance flip. Available options: **_true_**/**_false_**;
- `scale` - Instance scaling option. Available options: **_"ORIGINAL"_**, **_"FIT_TO_SCREEN"_**, **_"CUSTOM"_**.
If **_"CUSTOM"_** scale is selected, **_customScale_** parameter has to be defined in **_viewportActions_** object.
- `customScale` - Custom scale number.
- `alignment` - Instance alignment in viewport. Available options: **_"RIGHT"_**, **_"LEFT"_**, **_"CENTER"_**.

Viewport actions object example:

```js
const viewportActions = {
    windowing: 'CUSTOM',                    //DEFAULT, AUTO, CUSTOM
    customWindowing: {width: 2, center: 2}, //Use if custom windowing
    rotation: 45,
    verticalFlip: true,
    horizontalFlip: true,
    scale: 'CUSTOM',                        //ORIGINAL, FIT_TO_SCREEN, CUSTOM
    customScale: 0.5,                       //Use if custom scale
    alignment: 'CENTER'                     //RIGHT, LEFT, CENTER
};
```

#### Export instance
```js
viewerCommunication.exportInstance(viewportColumn, viewportRow);
```

Parameters:

- `viewportColumn` (Optional) - Column number of desired viewport;
- `viewportRow` (Optional) - Row number of desired viewport;

Currently active viewport instance is exported, if `viewportColumn` and `viewportRow` are not provided.

#### Get opened studies
```js
const callback = (studies) => {console.log(studies)};
viewerCommunication.onGetOpenedStudies(callback);
viewerCommunication.getOpenedStudies();
```

Usage:

- Register **_onGetOpenedStudies_** **_callback_** function;
- Call **_getOpenedStudies_** function to request opened studies callback;
- Once message is processed, **_callback_** function will be triggered with opened studies array.