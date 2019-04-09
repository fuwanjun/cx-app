! function(t) {
    var e = 10,
        i = t.document,
        n = i.documentElement,
        o = "orientationchange" in t ? "orientationchange" : "resize",
        a = function t() {
            var i = n.getBoundingClientRect().width;
            return n.style.fontSize = 5 * Math.max(Math.min(20 * (i / e), 20), 8.55) + "px", t
        }();
    n.setAttribute("data-dpr", t.navigator.appVersion.match(/iphone/gi) ? t.devicePixelRatio : 1), /iP(hone|od|ad)/.test(t.navigator.userAgent) && (i.documentElement.classList.add("ios"), parseInt(t.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1], 10) >= 8 && i.documentElement.classList.add("hairline")), i.addEventListener && (t.addEventListener(o, a, !1), i.addEventListener("DOMContentLoaded", a, !1))
}(window);

mui("body").on("tap","a",function(){
	window.location.href=this.href;
});
// var globalUrl="http://www.changwash.com:8088";
var globalUrl="http://user.changwash.com:8088";
// var globalUrl="http://192.168.3.211:8081";
// var globalUrl='http://192.168.3.191:8081';

var headUrl="http://10.0.0.228:8080/image/";
// var wxUrl="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx31fd1e1bad23db37&redirect_uri=http%3a%2f%2fwww.changwash.com%2fapp%2fuser%2fview%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
var wxUrl="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5fa77022c03fce4a&redirect_uri=http%3a%2f%2fuser.changwash.com%2fapp%2fuser%2fview%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
//tab切换
function tabChange(tab,tabActive,con,conActive,id){
	tab.eq(id).addClass(tabActive).siblings().removeClass(tabActive);
	con.eq(id).addClass(conActive).siblings().removeClass(conActive);
}
var userId=$.cookie('userId');
function clearItem(){
	$.ajax({
		url:globalUrl+'/orderform/deleteAllCartByUserId',
		type:'get',
		data:{
			userId:userId
		},
		success:function(data){
			console.log(data);
		}
	})
}

//页面载入时获取历史购物车中的商品数量和总价
function hisNum(){
	$.ajax({
		url:globalUrl+'/orderform/getCartsByUserId',
		type:'get',
		data:{userId:userId},
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
        crossDomain: true,
		success:function(data){
			console.log(data);
			var hisNum=0;
			var hisPrice=0;
			for(var i=0;i<data.length;i++){
				 hisNum+=parseFloat(data[i].commodityCount);
				 hisPrice+=parseFloat(data[i].price);
			}
			$("#item-num").html(hisNum);
			$("#all-price span").html(hisPrice.toFixed(2));
		}
	});
	if($("#item-num").html()==0){
		$(this).css("display","none");
	}else{
		$(this).css("display","block");
	}
}

//时间戳转时间
function timestampToTime(timestamp) {
    var date = new Date(timestamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
}

/**
 * 获取当前时间 年-月-日
 * @returns {string}
 */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/**
 * 获取当前时间 月-日
 * @param href
 */
function getNowFormatDateMonth() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate =month +"-"+ strDate;
    return currentdate;
}


//页面跳转
function pageGo(href){
	window.location.href=href;
}

// 验证手机号
function isPhoneNo(phone) { 
	var pattern = /^1[34578]\d{9}$/; 
	return pattern.test(phone); 
}

//页面加载动画
function load(){
	var mask='<div style="width:100%;height:100%;background:rgba(0,0,0,0.3); z-index:100000;position:absolute;top:0;left:0;">'+
				'<div style="width:0.25rem;height:0.25rem; margin:50% auto;"><span style="" class="mui-spinner"></span></div>'+
			  '<div>';
	$(mask).appendTo($("body"));
}

