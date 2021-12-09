$(function(){

    $('#bodyHtml a').attr('href', 'javascript:void(0);');
    $('#bodyHtml form').attr('onsubmit', 'return false;');

    /*是否显示选取代码的功能*/
    var body = $('body').html();
    if (0 <= body.indexOf("<!-- html-start -->")) {
        $('#btn_html').show();
    } else {
        $('#btn_html').hide();
    }
    if (0 <= body.indexOf("<!-- css-start -->")) {
        $('#btn_css').show();
    } else {
        $('#btn_css').hide();
    }
    if (0 <= body.indexOf("<!-- js-start -->")) {
        $('#btn_js').show();
    } else {
        $('#btn_js').hide();
    }

    function get_iframe_code(type, obj)
    {
        layer_loading('正在提取');
        var _this = obj;
        var aid = $('input[name=aid]').val();
        var url = eyou_basefile + "?m=api&c=Ajaxzjk&a=ajax_getIframeCode";
        $.ajax({
            type : 'post',
            url : url,
            data : {aid:aid, type:type, _ajax:1},
            dataType : 'json',
            success : function(res){
                layer.closeAll();
                if(res.code == 1){
                    if (res.data.is_admin && 1 == res.data.is_admin) {
                        layer.alert(res.data.msg, {icon: 2, title: false, closeBtn: false});
                    }

                    /*
                    var start = htmlcode.indexOf("<!-- "+type+"-start -->");
                    var end = htmlcode.indexOf("<!-- "+type+"-end -->");
                    var content = htmlcode.substring(start,end);
                    content = content.replace(/\t/g,"    "); // 一个制表符替换4个空格
                    content = content.replace("<!-- "+type+"-start -->", "");

                    if (type == 'css') {
                        content = content.replace("<style type=\"text/css\">", "");
                        content = content.replace("<style type=\'text/css\'>", "");
                        content = content.replace("</style>", "");
                    }
                    */
                   
                    var content = res.data.htmlcode;

                    /*替换自定义颜色值*/
                    var colorTotal = $('input[name=colorTotal]').val();
                    if (colorTotal > 0) {
                        var colorListObj = $("input[name='color[]']");
                        if (colorListObj && 0 < colorListObj.length) {
                            $.each(colorListObj, function(index, item){
                                color_val = $(item).val();
                                var regS = new RegExp("\{\\$eyou.theme.color"+(index+1)+"\\|default=(\'|\")(\#(.*))(\'|\")\}", "g");
                                content = content.replace(regS, color_val);
                            });
                        }
                    } else {
                        var regS = new RegExp("\{\\$eyou.theme.color(\\d+)\\|default=(\'|\")(\#(.*))(\'|\")\}", "g");
                        content = content.replace(regS, "#$4");
                    }
                    /*end*/
                    layer.open({
                        type: 1,
                        id: 'layui-layer_clipboard',
                        title: $(_this).text(),
                        skin: 'layui-layer-rim', //加上边框
                        area: ['80%', '80%'], //宽高
                        btn: ['<font class="clipboard_code">复制代码</font>'],
                        content: '<xmp>'+content+'</xmp>',
                        yes: function(index, layero){
                            showtext('clipboard_code', content);
                        }
                    });
                }else{
                    if (res.data) {
                        if (res.data.is_login == 0) {
                            layer.alert(res.msg, {icon: 5, title: false}, function(index){
                                layer.close(index);
                                layerLogin();
                            });
                        } else if (res.data.is_level && res.data.is_level == 1) {
                            layer.alert(res.msg, {icon: 5, title: false, btn: ['立即升级']}, function(index){
                                layer.close(index);
                                layer.msg('已在新窗口打开新页面！', {time: 3000});
                                window.open(res.data.gourl);
                            });
                        }
                    } else {
                        layer.alert(res.msg, {icon: 5, title: false, closeBtn: false});
                    }
                }
            },
            error: function(e){
                layer.closeAll();
                showErrorAlert(e.responseText);
            }
        });
    }

    $('#btn_html').click(function(){
        get_iframe_code('html', this);
    });

    $('#btn_css').click(function(){
        get_iframe_code('css', this);
    });

    $('#btn_js').click(function(){
        get_iframe_code('js', this);
    });
    /*end*/

    /*是否显示颜色选择功能*/
    showhideColorTheme('css');
    // 颜色选择 - 初始化触发单击事件
    $('.ey_picker_1614064291').trigger('click');
    /*end*/
});

function layerLogin()
{
    //iframe窗
    layer.open({
        type: 2,
        id: 'iframe_userLogin',
        title: false,//'会员登录',
        fixed: true, //不固定
        shadeClose: false,
        shade: 0.3,
        maxmin: false, //开启最大化最小化按钮
        area: ['410px','450px'],
        content: eyou_basefile + "?m=user&c=Users&a=eylogin"
    });
}

function winopenQQLogin(referurl)
{
    window.location.href = 'https://www.eyoucms.com/qqLogin/index.php?gourl='+referurl;
}

