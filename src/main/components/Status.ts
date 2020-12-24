import {FileUtil} from './util/FileUtil';
import * as path from 'path';
import * as iconv from 'iconv-lite';
export default class Status {
    path: string;
    text: string; // TODO 大文件如何优化处理
    edit: boolean; // 是否正在编辑
    encoding="utf-8"
    constructor(path?:string){
        this.path = path;
        this.edit = false;
        if(path){
            // TODO 打开文件
        } else {
            this.text = "";
        }
    }
    update(text: string){
        this.text = text;
        if(text && text.length > 0){
            this.edit = true;
        }
    }
    save(path: string, text: string){
        this.path = path;
        this.text = text;
        this.edit = false;
        FileUtil.writeFileSync(this.path, this.text, this.encoding);
    }
    /**
     * 检查文件是否变动
     */
    checkIfChange(){
        
    }
    openFile(path: string){
        if(FileUtil.fileExist(path)){
            let text = FileUtil.readFileSync(path, this.encoding);
            this.text = text;
            this.edit = false;
            this.path = path;
            return text;
        }
    }
    getTitle(): string{
        let fileName = "MDNotePad";
        if(this.path && this.path.length > 0){
            fileName = path.basename(this.path);
        } else {
            fileName = "未保存 - " + fileName;
        }
        if(this.edit){
            fileName = "* " + fileName;
        }
        return fileName;
    }
    changeEncoding(encoding: string): string{
        let buf = iconv.encode(this.text, this.encoding);
        this.text = iconv.decode(buf, encoding);
        this.encoding = encoding;
        this.edit = true;
        return this.text;
    }
    createNew(){
        this.text = "";
        this.edit = false;
        this.path = "";
        this.encoding = "utf-8";
    }
}