function enAjax(url,type,async,data,success,error,handle){
    handle=handle?handle:false;
	pageLoad("block");
	try{
		$.ajax({
		url:url,
		type:type,
		async:async,
		data:data,
		beforeSend: function (xhr) {
			xhr.setRequestHeader("token", $.cookie("token"));
		},

		crossDomain: true,
		success:function(data){
			removeMask();
                if(!handle&&data.code==401||data.code==101){
                    window.location.href=wxUrl;
                    return false;
                }
//			console.log(data)
                success(data);

		},
		error:function(data){
			removeMask();
			error(data)
		}
	})
	}catch(e){
		removeMask();
	}
	
}
function enAjax2(url,type,async,data,success,error,handle){
    handle=handle?handle:false;
    try{
        $.ajax({
            url:url,
            type:type,
            async:async,
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", $.cookie("token"));
            },
            crossDomain: true,
            success:function(data){
                if(!handle&&data.code==401){
                    window.location.href=wxUrl;
                    return false;
                }
//			console.log(data)
                success(data);

            },
            error:function(data){
                removeMask();
            }
        })
    }catch(e){}
}
function enAjaxPicker(url,type,async,data,success,error){
    handle=handle?handle:false;
    pageLoad("block");
    try{
        $.ajax({
            url:url,
            type:type,
            async:async,
            data:data,
            crossDomain: true,
            success:function(data){
                removeMask();
                success(data);

            },
            error:function(data){
                removeMask();
            }
        })
    }catch(e){
        removeMask();
    }
}

function contentAjax(url,type,async,data,success){
	pageLoad();
	try{
		$.ajax({
		contentType:"application/json;charset=UTF-8",
		url:url,
		async:async,
		type:type,
		data:data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
        },
            crossDomain: true,
            success:function(data){
                removeMask();
			success(data);
		},
		error:function(data){
			removeMask();
//			error(data)
		}
	})
	}catch(e){
		removeMask();
	}
	removeMask();
}
function contentAjax2(url,type,async,data,success,error,handle){
    try{
        $.ajax({
            contentType:"application/json;charset=UTF-8",
            url:url,
            async:async,
            type:type,
            data:data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("token", $.cookie("token"));
            },
            crossDomain: true,
            success:function(data){
                removeMask();
                success(data);
            },
            error:function(data){
                removeMask();
//			error(data)
            }
        })
    }catch(e){}
}

function pageLoad(status){
	var mask='<div id="mask2" style="display:'+status+';width:100%;height:100%;background:rgba(0,0,0,0.3); z-index:100000;position:absolute;top:0;left:0;">'+
				'<div style="width:1rem;height:1rem; margin:50% auto;"><span style="width:1rem;height:1rem;" class="mui-spinner"></span></div>'+
			  '<div>';
	$(mask).appendTo($("body"));
}

function removeMask(){
	$("#mask2").remove();
}


function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}

function urlencode(str, charset, callback) {
    //创建form通过accept-charset做encode
    var form = document.createElement('form');
    form.method = 'get';
    form.style.display = 'none';
    form.acceptCharset = charset;
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'str';
    input.value = str;


    window._urlEncode_iframe_callback = callback;
    //设置回调编码页面的地址，这里需要用户修改
    form.action = 'getEncodeStr.html';
    form.submit();
    setTimeout(function() {
        form.parentNode.removeChild(form);
        iframe.parentNode.removeChild(iframe);
    }, 500)

}


function toUtf8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}

function EncodeUtf8(s1) {
    var s = escape(s1).replace(/\%u/g,"&#x");
    return s;
}

function codeTrans(r){
    var p1=/([0-9])((<[^<]*>)*[\u4e00-\u9fa5]+)/gi;
    r=r.replace(p1, "$1 $2");
    var p2=/([\u4e00-\u9fa5]+(<[^<]*>)*)([0-9])/gi;
    r=r.replace(p2, "$1 $3");
    return r;
}

function codeTrans2(r){
    var p1=/([0-9])((<[^<]*>)*[A-Za-z]+)/gi;
    r=r.replace(p1, "$1 $2");
    var p2=/([A-Za-z]+(<[^<]*>)*)([0-9])/gi;
    r=r.replace(p2, "$1 $3");
    return r;
}
function codeTrans3(r){
    var p1=/([\u4e00-\u9fa5])((<[^<]*>)*[A-Za-z]+)/gi;
    r=r.replace(p1, "$1 $2");
    var p2=/([A-Za-z]+(<[^<]*>)*)([\u4e00-\u9fa5])/gi;
    r=r.replace(p2, "$1 $3");
    return r;
}

function Division(r){
    _.replace(r,/\d+/,function(item){
        return " "+item+" "
    })
}


//微信回退刷新页面数据
function weixinReload(){
    $(function () {
        var isPageHide = false;
        window.addEventListener('pageshow', function () {
            if (isPageHide) {
                window.location.reload();
            }
        });
        window.addEventListener('pagehide', function () {
            isPageHide = true;
        });
    });
}
