var Web = {
    clientWidth : document.documentElement.clientWidth,
    //clientHeight : document.documentElement.clientHeight
};
Web.nav = function (button, nav) {
    button.onclick = function (e) {
        if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            button.classList.remove('open');
            Base.ui.backdrop(false);
        } else {
            nav.classList.add('open');
            button.classList.add('open');
            Base.ui.backdrop(true);
        }
    };
    var items = nav.querySelectorAll('li');
    [].forEach.call(items, function (item) {
        item.onclick = function () {
            this.classList.toggle('open');
        };
    });
    return this;
};

Web.banner = function () {
    var swiper = new Swiper('#banner', {
        loop: true,
        speed:500,
        autoplay : {
            delay:3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    return this;
};

Web.introduction = function () {
    var navs = document.getElementById('nav2').querySelectorAll('a');
    var lists = document.getElementById('list').querySelectorAll('.item');
    var i = 0;
    var hove = 0;
    [].forEach.call(navs, function (nav) {
        nav.index = i;
        nav.onclick = function () {
            if (this.index!==hove) {
                this.classList.add('active');
                navs[hove].classList.remove('active');
                lists[this.index].classList.add('show');
                lists[hove].classList.remove('show');
                hove = this.index;
            }
        };
        i++;
    });
};
Web.map = function () {
    //创建和初始化地图函数：
    function initMap(){
        createMap();//创建地图
        setMapEvent();//设置地图事件
        addMapControl();//向地图添加控件
        addRemark();//向地图中添加文字标注
    }

    //创建地图函数：
    function createMap(){
        var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
        var point = new BMap.Point(108.840172,34.222701);//定义一个中心点坐标
        map.centerAndZoom(point,16);//设定地图的中心点和坐标并将地图显示在地图容器中
        window.map = map;//将map变量存储在全局
    }

    //地图事件设置函数：
    function setMapEvent(){
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
    }

    //地图控件添加函数：
    function addMapControl(){
        //向地图中添加缩放控件
        var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
        map.addControl(ctrl_nav);
        //向地图中添加缩略图控件
        var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
        map.addControl(ctrl_ove);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
        map.addControl(ctrl_sca);
    }

    //文字标注数组
    var lbPoints = [{point:"108.840262|34.222193",content:"西安高新国际会议中心"}
    ];
    //向地图中添加文字标注函数
    function addRemark(){
        for(var i=0;i<lbPoints.length;i++){
            var json = lbPoints[i];
            var p1 = json.point.split("|")[0];
            var p2 = json.point.split("|")[1];
            var label = new BMap.Label("<div style='padding:2px;'>"+json.content+"</div>",{point:new BMap.Point(p1,p2),offset:new BMap.Size(3,-6)});
            map.addOverlay(label);
            label.setStyle({borderColor:"#999"});
        }
    }

    initMap();//创建和初始化地图
};
Web.history = function () {
    if (this.clientWidth > 1024) {
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 6,
            spaceBetween: 10,
            navigation: {
                nextEl: '.next',
                prevEl: '.prev',
            },

        });
    } else {
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            spaceBetween: 10,
            navigation: {
                nextEl: '.next',
                prevEl: '.prev',
            },

        });
    }

};