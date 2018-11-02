function News(){}

News.prototype.run = function(){
    var self = this;
    // self.listenQiniuUploadFileEvent();   // 将图片上传到七牛云
    self.listenUploadFileEvent();
    self.initUEditor();
    self.listenSubmitEvent();

};

News.prototype.initUEditor = function(){
    window.ue = UE.getEditor('editor',{
        'initialFrameHeight': 400,
        'serverUrl': '/ueditor/upload/'
    });


};

News.prototype.listenSubmitEvent = function(){
    var submitBtn = $('#submit-btn')
    submitBtn.click(function (event) {
        event.preventDefault();
        var title = $('input[name="title"]').val();
        var category = $('select[name="category"]').val();
        var desc = $('input[name="desc"]').val();
        var thumbnail = $('input[name="thumbnail"]').val();
        var content = window.ue.getContent();

        console.log(category)
        myajax.post({
            'url': '/cms/write_news/',
            'data': {
                'title': title,
                'category': category,
                'thumbnail': thumbnail,
                'desc': desc,
                'content': content
            },
            'success': function(result){
                if(result['code'] === 200){
                    myalert.alertSuccess('发表成功', function(){
                        window.location.reload();
                    })
                }
            }
        })
    })
}

News.prototype.listenQiniuUploadFileEvent = function(){
    var self = this;
    var uploadBtn  = $('#thumbnail-btn');
    uploadBtn.change(function() {
        var file = this.files[0];
        myajax.get({
            'url': '/cms/qntoken/',
            'success': function (result) {
                if (result['code'] === 200){
                    var token = result['data']['token'];
                    var nameList = file.name.split('.');
                    var key = (new Date()).getTime() + '.' + nameList[nameList.length - 1];
                    var putExtra = {
                        fname: key,
                        params: {},
                        mimeType: ['image/png','image/jpg','image/gif']
                    };
                    var config = {
                        useCdnDomain: true,
                        retryCount: 6,
                        region:  ''
                    };
                    var observable = qiniu.upload(file, key, token, putExtra, config);
                    observable.subscribe({
                        'next': self.handleFileUploadProgress(),
                        'error': self.handleFileUploadError(),
                        'complete': self.handleFileUploadComplete()
                    })
                }else{
                }
            }
        })
    })
}

News.prototype.handleFileUploadProgress = function(response){
    var total = response.total;
    var percent = total.percent + '%';
    News.progressGroup.show();
    News.progressBar.css({'width': percent});
    News.progressBar.text(percent);

}

News.prototype.handleFileUploadError = function(error){
    window.messageBox.showError(error.message);
    News.progressGroup.hide();
    console.log(error.message);
}

News.prototype.handleFileUploadComplete = function(response){
    News.progressGroup.hide();

    var domain= '';
    var filename = response.key;
    var url = domain + filename;
    var thumbnailInput = $('input[name="thumnail"]');
    thumbnailInput.val(url);

}

News.prototype.listenUploadFileEvent = function(){
    var uploadBtn  = $('#thumbnail-btn');
    uploadBtn.change(function(){
        var filelist = uploadBtn[0].files;  // 获取文件列表
        var formData = new FormData();
        formData.append('file',filelist[0])
        myajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false, //告诉jq不需要对data进行二次处理
            'contentType': false, //不需要更改contentType
            'success': function(result){
                if(result['code'] == 200){
                    var url = result['data']['url'];
                    var thumbnailInput = $("#thumbnail-form")
                    thumbnailInput.val(url)
                }
            }
        })
    })
}

$(function(){
    var news = new News();
    news.run();
    News.progressGroup = $('#progress-group');
    News.progressBar = $('.progress-bar');
})