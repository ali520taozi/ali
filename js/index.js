window.onload = function () {
    setRem();
    window.addEventListener("onorientationchange" in window ? "orientationchange":"resize",function(){
        setRem();
    });
    function setRem(){
        var html = document.querySelector("html");
        var width = html.getBoundingClientRect().width;
        html.style.fontSize = width/10.8 +"px";
    }
    //点透事件的处理
    togle();
    function togle() {
        var cansel = document.querySelector('#menu-nav');
        var navList = document.querySelector('#nav');
        cansel.addEventListener('touchstart',function (ev) {
            ev.stopPropagation();
            if(this.className == 'menu-list'){
                this.className = 'menu-cansel';
                navList.style.display = 'block';
            }else {
                this.className = 'menu-list';
                navList.style.display = 'none';
            }
            // this.classList.toggle('menu-cansel')
        });
        document.addEventListener('touchstart',function () {
            if(cansel.className == 'menu-cansel'){
                cansel.className = 'menu-list';
                navList.style.display = 'none';
            }
            // cansel.classList.toggle('menu-cansel');
        });
        navList.addEventListener('touchstart',function (ev) {
            ev.stopPropagation();
        })
    }
    //滚动
    hiddeSeach();
    function hiddeSeach() {
        var wrap = document.querySelector('#wrap');
        var oApp = document.querySelector("#search");
        var scrollTop = wrap.scrollTop;
        wrap.addEventListener('touchmove',function () {
            scrollTop = wrap.scrollTop;
            if(scrollTop!=0) {
                oApp.style.display='none';
            }else {
                oApp.style.display='block';
            }
        });
    }
    //滑动导航
    dragNav();
    function dragNav() {
        var navScroll = document.querySelector('#navScroll');
        var navs = document.querySelector('#navs');
        var start = 0;
        //偏移量
        var offLeft = 0;
        //拉动留白的比例，形成橡皮筋效果
        var flag = 1;

        //上一次的位置
        var lastDis = 0;
        //上一次的时间值
        var lastTime = 0;
        //距离的差值
        var disVal=0;
        //时间差值
        var disTime =0;

        var minLeft = navScroll.clientWidth - navs.offsetWidth;
        navScroll.addEventListener('touchstart',function (ev) {
            start = ev.changedTouches[0].clientX;
            offLeft = cssTransform(navs,'translateX');
            lastDis = offLeft;
            lastTime = new Date().getTime();
        });
        navScroll.addEventListener('touchmove',function (ev) {
            var end = ev.changedTouches[0].clientX;
            var nowTime = new Date().getTime();
            var left = end-start + offLeft;
            if(left > 0 ){
                flag = 1.2-left/ (navScroll.clientWidth*2);
                left = flag*left;
            }
            if(left<minLeft){
                var over = minLeft - left;
                flag = 1.2-over/(navScroll.clientWidth*2);
                left = minLeft - over*flag;
            }
            disVal= left - lastDis;
            //时间差值
            disTime = nowTime - lastTime;
            lastDis = left;
            lastTime = disTime;
            cssTransform(navs,'translateX',left);
        });
        navScroll.addEventListener('touchend',function (ev) {
            var speed = disVal/disTime;
            var translateX = cssTransform(navs, 'translateX');
            var traget = translateX+ speed*300;
            var time = Math.abs(traget*3);
            time = time < 300?300:time;
            var bessel ="";
            if(traget>0){
                traget = 0;
                bessel ="cubic-bezier(.12,.39,.61,1.75)";
            }
            if(traget<minLeft){
                traget = minLeft;
                bessel ="cubic-bezier(.12,.39,.61,1.75)";
            }
            navs.style.transition=time+"ms "+bessel;
            cssTransform(navs,"translateX",traget);
        })
    }
    /*轮播*/
    carousel();
    function carousel() {
        document.addEventListener('touchstart', function (ev) {
            ev.preventDefault();
        });
        var wrap = document.querySelector("#wapper");
        var list = document.querySelector("#list");
        list.innerHTML += list.innerHTML;
        var lis = document.querySelectorAll("#list li");
        var nav = document.querySelectorAll(".nav span");
        list.style.width = lis.length + '00%';
        for (var i = 0; i < lis.length; i++) {
             lis[i].style.width = (1/lis.length*100) + '%';
        }
        wrap.style.height = lis[0].offsetHeight + 'px';
        var start = 0;
        var end = 0;
        var startX = 0;
        var now = 0;//图的下标以及导航点的下标
        var clearTime = null;
        var disY = 0;
        var startY = 0;
        var isFirst = true;
        var isX = true;
        aoto();
        cssTransform(list, 'translateX', 0);
        wrap.addEventListener('touchstart', function (ev) {
            clearInterval(clearTime);
            list.style.transition = 'none';
            if (now == 0) {
                now = nav.length;
            }
            if (now == lis.length - 1) {
                now = nav.length - 1;
            }
            cssTransform(list, 'translateX', -now * wrap.offsetWidth);
            start = ev.changedTouches[0].clientX;
            startY = ev.changedTouches[0].clientY;
            startX = cssTransform(list, 'translateX');
            isFirst = true;
            isX = true;
        });
        wrap.addEventListener('touchmove', function (ev) {
            end = ev.changedTouches[0].clientX;
            disY = ev.changedTouches[0].clientY;
            if(!isX){
                return;
            }
            if(isFirst){
                isFirst = false;
                if(Math.abs(disY-startY) > Math.abs(end-start)){
                    isX = false;
                    return;
                }
            }
            cssTransform(list, 'translateX', startX + (end - start));
        });
        wrap.addEventListener('touchend', function () {
            var offsetX = cssTransform(list, 'translateX');
            now = Math.round(-offsetX / wrap.offsetWidth);
            if (now < 0) {
                now = 0;
            }
            if (now > lis.length - 1) {
                now = lis.length - 1;
            }
            aotoMove();
            aoto();
//					cssTransform(list,'translateX',-now*wrap.offsetWidth)
//					for (var i=0;i<nav.length;i++) {
//						nav[i].className = 'none';
//					}
//					nav[now%nav.length].className = 'active';
        });

        function aoto() {
            clearTime = setInterval(function () {
                if (now == lis.length - 1) {
                    list.style.transition = 'none';
                    now = nav.length - 1;
                    cssTransform(list, 'translateX', -now * wrap.offsetWidth)
                }
                setTimeout(function () {
                    now++;
                    aotoMove();
                }, 20)
            }, 2000)
        }

        function aotoMove() {
            list.style.transition = '1s';
            cssTransform(list, 'translateX', -now * wrap.offsetWidth);
            for (var i = 0; i < nav.length; i++) {
                nav[i].className = 'none';
            }
            nav[now % nav.length].className = 'active';
        }
    }
    /*选项卡切换*/
    tab();
    function tab() {
        var tabList = document.querySelectorAll('.tab-list');
        var tabNav = document.querySelectorAll('.tab-nav');
        var loding = document.querySelectorAll('.loding');
        var translateX = tabNav[0].offsetWidth;
        for (var i = 0; i < tabNav.length; i++) {
            swipe(tabList[i],tabNav[i]);
        }
        function swipe(list,nav) {
            cssTransform(list,"translateX",-translateX);
            var startpoint =0;
            var startX=0;
            var isX =true;
            var isFirst =true;
            var isLoding= true;
            list.addEventListener("touchstart",function(ev){
                if(!isLoding){
                    return;
                }
                var touch =ev.changedTouches[0];
                startpoint = touch;
                startX= cssTransform(list,"translateX");
                isX =true;
                isFirst = true;
                isFirst =true;
            });
            list.addEventListener("touchmove",function(ev){
                if(!isLoding){
                    return;
                }
                if(!isX){
                    return;
                }
                var touch =ev.changedTouches[0];
                var nowpoint=touch;
                var disX =nowpoint.clientX -startpoint.clientX;
                var disY =nowpoint.clientY -startpoint.clientY;
                if(isFirst){
                    isFirst = false;
                    if(Math.abs(disY)>Math.abs(disX)){
                        isX=false;
                        return;
                    }
                }
                cssTransform(list,"translateX",startX + disX);
                if(Math.abs(disX)>translateX/2){
                    end(disX);
                }
            });
            function end(disX){
                isLoding= false;
                var traget =disX > 0? 0 : -2*translateX;
                list.style.transition="300ms ";
                cssTransform(list,"translateX",traget);
                list.addEventListener('transitionend',transitionEnd);
                list.addEventListener('webkitTransitionEnd',transitionEnd);
            };
            function transitionEnd() {
                list.removeEventListener('transitionend',transitionEnd);
                list.removeEventListener('webkitTransitionEnd',transitionEnd);
                for (var i = 0; i < loding.length; i++) {
                    loding[i].style.opacity = 1;
                }
                /*发送ajax请求*/
                setTimeout(function(){
                    list.style.transition="none";
                    cssTransform(list,"translateX",-translateX);
                    isLoding= true;
                },10000);
            }
            list.addEventListener("touchend",function(ev){
                if(!isLoding){
                    return;
                }
                var touch =ev.changedTouches[0];
                var nowpoint=touch;
                var disX =nowpoint.clientX -startpoint.clientX;
                if(Math.abs(disX)<translateX/2){
                    list.style.transition="300ms";
                    cssTransform(list,"translateX",-translateX);
                }

            });
        }
    }
};
