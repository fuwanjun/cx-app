var gUrl="http://192.168.1.82:8081/";
$(function(){
    $(".city").on("tap",function(){
        let picker = new mui.PopPicker({
            layer:3
        });
        picker.setData(cityData3);
        picker.show(function(item){
            let itemArea=item[0].text+"-"+item[1].text+"-"+item[2].text;
            $("#region").html(itemArea);
        })
    });
});

$(".registerBtn").on("tap",function(){
    var spreadNum=$("#spreadNum").val();
    var userName=$("#userName").val();
    var phone=$("#phone").val();
    var password=$("#password").val();
    var region=$("#region").html();
    var addressDetail=$("#addressDetail").val();

    checkEmpty(userName,'请输入联系人');
    checkEmpty(password,'请输入密码');
    if(!phone){
        mui.toast('请输入手机号');
    }else{
        if(!isPhoneNo(phone)){
            mui.toast('手机号格式错误');
            return
        }
    }
    checkEmpty(region,'请选择区域');
    checkEmpty(addressDetail,'请输入详细地址');

    var registerData={spreadNum:spreadNum,
        userName:userName,
        phone:phone,
        password:password,
        region:region,
        addressDetail:addressDetail,
    };
    register(registerData);
});

$("#phone").on("blur",function(){
    if($("#phone").val()!=""){
        var phoneNum=$("#phone").val();
        checkPhone(phoneNum);
    }
});


//验证手机号是否可用
function checkPhone(num){
    $.ajax({
        url:shopUrl+"storePoint/check",
        type:"post",
        data:{phone:num},
        crossDomain: true,
        success:function(res){
            if(!res){
                $("#phone").val("").focus();
                mui.toast('该手机号已被注册');
            }
        }
    })
}

function register(data){
    $.ajax({
        url:shopUrl+"storePoint/register",
        type:"post",
        data:data,
        crossDomain: true,
        success:function(res){
            if(res.status==200){
                mui.toast(res.msg);
                window.location.href='shop-login.html';
            }else{
                mui.toast(res.msg);
            }
        }
    })
}

function checkEmpty(con,text){
    if(!con){
        mui.toast(text);
        return
    }
}