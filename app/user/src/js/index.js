var code = getQueryString('code');
var state = getQueryString('state');
var token = $.cookie('token');
var leftArea = $("#area-name").html();
var first = getQueryString("first");
if (first == 0) {
    $("#beforeLogin").show();
}
if (!$.cookie('nowPlace')) {
    $.cookie('nowPlace', EncodeUtf8(leftArea), {path: "/"});
    $("#area-name").html($.cookie('nowPlace'));
} else {
    $("#area-name").html($.cookie('nowPlace'));
}
if ($.cookie("now")) {
    $("#nowCity").html($.cookie("now"));
    $("title").html("常洗-" + $("#nowCity").html() + "站");
}

if (!token && !code) {
    // debugger;
    window.location.href = wxUrl;

} else if (code && !token) {
    var url = globalUrl + '/wechat/wxLogin';
    var data = {code: code};
    enAjax(url, 'get', true, data, getInfo, null, true);
}

getBooks();

//关闭弹窗
$(".close-pop").on("tap", function () {
    $("#beforeLogin").hide();
    window.location.href = "index.html";
});



var url = globalUrl + '/rotationMap/getRotaionMapAll';
enAjax(url, 'get', false, {type: 'HOME'}, turnPics, null, true);

var gallery = mui('.mui-slider');
gallery.slider({
    interval: 4000//自动轮播周期，若为0则不自动播放，默认为0；
});

//获取轮播图
function turnPics(data) {
    var banner1 = '<div class="mui-slider-item"><div class="item-pic"><img src="http://' + data.data[0].imgUrl + '" alt="" /></div></div>';
    var banner2 = '<div class="mui-slider-item"><div class="item-pic"><img src="http://' + data.data[data.data.length - 1].imgUrl + '" alt="" /></div></div>';
    for (var i = 0; i < data.data.length; i++) {
        var item = '<div class="mui-slider-item"><div class="item-pic"><img src="http://' + data.data[i].imgUrl + '" alt="" /></div></div>';
        $(item).appendTo($("#banner-turn"));
        var mark = '<div class="mui-indicator"></div>';
        $(mark).appendTo($("#banner-mark"));
    }
    $(banner1).appendTo($("#banner-turn"));
    $(banner2).prependTo($("#banner-turn"));
    $("#banner-mark .mui-indicator").eq(0).addClass("mui-active");
}

function getInfo(data) {
    // debugger
    console.log(data);
    var reloadPage = false;


    var nickName = EncodeUtf8(data.data.userInfo.userName);
    var sex = EncodeUtf8(data.data.userInfo.sex);
    $.cookie("token", data.data.token);
    $.cookie("id",data.data.userInfo.id);
    $.cookie("headImgUrl", data.data.userInfo.userPicture);
    $.cookie("nickName", nickName);
    $.cookie("userSex", sex);
    $.cookie("userId", data.data.userInfo.userId);
    $.cookie("phoneNum", data.data.userInfo.phone, {path: "/"});
    if(data.data.userInfo.fixedQrcode){
        $.cookie("qrCode", data.data.userInfo.fixedQrcode, {path: "/"});
    }
    if (!reloadPage) {
        var reloadUrl = "index.html";
        if (data.data && data.data.first) {
            reloadUrl += "?first=0";
        }
        window.location.href = reloadUrl;
    }
}

function getBooks(){
    enAjax2(globalUrl+"/introduce/getListForApp",'get',true,{},function(data){
        if(data.code==0){
            $(".pics3").html("");
            for(var i=0;i<data.data.length;i++){
                var item='<li>' +
                    '<a href="books.html?id='+data.data[i].id+'">' +
                    '<div class="pic"><img src="http://'+data.data[i].picture+'" alt="" /></div>' +
                    '<p class="pic-text">'+data.data[i].title+'</p>' +
                    '</a>' +
                    '</li>';
                $(item).appendTo($(".pics3"))
            }
        }
    })
}

var urlVip = globalUrl + "/userInfo/checkState";
enAjax2(urlVip, 'get', true, {}, function (data) {
    if (data.data.state == 'NORMAL') {
        $("#pageMask").hide();
    } else if(data.data.state == 'DELETED'){
        $("#pageMask").show();
    }
}, null, false);
