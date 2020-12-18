import * as path from 'path';
import * as fs from 'fs';

function gener(filePath: string, level=0, mark="├─"){
  let res = "";
  let stat = fs.statSync(filePath);
  for(let i=0;i<level;i++){
      res += "│  ";
  }
  res += mark + path.basename(filePath) + "\n";
  if(stat.isDirectory()){
    let files = fs.readdirSync(filePath);
    for(let i=0;i<files.length;i++){
      res += gener(path.join(filePath, files[i]), level+1, i===files.length - 1 ? '└─' : '├─')
    }
  }
  return res;
}

export function gen(filePath: string): string{
    let baseFile = fs.statSync(filePath);
    let res = '';
    if(baseFile.isDirectory()){
      res += path.basename(filePath) + ":" + "\n";
      let files = fs.readdirSync(filePath);
      if(files && files.length > 0){
        for(let i=0;i<files.length;i++){
          res += gener(path.join(filePath, files[i]), 0, i===files.length - 1 ? '└─' : '├─');
        }
      }
    }
    return res;
}