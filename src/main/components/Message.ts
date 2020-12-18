import { ipcMain, dialog, BrowserWindow, app } from 'electron';
import Status from './Status';
import { FileUtil } from './util/FileUtil';
import { gen } from './util/GenFolderTree';

export function initMessage(status: Status, win: BrowserWindow){

    win.on("close",()=>{
        if(status.edit){
            if(confirm() === 0){
                app.exit();
            }
        } else {
            app.exit();
        }
    });

    function confirm(): number{
        const options = {
            type: 'info',
            title: '是否继续',
            message: "当前尚未保存，是否继续?",
            buttons: ['继续', '取消']
        }
        let index = dialog.showMessageBoxSync(options);
        return index;
    }

    function bigFileConfirm(): number{
        const options = {
            type: 'info',
            title: '是否继续',
            message: "当前文件超过100M，是否继续打开?",
            buttons: ['继续', '取消']
        }
        let index = dialog.showMessageBoxSync(options);
        return index;
    }

    ipcMain.on('send-mes', (e, {type, payload}) => {
        switch(type){
            case "checkCanOpen": 
                e.returnValue = !status.edit;
                break;
            case "confirmToNext":
                let index = confirm();
                if(index === 0){
                    e.returnValue = true;
                }else{
                    e.returnValue = false;
                }
                break;
            case "openFile":
                if(FileUtil.fileSize(payload) >= 100*1024*1024){
                    let index = bigFileConfirm();
                    if(index === 0){
                        e.returnValue = status.openFile(payload);
                        win.setTitle(status.getTitle());
                    }else{
                        e.returnValue = status.text;
                    }
                } else {
                    e.returnValue = status.openFile(payload);
                    win.setTitle(status.getTitle());
                }
                break;
            case "changeEncode":
                e.returnValue = status.changeEncoding(payload);
                break;
            // 编辑器内容变化
            case "checkIfExit": 
                status.update(payload);
                win.setTitle(status.getTitle());
                e.returnValue = "";
                break;
            case "exportHTML": 
                let {path, html} = payload;
                FileUtil.writeFileSync(path, html);
                break;
            case "createNew":
                status.createNew();
                win.setTitle(status.getTitle());
                break;
            case "exit":
                app.exit();
                break;
            case "getPath":
                e.returnValue = status.path;
                break;
            case "saveFile": 
                status.save(payload.path, payload.text);
                win.setTitle(status.getTitle());
                break; 
            case "openFolderTree":
                e.returnValue = gen(payload);
                break;
            default: 

        }

        e.returnValue = "";
    });
}