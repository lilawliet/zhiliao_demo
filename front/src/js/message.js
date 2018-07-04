function Message(){
    var self = this;
    self.isAppended = false;
    self.wrapperHeight = 48;
    self.wrapperwidth = 300;
    this.ERROR = ['#a64043', '#d71345']
    this.SUCCESS = ['#008792', '#00ae9d'];
    this.WARNING = ['#b4c13b', '#FFF68F'];
    this.INFO = ['#156891', '#2585a6'];
}

Message.prototype.initElement = function(state){
    var self = this;
    self.wrapper = $('<div class="tips"></div>');
    self.wrapper.css({
        'background': self.ERROR[1],
        'padding': '10px',
        'color': '#dadada',
        'font-size': '14px',
        'width': '300px',
        'position': 'fixed',
        'z-index': '10000',
        'left': '50%',
        'top': '-48px',
        'margin-left': '-150px',
        'height': '48px',
        'box-sizing': 'border-box',
        'border': '1px solid',
        'border-color': '#dadada',
        'border-radius': '4px',
        'line-height': '24px'
    });

    self.closeBtn = $('<span>×</span>');
    self.closeBtn.css({
        'font-weight': '700',
        'color': '#dadada',
        'float': 'right',
        'cursor': 'pointer',
        'font-size': '22px'
    });

    self.messageSpan = $('<span class="xfz-message-group"></span>')

    self.wrapper.append(self.messageSpan)
    self.wrapper.append(self.closeBtn)
}

Message.prototype.listenCloseEvent = function(){
    var self = this;
    self.closeBtn.click(function(){
        self.wrapper.animate({'top': -self.wrapperHeight});
    })
}

Message.prototype.changeState = function(state){
    var self = this;
    self.wrapper.css({
        'background': state[1],
    });
}

Message.prototype.show = function(message, state, callback){
    var self = this;
    $('.tips').remove();
    self.initElement();
    self.listenCloseEvent();
    $(document.body).append(self.wrapper);
    if(state){
        self.changeState(state)
    }
    self.messageSpan.text(message);
    self.wrapper.animate({'top':0},function(){
        setTimeout(function(){
            self.wrapper.animate({'top':-self.wrapperHeight},function(){
                $('.tips').remove();
            });
            if(callback instanceof Function){
                callback();
            }
        }, 2000)
    });

};

Message.prototype.showError = function(message, callback){
    this.show(message,this.ERROR, callback)
}

Message.prototype.showInfo = function(message, callback){
    this.show(message,this.INFO, callback)
}

Message.prototype.showSuccess = function(message, callback){
    this.show(message,this.SUCCESS, callback)
}

Message.prototype.showWarning = function(message, callback){
    this.show(message,this.WARNING, callback)
}

window.messageBox = new Message();