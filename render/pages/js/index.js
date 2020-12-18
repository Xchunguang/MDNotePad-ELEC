var testEditor;
            
var md = "";

var edit = false;

var initEditor = function(callback){
    testEditor = editormd("test-editormd", {
        width: "100%",
        height: "100%",
        path : '../lib/',
        theme : "eclipse",
        previewTheme : "eclipse",
        editorTheme : "eclipse",
        markdown : md,
        codeFold : true,
        //syncScrolling : false,
        saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
        searchReplace : true,
        watch : true,                // 关闭实时预览
        htmlDecode : "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启    
        //toolbar  : false,             //关闭工具栏
        //previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
        emoji : true,
        taskList : true,
        tocm            : true,         // Using [TOCM]
        tex : true,                   // 开启科学公式TeX语言支持，默认关闭
        flowChart : true,             // 开启流程图支持，默认关闭
        sequenceDiagram : true,       // 开启时序/序列图支持，默认关闭,
        //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
        //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
        //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
        //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
        //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
        imageUpload : false,
        imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL : "./php/upload.php",
        onload : function() {
            // this.fullscreen();
            this.unwatch();
            //this.watch().fullscreen();
    
            //this.setMarkdown("#PHP");
            //this.width("100%");
            //this.height(480);
            //this.resize("100%", 640);
            callback && callback();
        }
    });
}

var initText = function(text){
    edit = false;
    if(text.length === 0){
        testEditor.clear();
    }else{
        md = text;
        initEditor(checkEdit);
    }    
}

var getValue = function(){
    return testEditor.getValue();
}

var getHtml = function(){
    return testEditor.getPreviewedHTML();
}

document.getElementById("encode").onclick = function(e){
    e.stopPropagation();
    var pane = document.getElementById("chooseEncode");
    if(pane.style.display === 'none'){
        pane.style.display = 'inline-block';
    }else{
        pane.style.display = 'none';
    }
}

document.body.addEventListener('drop', function(e){
	//必须要阻止拖拽的默认事件
    e.preventDefault();
    e.stopPropagation();
    
	//获得拖拽的文件集合
    var files=e.dataTransfer.files;

    if(files.length>0) {
        let file = files[0];
        noteController.openFile(file.path);
    }
});

document.body.addEventListener('dragover',(e)=>{
	//必须要阻止拖拽的默认事件
    e.preventDefault();
    e.stopPropagation();
})

var changeEncode = function(encode){
    noteController.changeEncode(encode);
    changeCodeDis(encode);
}

var changeCodeDis = function(encode){
    $("#encode").html(encode);
}

var checkTime = null;
var checkEdit = function(){
    testEditor.cm.on('change',()=>{
        // 防抖
        clearTimeout(checkTime);
        checkTime = setTimeout(()=>{
            noteController.checkIfEdit();
        }, 100);
    })
}

window.onresize = function(e){
	testEditor.resize("100%", "100%");
}
document.body.onclick = function(){
    var pane = document.getElementById("chooseEncode");
    pane.style.display = 'none';
}

initEditor(checkEdit);