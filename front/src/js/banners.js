function Banners(){}

Banners.prototype.run = function(){
    this.listenAddBannerEvent();
    this.loadDate();
}

Banners.prototype.listenAddBannerEvent = function(){
    var self = this;
    var addBtn = $('#add-banner-btn');
    addBtn.click(function(){
        self.createBannerItem()
    })
}


Banners.prototype.createBannerItem = function(banner){
    var self = this;
    var tpl = template('banner-template', {'banner': banner});
    var bannerItem;
    var box = $('.box');
    if(banner){
        box.append(tpl);
        bannerItem = box.find('.banner-item:last');
    }else{
        box.prepend(tpl);
        bannerItem = box.find('.banner-item:first')
    }

    self.addImageSelectEvent(bannerItem);
    self.addRemoveBannerEvent(bannerItem);
    self.listenSubmitEvent(bannerItem);
}


Banners.prototype.listenSubmitEvent = function(bannerItem){
    var submitBtn = bannerItem.find('.submit-btn');
    submitBtn.click(function(){
        var urlList = bannerItem.find('.thumbnail').attr('src').split('/');
        var thumbnail = urlList[urlList.length - 1];
        var link_to = bannerItem.find('input[name="link_to"]').val();
        var position = bannerItem.find('input[name="position"]').val();
        var in_use  = bannerItem.find('#in-use-select').val();
        myajax.post({
            'url': '/cms/banners/',
            'data': {
                'link_to': link_to,
                'position': position,
                'thumbnail': thumbnail,
                'in_use': in_use
            },
            'success': function(result){
                if(result['code'] === 200){
                    console.log(result)
                    myalert.alertSuccessToast('操作成功',function(){
                        console.log(1)
                        window.location.reload()
                    });
                }else{
                    myalert.alertErrorToast('操作失败')
                }
            }
        })

    })

}

Banners.prototype.addRemoveBannerEvent = function(bannerItem){
    var closeBtn = bannerItem.find('.close-btn');
    closeBtn.click(function(){
        bannerItem.remove();
    })

}

Banners.prototype.addImageSelectEvent = function(bannerItem){
    var self = this;
    var img = bannerItem.find('.thumbnail');
    var imgBtn = img.siblings('.image-input');
    img.click(function(){
        imgBtn.click();
    })
    imgBtn.change(self.ImgChange(imgBtn))
}


Banners.prototype.ImgChange = function(elem){
    elem.change(function(){
        var file = this.files[0];
        var formData = new FormData();
        formData.append('file', file)
        myajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false, //告诉jq不需要对data进行二次处理
            'contentType': false, //不需要更改contentType
            'success': function(result){
                if(result['code'] === 200){
                    var url = result['data']['url'];
                    elem.siblings('.thumbnail').attr('src', url);
                }
            }
        })
    })
}

var BandEvent = function(){
    $('.thumbnail').each(function(i,e){
        var imgBtn = $(e).siblings('.image-input')
        $(e).click(function(){
            imgBtn.click();
            imgBtn.change(ImgChange(imgBtn))
        })
    })
}

Banners.prototype.loadDate = function(){
    var self = this;
    myajax.get({
        'url': '/cms/banner_list/',
        'success': function(result){
            if(result['code'] === 200){
                var banners = result['data']
                for(var i=0; i < banners.length ; ++i){
                    var banner = banners[i]
                    self.createBannerItem(banner)
                }
            }
        }
    })
}

$(function () {
    var banners = new Banners();
    banners.run();

    // BandEvent();  # 为初始的轮播图注册事件
})