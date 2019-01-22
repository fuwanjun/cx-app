//mui.init()
var account=JSON.parse($.cookie("toker")).account;
var id=JSON.parse($.cookie("toker")).id;
var token=$.cookie("token");
var page=1;
mui(".sortBox").on("tap","div",function(){
    jQuery(this).addClass("sort-active").siblings().removeClass("sort-active");
});
$(function(){
    $(".list").height(window.screen.height-$(".top-header").height()-44);
    ajaxInit(account);
    commentList(page);
});

function ajaxInit(account_fake){
    if(!token){
        window.location.href="login.html";
        return false;
    }
    $.ajax({
        type:"get",
        url:globalUrl+"takeUser/getTakerByAccount",
        dataType:"json",
        data:{account:account_fake},
        async:true,
        beforeSend:function(request){
            request.setRequestHeader("token",token);
        },
        success:function(res){
            if(res.message){
                mui.toast(res.message);
                setTimeout(
                    function(){
                        window.location.href="login.html"
                    },2000
                )

            }else{
                if(res){
                    $(".level_number").text(res.level);
                    switch (res.level){
                        case "0":
                            var str1='';
                            for(var i=0;i<5;i++){
                                str1+='<img src="img/star_no.png" alt="" />'
                            }
                            $(".level").html(str1);
                            break;
                        case "1":
                            var str2='<img src="img/star_yes.png" alt="" />';
                            for(var i=0;i<4;i++){
                                str2+='<img src="img/star_no.png" alt="" />'
                            }
                            $(".level").html(str1);
                            break;
                        case "2":
                            var str3='<img src="img/star_yes.png" alt="" /><img src="img/star_yes.png" alt="" />';
                            for(var i=0;i<3;i++){
                                str3+='<img src="img/star_no.png" alt="" />'
                            }
                            $(".level").html(str3);
                            break;
                        case "3":
                            var str4='';
                            for(var i=0;i<3;i++){
                                str4+='<img src="img/star_yes.png" alt="" />'
                            }
                            str4+='<img src="img/star_no.png" alt="" /><img src="img/star_no.png" alt="" />'
                            $(".level").html(str4);
                            break;
                        case "4":
                            var str5='';
                            for(var i=0;i<4;i++){
                                str5+='<img src="img/star_yes.png" alt="" />'
                            }
                            str5+='<img src="img/star_no.png" alt="" />'
                            $(".level").html(str5);
                            break;
                        case "5":
                            var str6='';
                            for(var i=0;i<5;i++){
                                str6+='<img src="img/star_yes.png" alt="" />'
                            }
                            $(".level").html(str6);
                            break;
                        default:
                            break;
                    }
                }
            }

        },
        error:function(err){
            console.log(err)
        }
    });
}
function commentList(page_fake){
    if(!token){
        window.location.href="login.html";
        return false;
    }
    $.ajax({
        type:"get",
        url:globalUrl+"takeUser/getEvaluateByTakerId",
        data:{page:page_fake,takerId:id},
        async:true,
        beforeSend:function(request){
            request.setRequestHeader("token",token);
        },
        success:function(res){

            if(res.message){
                mui.toast(res.message);
                setTimeout(function(){window.location.href="login.html";},1000)
            }else{
                var str="";
                if(res.total==0){
                    $(".listBody").html('<div class="padding-r20 mui-text-center">暂无用户评价过你</div>');
                }else{
                    $.each(res.list, function(index,val) {
                        var d=new Date(val.createTime);
                        str+='<div class="bg-white padding-r12 rider-content" style="margin: .1rem;border-radius: 0.05rem;">'
                        str+='<div class="mui-flex rider-content-flex mui-flex-halign-center">'
                        str+='<div class="contentLi mui-flex-halign-center mui-flex">'
                        str+='<img src="img/head.png"/>'
                        str+='<span class="font-size-14">匿名用户</span>'
                        str+='</div>'
                        str+='<div class="font-size-14 color-666">'+formatDate(d)+'</div>'
                        str+='</div>'
                        str+='<div class="font-size-14 color-666 server-satisfaction">配送服务：'+val.degree+'</div>'
                        str+='</div>'
                    });
                    $(".listBody").append(str);
                    page++;
                    if(res.list.length<5){
                        stopBol=1;
                    }
                }

            }
        }
    });
}
//getEvaluateByTakerId

var stopBol=0;
$(".list").scroll(function(){
    var winHeight=$(".list").height();
    if(winHeight+$(".list").scrollTop()>=$(".listBody").height()){
        if(stopBol==0){
            commentList(page)
        }
    }
})