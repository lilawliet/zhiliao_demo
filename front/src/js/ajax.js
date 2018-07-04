/**
 * Created by hynev on 2018/5/15.
 */

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var myajax = {
    'get': function (args) {
        args['method'] = 'get';
        this.ajax(args);
    },
    'post': function (args) {
        args['method'] = 'post';
        this._ajaxSetup();
        this.ajax(args);
    },
    'ajax': function (args) {
        var success = args['success'];
        args['success'] = function(result){
            if (result['code'] == 200){
                if (success){
                    success(result);
                }
            }else{
                var messageObject = result['message'];
                if(typeof messageObject == 'string' || messageObject.constructor == String){
                        window.messageBox.show(messageObject)
                }else{
                    // for(var key in messageObject){
                        var message = messageObject[Object.keys(messageObject)[0]];  //只吐丝最前面的一个错误提示
                        window.messageBox.show(message)
                    // }
                }
                if(success){
                    success(result);
                }
            }
        };
        if(args['fail'] == null){
            args['fail'] = function(error){
                console.log(error)
                window.messageBox.showError('服务器内部错误')
            }
        }

        $.ajax(args);

    },
    '_ajaxSetup': function () {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                }
            }
        });
    }
};
