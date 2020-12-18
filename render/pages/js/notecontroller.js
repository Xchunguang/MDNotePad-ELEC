/**
 * 渲染线程通讯
 */
(function (e){
    let electron = e.electron;
    let { ipcRenderer,remote } = electron;
    const dialog = remote.dialog;
    e.noteController = {
        changeEncode: function(encode){
            let text = ipcRenderer.sendSync('send-mes', {type: 'changeEncode', payload: encode});
            initText(text);
        },
        checkIfEdit: function(){
            if(getValue){
                let text = getValue();
                return ipcRenderer.sendSync('send-mes', {type: 'checkIfExit', payload: text});
            }
        },
        downHtml: function(){
            const options = {
                title: '保存成HTML',
                filters: [
                    { name: 'HTML files (*.html)', extensions: ['html'] }
                ]
            }
            dialog.showSaveDialog(options)
            .then(result => {
                if(!result.canceled){
                    let savePath = result.filePath;
                    let html = getHtml();
                    let prefix = "<!DOCTYPE html><html><body><head> <meta charset='utf-8'/><title>MDNotePad</title></head>";
                    let end = "</body></html>";
                    html = prefix + html + end;
                    ipcRenderer.sendSync('send-mes', {type: 'exportHTML', payload: {path: savePath, html: html}});
                }
            })
        },
        createNewFile: function(){
            let canDo = ipcRenderer.sendSync('send-mes', {type: 'checkCanOpen'});
            function createNew(){
                ipcRenderer.sendSync('send-mes', {type: 'createNew'});
                initText("");
            }
            if(canDo){
                createNew();
            } else {
                let canContinue = ipcRenderer.sendSync('send-mes', {type: 'confirmToNext'});
                if(canContinue){
                    createNew();
                }
            }
        },
        exit: function(){
            let canDo = ipcRenderer.sendSync('send-mes', {type: 'checkCanOpen'});
            if(canDo){
                ipcRenderer.sendSync('send-mes', {type: 'exit'});
            } else {
                let canContinue = ipcRenderer.sendSync('send-mes', {type: 'confirmToNext'});
                if(canContinue){
                    ipcRenderer.sendSync('send-mes', {type: 'exit'});
                }
            }
        },
        toOpenFile: function(){
            let canDo = ipcRenderer.sendSync('send-mes', {type: 'checkCanOpen'});
            function openSelectDialog(){
                dialog.showOpenDialog({
                    title: '选择文件',
                    properties: ['openFile'],
                    filters: [
                        { name: '所有文件', extensions: ['*'] }
                    ]
                }).then(result => {
                    if(!result.canceled && result.filePaths && result.filePaths.length > 0){
                        let file = result.filePaths[0];
                        let text = ipcRenderer.sendSync('send-mes', {type: 'openFile', payload: file});
                        initText(text);
                    }
                }).catch(err => {
                    console.log(err)
                });
            }
            if(canDo){
                openSelectDialog();
            } else {
                let canContinue = ipcRenderer.sendSync('send-mes', {type: 'confirmToNext'});
                if(canContinue){
                    openSelectDialog();
                }
            }
        },
        // 拖拽打开的文件
        openFile: function(file){
            let text = ipcRenderer.sendSync('send-mes', {type: 'openFile', payload: file});
            initText(text);
        },
        toSaveFile: function(){
            let text = getValue();
            let path = ipcRenderer.sendSync('send-mes', {type: 'getPath'});
            if(!path || path.length === 0){// 新建文件
                const options = {
                    title: '保存',
                    filters: [
                        { name: '所有文件', extensions: ['*'] }
                    ]
                }
                dialog.showSaveDialog(options)
                .then(result => {
                    if(!result.canceled){
                        let savePath = result.filePath;
                        ipcRenderer.sendSync('send-mes', {type: 'saveFile', payload: {path: savePath, text: text}});
                    }
                })
            } else { // 已有文件
                ipcRenderer.sendSync('send-mes', {type: 'saveFile', payload: {path: path, text: text}});
            }
        },
        selectFolderTree: function(callback){
            dialog.showOpenDialog({
                title: '选择文件夹',
                properties: ['openDirectory'],
                filters: [
                    { name: '所有文件', extensions: ['*'] }
                ]
            }).then(result => {
                if(!result.canceled && result.filePaths && result.filePaths.length > 0){
                    let file = result.filePaths[0];
                    let text = ipcRenderer.sendSync('send-mes', {type: 'openFolderTree', payload: file});
                    if(callback){
                        callback(text);
                    }
                }
            }).catch(err => {
                console.log(err)
            });
        },
        openGithub: function(){

        }
    };
})(window);