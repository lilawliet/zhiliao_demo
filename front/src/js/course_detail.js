function CourseDetail(){}

CourseDetail.prototype.run = function(){
    this.initPlayer();
}

CourseDetail.prototype.initPlayer = function(){
    var videoInfoSpan = $("#video_info");
    var videoUrl = videoInfoSpan.attr('data-video-url');
    var coverUrl = videoInfoSpan.attr('data-cover-url');
    var player = cyberplayer("playercontainer").setup({
        width : '100%',
        height : '100%',
        file : videoUrl,
        image: coverUrl,
        stretching: 'uniform',
        autoStart : false,
        repeat : false,
        volume : 100,
        controls : true,
        tokenBinding: true,
        ak: '9971f77157eb434bbd21b25e6bf399cc'
        });

    player.on('beforePlay',function (e) {
        if (!/m3u8/.test(e.file)) {
            return;
        }
        myajax.get({
            'url': '/course/course_token/',
            'data': {
                'video': videoUrl
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var token = result['data']['token'];
                    player.setToken(e.file, token);
                } else {
                    window.messageBox.showInfo(result['message']);
                    player.stop();
                }
            },
            'fail': function (error) {
                console.log(error);
            }
        });
    })
}

$(function(){
    var courseDetail = new CourseDetail();
    courseDetail.run();
})