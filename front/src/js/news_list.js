function CMSNewsList() {

}

CMSNewsList.prototype.initDatePicker = function(){
    var startPicker = $("#start-picker");
    var endPicker = $('#end-picker');
    var today = new Date();
    var todayStr = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();

    var options = {
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '2017/7/1',
        'endDate': todayStr,
        'language': 'zh-CN',
        'todayBtn': 'linked',  // 是否显示选择今天的按钮
        'todayHighlight': true,
        'clearBtn': true,
        'autoClose': true
    }

    startPicker.datepicker(options);
    endPicker.datepicker(options);
}

CMSNewsList.prototype.run = function () {
    this.initDatePicker();
}

$(function(){
    var newsList = new CMSNewsList();
    newsList.run();
})