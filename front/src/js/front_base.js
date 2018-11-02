function FrontBase(){}

FrontBase.prototype.listenAuthBoxHover = function(){
    var authBox = $('.auth-box')
    var userMoreBox = $('.user-more-box')
    authBox.hover(function(){
        userMoreBox.show()
    }, function(){
        userMoreBox.hide()
    })
}

FrontBase.prototype.run = function(){
    var self = this;
    self.listenAuthBoxHover();
}


function Auth(){
    var self = this;
    self.maskWrapper = $('.mask-wrapper');
    self.scrollWrapper = $('.scroll-wrapper');
    self.smsCaptcha = $('.sms-captcha-btn');
}

Auth.prototype.run = function(){
    var self = this;
    self.listenSHEvent();
    self.listenSwitchEvent();
    self.listenLoginEvent();
    self.listenImgCaptchaEvent();
    self.listenSmsCaptchaEvent();
    self.listenRegistEvent();
}

Auth.prototype.showEvent = function(){
    var self = this;
    self.maskWrapper.show()
}

Auth.prototype.hideEvent = function(){
    var self = this;
    self.maskWrapper.hide()
}

Auth.prototype.listenSHEvent = function(){
    var self = this;
    var loginBtn = $('.login-btn');
    var registBtn = $('.regist-btn');
    var closeBtn = $('.close-btn');
    loginBtn.click(function(){
        self.scrollWrapper.css({'left':0})
        self.showEvent()
    })

    registBtn.click(function(){
        self.scrollWrapper.css({'left':-400})
        self.showEvent()
    })

    closeBtn.click(function(){

        self.hideEvent()
    })
}

Auth.prototype.listenSwitchEvent = function(){
    var self = this;
    var switcher = $(".switch");
    switcher.click(function () {
        var currentLeft = self.scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if(currentLeft < 0){
            self.scrollWrapper.animate({"left":'0'});
        }else{
            self.scrollWrapper.animate({"left":"-400px"});
        }
    });
}

Auth.prototype.listenImgCaptchaEvent = function(){
    var imgCaptcha = $('.img-captcha')
    imgCaptcha.click(function(){
        imgCaptcha.attr('src','/account/img_captcha?random=' + Math.random())
    })
}

Auth.prototype.listenLoginEvent = function(){
    var self = this;
    var teletphoneInput = $('.signin-group input[name="telephone"]');
    var passwordInput = $('.signin-group input[name="password"]');
    var rememberInput = $('.signin-group input[name="remember"]');
    var loginBtn = $('.signin-group .submit-btn');
    loginBtn.click(function(){
        var telephone = teletphoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop('checked');
        // var csrf_token = $('signin-group input[name="csrfmiddlewaretoken"]').val();
        // Ajax
        myajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember?1:0,
                // 'csrf_token': csrf_token
            },
            'success': function (result) {
                self.hideEvent();
                messageBox.showSuccess('登录成功', function(){
                    setTimeout(window.location.reload())
                })
            }
        })
    })

}


Auth.prototype.listenRegistEvent = function(){
    var submitBtn = $('.signup-group .submit-btn');
    submitBtn.click(function(event){
        console.log('click')
        event.preventDefault();
        var telephoneInput = $('.signup-group input[name="telephone"]');
        var usernameInput = $('.signup-group input[name="username"]');
        var img_captchaInput = $('.signup-group input[name="img_captcha"]');
        var password1Input = $('.signup-group input[name="password1"]');
        var password2Input = $('.signup-group input[name="password2"]');
        var sms_captchaInput = $('.signup-group input[name="sms_captcha"]');

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var img_captcha = img_captchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var sms_captcha = sms_captchaInput.val();

        myajax.post({
            'url': 'account/regist/',
            'data':{
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
                'sms_captcha': sms_captcha
            },
            'success': function(result){
                if(result['code'] == 200){
                    window.location.reload()
                }
            }
        })
    })

}


Auth.prototype.smsSuccessEvent = function(){
    var self = this;
    messageBox.showSuccess('验证码已发送，请注意查收！')
    self.smsCaptcha.unbind();
    self.smsCaptcha.addClass('disabled');
    var count = 60;
    var timer = setInterval(function(){
        self.smsCaptcha.text(count + 's')
        if (count == 0){
            clearInterval(timer);
            self.smsCaptcha.removeClass('disable');
            self.smsCaptcha.text('发送验证码');
            self.listenSmsCaptchaEvent()
        }
        count --;
    },1000)
}


Auth.prototype.listenSmsCaptchaEvent = function(){
    var self = this;
    self.smsCaptcha.click(function(){
        var telephoneInput = $('.signup-group input[name="telephone"]');
        var telephone = telephoneInput.val();
        if (!telephone){
            messageBox.showError('请输入手机号码！')
        }else{
            myajax.get({
                'url': '/account/sms_captcha/',
                'data': {
                    'telephone': telephone
                },
                'success': function(result){
                    if(result['code'] == 200){
                        self.smsSuccessEvent()
                    }
                }
            })
        }

    })
}

$(function(){
    var auth = new Auth()
    auth.run()

    var frontBase = new FrontBase();
    frontBase.run();
})


$(function () {
    if (window.template) {
        template.defaults.imports.dateFormat = function (dateValue) {
            var date = new Date(dateValue);
            var datetimestamp = date.getTime();
            var nowtimestamp = (new Date()).getTime();
            var timestamp = (nowtimestamp - datetimestamp) / 1000; // 得到秒数
            if (timestamp < 60) {
                return '刚刚'
            }
            else if (timestamp >= 60 && timestamp < 60 * 60) {
                var minutes = parseInt(timestamp / 60);
                return minutes + '分钟前';
            }
            else if (timestamp >= 60 * 60 && timestamp < 60 * 60 * 24) {
                var hours = parseInt(timestamp / 60 / 60);
                return hours + '小时前';
            }
            else if (timestamp >= 60 * 60 * 24 && timestamp < 60 * 60 * 24 * 30) {
                var days = parseInt(timestamp / 60 / 60 / 24);
                return days + '天前';
            } else {
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
            }


        }
    }else{
        console.log('arttemplate出错')
    }
})