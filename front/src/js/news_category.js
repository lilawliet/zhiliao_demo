
function NewCategory(){

};

NewCategory.prototype.run = function(){
    var self = this;
    self.listenAddCategoryEvent();
    self.listenOperationEvent();
};

NewCategory.prototype.listenAddCategoryEvent = function(){
    var addBtn = $('#add-btn');
    addBtn.click(function(){
        myalert.alertAjaxInput({
            'title': '添加新闻分类',
            'placeholder': '请输入分类名称',
            'preConfirm': function(inputValue){
                if(!inputValue){
                    myalert.alertErrorToast('分类名称不能为空')
                    return false;
                }
                myajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {'name': inputValue},
                    'success': function(result){
                        if( result['code'] == 200){
                            myalert.alertSuccessToast(inputValue+'添加成功');
                            setTimeout(window.location.reload(),1000)
                        }else{
                            myalert.close()
                        }
                    },
                    'fail':function(error){}
                })
            }
        })
    })
}

NewCategory.prototype.listenOperationEvent = function(){
    var self = this;
    var editBtn = $('.edit-btn');
    editBtn.click(function(){
        var currBtn = $(this);
        var tr = currBtn.parents('tr');
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
        myalert.alertAjaxInput({
            'title': '修改新闻分类',
            'placeholder': '请输入分类名称',
            'value': name,
            'preConfirm': function(inputValue){
                if(!inputValue){
                    myalert.alertErrorToast('分类名称不能为空');
                    return false;
                }
                myajax.post({
                    'url': '/cms/edit_news_category/',
                    'data': {'name': inputValue, 'pk': pk},
                    'success': function(result){
                        if(result['code'] == 200){
                            myalert.alertSuccessToast('修改成功', setTimeout(window.location.reload(),3000));
                        }
                        else{
                            myalert.close()
                        }
                    },
                    'fail':function(error){}
                })
            }
        })
    });

    var delBtn = $('.del-btn');
    delBtn.click(function(){
        var currBtn = $(this);
        var tr = currBtn.parents('tr');
        var pk = tr.attr('data-pk');
        myalert.alertConfirm({
            'title': '确定要删除该分类吗？',
            'confirmCallback': function(){
                myajax.post({
                    'url': '/cms/del_news_category/',
                    'data': {'pk': pk},
                    'success': function(result){
                        if(result['code'] == 200){
                            myalert.alertSuccessToast('删除成功', setTimeout(window.location.reload(),3000));
                        }
                        else{
                            myalert.close()
                        }
                    },
                    'fail':function(error){
                        myalert.alertErrorToast('删除操作失败');
                    }
                })
            }
        })

    })
}

$(function(){
    var category = new NewCategory();
    category.run();
})