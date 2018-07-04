var myalert = {
    /*
        功能：错误提示
        参数：
            - msg: 提示的内容（可选）
     */
    'alertError': function(msg){
        swal('提示', msg, 'error');
    },

    /*
        功能：信息提示
        参数：
            - msg: 提示的内容（可选）
     */
    'alertInfo': function(msg){
        swal('提示', msg, 'warning');
    },

    /*
        功能：可以自定义标题的信息提示
        参数：
            - title: 标题
            - msg: 提示的内容（可选）
     */
    'alertInfoWithTitle': function(title, msg){
        swal(title, msg);
    },

    /*
        功能：成功提示
        参数：
            - msg: 提示的内容（必须）
            - confirmCallback: 回调方法
     */
    'alertSuccess': function(msg, confirmCallback){
        args = {
            'title': '提示',
            'text': msg,
            'type': 'success',
        }
        swal(args, confirmCallback);
    },

    /*
        功能：带有标题的成功提示
        参数：
            - title: 标题（必须）
            - msg: 提示的内容（必须）
            - confirmCallback: 回调方法
     */
    'alertSuccessWithTitle': function(title, msg){
        swal(title, msg, 'success');
    },

    /*
        功能：确认提示
        参数：字典形式
     */
    'alertConfirm': function(params){
        var args = {
            'title': params['title']?params['title']:'提示',
            'text': params['text']?params['text']:'',
            'type': params['type']?params['type']:'',
            'showCancelButton': true,
            'showConfirmButton': true,
            'confirmButtonText': params['confirmButtonText']?params['confirmButtonText']:'确认',
            'cancelButtonText': params['cancelButtonText']?params['cancelButtonText']:'取消',
            'confirmButtonColor': '#3085d6',

        }

        swal(args).then(function(isConfirm){
            if(isConfirm){
                if(params['confirmCallback']){
                    params['confirmCallback']();
                }
            }else{
                if(params['cancelCallback']){
                    params['cancelCallback']();
                }
            }
        });
    },

    /*
        功能： 带有一个输入框的提示
        参数： 字典
     */
    'alertOneInput': function(params){
        var args = {
            'title': params['title']?params['title']:'请输入',
            'text': params['text']?params['text']:'',
            'type': '',
            'showCancelButton': true,
            'showConfirmButton': true,
            'animation': 'slide-from-top',
            'closeOnConfirm': false,
            'showLoaderOnConfirm': true,
            'inputPlaceholder': params['placeholder']?params['placeholder']:'',
            'inputValue': params['value']?params['value']:'',
            'confirmButtonText': params['confirmButtonText']?params['confirmButtonText']:'确认',
            'cancelButtonText': params['cancelButtonText']?params['cancelButtonText']:'取消',
        }

        swal(args,function(inputValue){
            if(inputValue === false) return false;
            if(inputValue === ''){
                this.alertError(params['errorMsg']?params['errorMsg']:'输入的值不能为空');
                return false;
            }
            if(params['confirmCallback']){
                params['confirmCallback'](inputValue);
            }
        })
    },

    /*
        功能：带有输入框的提示
     */
    'alertAjaxInput': function(params){
        var args = {
            'title': params['title']?params['title']:'请输入',
            'input': params['input']?params['input']:'text',
            'inputValue': params['value']?params['value']:'',
            'inputPlaceholder': params['placeholder']?params['placeholder']:'',
            'showCancelButton': true,
            'confirmButtonText': params['confirmButtonText']?params['confirmButtonText']:'提交',
            'showLoaderOnConfirm': true,
            'preConfirm': params['preConfirm']?params['preConfirm']:null,
            'allowOutsideClick': false
        };
        swal(args)
    },

    /*
        功能：展示网络错误
     */
    'alertNetworkError': function(){
        this.alertErrorToast('网络错误');
    },

    /*
        功能：toast提示
        参数：
            - msg: 提示消息
     */
    'alertInfoToast': function(msg, callback){
        this.alertToast(msg, 'info', callback);
    },

    /*
        功能：错误toast提示
        参数：
            - msg: 提示消息
     */
    'alertErrorToast': function(msg, callback){
        this.alertToast(msg, 'error', callback);
    },

    /*
        功能：成功toast提示
        参数：
            - msg: 提示消息
     */
    'alertSuccessToast': function(msg, callback){
        this.alertToast(msg, 'success', callback);
    },

    /*
        功能：自定义toast提示
     */

    'alertToast': function(msg, type, callback){
        swal({
            'title': msg,
            'text': '',
            'type': type,
            'showCancelButton': false,
            'showConfirmButton': false,
            'timer': 1000,
        }).then(function(){
            if(callback){
                callback();
            }
        });
    },

    /*
        功能：关闭当前对话框
     */
    'close': function(){
        swal.close();
    }
}