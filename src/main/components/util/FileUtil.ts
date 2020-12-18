import * as fs from 'fs';
export const FileUtil = {
    readFileSync: function(path: string, encode='utf8'){
        return fs.readFileSync(path,{encoding: encode})
    },
    writeFileSync: function(path: string, str: string, encode='utf8'){
        fs.writeFileSync(path, str, encode);
    },
    fileExist: function(path: string){
        return fs.existsSync(path);
    },
    fileSize: function(path: string): number{
        if(this.fileExist(path)){
            return fs.statSync(path).size;
        }
        return 0;
    }
}