function NewsList(){}

NewsList.prototype.run = function(){
    this.listenSubmitEvent();
}

NewsList.prototype.listenSubmitEvent = function(){
    var submitBtn = $('.submit-btn');
    var testarea = $('textarea[name="comment"]');
    submitBtn.click(function(){
        var content = testarea.val();
        var news_id = submitBtn.attr('data-news-id');
        console.log(content)
        console.log(news_id)
        myajax.post({
            'url': '/news/public_comment/',
            'data': {
                'content': content,
                'news_id': news_id
            },
            'success': function(result){
                if(result['code'] === 200){
                    var comment = result['data'];
                    console.log(comment)
                    var tpl = template('comment-item', {'comment': comment});
                    var commentListGroup = $('.comment-list');
                    commentListGroup.prepend(tpl)
                    window.messageBox.showSuccess('评论发表成功！');
                    testarea.val('');
                }else{
                    window.messageBox.showError(result['message'])
                }
            }
        })
    })
}

$(function(){
    var newsList = new NewsList();
    newsList.run();
})