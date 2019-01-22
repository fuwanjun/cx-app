function getQueryString(name,noUnescape) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);     //window.location控制获取当前页面的URL参数

    noUnescape = noUnescape == undefined ? false : noUnescape;
    if(noUnescape){
        if (r != null) return r[2]; return null;
    }
    else{
        if (r != null) return unescape(r[2]); return null;
    }
}