/**
 * 封装的加载层
 */
function layer_loading(msg){
    var loading = layer.msg(
    msg+'...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请勿刷新页面', 
    {
        icon: 1,
        time: 3600000, //1小时后后自动关闭
        shade: [0.2] //0.1透明度的白色背景
    });
    //loading层
    var index = layer.load(3, {
        shade: [0.1,'#fff'] //0.1透明度的白色背景
    });

    return loading;
}

function showhideColorTheme(type)
{
    var aid = $('input[name=aid]').val();
    var url = eyou_basefile + "?m=api&c=Ajaxzjk&a=ajax_getShowhideColorTheme";
    if (ey_getUrlParam('doget') != null) {
        url += '&doget=1&clear=1';
    }
    $.ajax({
        type : 'post',
        url : url,
        data : {aid:aid, type:type, _ajax:1},
        dataType : 'json',
        success : function(res){
            if(res.code == 1){
                var colorNum = res.data.colorNum;
                if (colorNum > 0) {
                    // 设置默认值
                    if (res.data.colorListLen > 0) {
                        $.each(res.data.colorList, function(index, color){
                            $('#color_'+index+'_1614064291').val(color).css('border-color', color);
                        });
                    }

                    // 移除多余的颜色选择框
                    for (var i = colorNum + 1; i <= 5; i++) {
                        $('#color_'+i+'_1614064291').remove();
                    }

                    $('#ey_formSubmit').show();
                }

                /*
                var start = htmlcode.indexOf("<!-- "+type+"-start -->");
                var end = htmlcode.indexOf("<!-- "+type+"-end -->");
                var content = htmlcode.substring(start,end);

                var colorNum = 0;
                if (content.indexOf("{$eyou.theme.color5|") != -1) {
                    colorNum = 5;
                } else if (content.indexOf("{$eyou.theme.color4|") != -1) {
                    colorNum = 4;
                } else if (content.indexOf("{$eyou.theme.color3|") != -1) {
                    colorNum = 3;
                } else if (content.indexOf("{$eyou.theme.color2|") != -1) {
                    colorNum = 2;
                } else if (content.indexOf("{$eyou.theme.color1|") != -1) {
                    colorNum = 1;
                }
               
                if (colorNum > 0) {
                    // 设置默认值
                    if (ey_getUrlParam('doget') == null) {
                        for (var i = 1; i <= colorNum; i++) {
                            var reg2 = new RegExp("\{\\$eyou.theme.color"+i+"\\|default=(\'|\")(\#(.*))(\'|\")\}");
                            matchs = content.match(reg2);
                            if (matchs[2]) {
                                $('#color_'+i+'_1614064291').val(matchs[2]).css('border-color', matchs[2]);
                            }
                        }
                    }

                    // 移除多余的颜色选择框
                    for (var i = colorNum + 1; i <= 5; i++) {
                        $('#color_'+i+'_1614064291').remove();
                    }

                    $('#ey_formSubmit').show();
                }
                */

            }else{
                showErrorMsg(res.msg);
            }
        },
        error: function(e){
            showErrorAlert(e.responseText);
        }
    });
}

// 提交颜色表单
function submitForm(obj, type)
{
    layer_loading('正在处理');
    var url = $('#ey_formSubmit').attr('data-action');
    if (type == 'save') {
        if (url.indexOf('?') > -1) {
            url += '&';
        } else {
            url += '?';
        }
        var inputObjs = $('#ey_formSubmit input[type=text]');
        for( var i=0; i<inputObjs.length; i++ ){
            color_val = inputObjs[i].value.replace("#", "");
            color_val = $.trim(color_val);
            url += inputObjs[i].name + "=" + color_val + "&";
        }
        url += "doget=1&clear=1";
    }
    window.location.href = url;
}

function picker_select(obj){
    // 颜色选择
    var $target = obj.colorPickerElement = $(obj);
    $target.colpick({
        flat:false,
        layout:'rgbhex',
        submit:0,
        colorScheme:'light',
        color: $target.val(),
        onChange:function(hsb,hex,rgb,el,bySetColor) {
            $(el).css('border-color','#'+hex);
            // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
            if(!bySetColor) {
                color = '#'+hex;
                $(el).val(color);
            }
        }
    }).keyup(function(){
        color = '#'+this.value.replace('#', '');
        $(this).colpickSetColor(color);
    });
}

function showtext(classname, content){
    var clipboard1 = new Clipboard("."+classname, {
        text: function() {
            return content;
        }
    });
    clipboard1.on("success", function(e) {
        layer.closeAll();
        layer.msg("复制成功", {time:1000});
    });
    clipboard1.on("error", function(e) {
        layer.msg("复制失败！请手动复制", {icon:5});
    }); 
}

/**
 * 获取url参数值的方法
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function ey_getUrlParam(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}

/**
 * 屏蔽筛选的点击事件
 */
function ey_97c0670026ad69b846ea069ffdb217a9(obj)
{
    return false;
}