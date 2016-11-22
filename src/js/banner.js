
;(function(root, factory){
    if(typeof module !== 'undefined' && module.exports){// CommonJS
        module.exports = factory();
    }else if (typeof define === 'function' && define.amd){// AMD / RequireJS
        define(factory);
    }else{
        root.Banner = factory.call(root);
    }
})(this, function(){
    'use strict';

    var defaults = {
        // 基本配置
        banner: null,       // banner dom（不包含子元素）
        index: 0,           // 设定初始化时banner的索引
        autoplay: 8000,     // 自动切换的时间间隔（单位ms），不设定该参数banner不会自动切换
        width: 1200,        // banner宽度
        height: 300,        // banner高度

        // 图片相关
        images: [],         // 图片url列表
        preloadImages: true,// 强制加载所有图片

        // 分页及控制
        pagination: '',     // 分页dom
        paginationClick: true,  // 分页是否可点击
        prevButton: '',     // 下一张dom
        nextButton: '',     // 上一张dom

        // 回调函数
        onInit: $.noop,     // 初始化后执行
        onClick: $.noop,    // 点击banner后执行
        onBannerChange: $.noop,  // banner切换后执行

        Effects: [],        // 切换效果
    }

    var W = 0;
    var H = 0;

    /**
     * 切换效果配置
     * 效果列表：boomEffect（爆炸）、turnEffect（翻转）、pageEffect（翻页）、skewEffect（扭曲）、cubeEffect（立方体）
     * 支持对象、字符串
     *
     * 对象： {'prev': 'boomEffect', 'next': 'pageEffect', 'navi': 'turnEffect'}
     * 字符串：'boomEffect'
     */


    function Banner(options){
        this.options = $.extend(defaults, options || {});
        W = this.options.width;
        H = this.options.height;
        this.banner = $(this.options.banner);

        // 检查参数

        this.index = this.options.index || 0;
        this.total = this.options.images.length || 0;
        this.ready = false;

        this.init();

    }

    Banner.prototype = {
        EFFECTS: ['boomEffect', 'turnEffect', 'pageEffect', 'skewEffect', 'cubeEffect'],
        defaultEffect: 'boomEffect',

        // 初始化
        init: function(){
            this.initDom();
            this.initEvents();
            this.preloadImages();
            this.setBannerEffect(this.options.Effects);
            this.autoPlay();
            this.options.onInit();

            // 强制加载图片
            this.ready = true;
        },

        // 初始化dom
        initDom: function(){

            if(this.options.pagination){
                var $pagination = $(this.options.pagination);
                var pagi = '';
                for(var i=0; i<this.total; i++){
                    i!=0 ? pagi += '<a class="js_nav" href="javascript:;"></a>' : pagi = '<a class="js_nav mod-banner__current" href="javascript:;"></a>';
                }
                $pagination.html(pagi);

            }
        },

        // 初始化事件监听
        initEvents: function(){
            var self = this;
            // 下一张
            if(this.options.nextButton){
                var $nextButton = $(this.options.nextButton);
                $nextButton && $nextButton.on('click', function(){
                    self.bannerChange(self.getNextIndex(true), 'next');
                });
            }

            // 上一张
            if(this.options.prevButton){
                var $prevButton = $(this.options.prevButton);
                $prevButton && $prevButton.on('click', function(){
                    self.bannerChange(self.getNextIndex(false), 'prev');
                });
            }

            // 点击分页
            if(this.options.paginationClick && this.options.pagination){
                var $pagination = $(this.options.pagination);
                $pagination.on('click', function(event){
                    var index = $(event.target).index();
                    self.bannerChange(index, 'navi');
                    $(this).addClass("mod-banner__current").siblings("a").removeClass("mod-banner__current");
                });
            }

            // 点击banner
            $(this.options.banner).on('click', function(event){
                self.options.onClick(event, self.index);
            });
        },

        // banner切换
        bannerChange: function(index, type){
            if(!this.ready) return;
            clearInterval(this.autoplayTimer);

            $(this.options.pagination).find('a').removeClass('mod-banner__current').eq(index).addClass('mod-banner__current');

            eval('this.' + this.getBannerEffect(type) + '( ' + index + ')');
            this.banner.attr('href', this.options.images[index].link);
            this.onBannerChange();

            this.autoPlay();
        },

        // 自动播放
        autoPlay: function(){
            var self = this;
            // 非自动播放
            if(!this.options.autoplay || isNaN(this.options.autoplay)) return;

            this.autoplayTimer = setInterval(function(){
                var index = self.getNextIndex(true);
                self.bannerChange(index, 'next');
            }, this.options.autoplay);
        },

        // banner切换后触发
        onBannerChange: function(index){
            this.options.onBannerChange(index);

        },

        // 获取当前index
        getNextIndex: function(isNext){
            var nextIndex = 0;
            if(isNext){
                // 顺时针
                if(this.index == this.total-1){
                    nextIndex = 0;
                }else{
                    nextIndex = (this.index + 1) % this.total;
                }
            }else{

                if(this.index == 0){
                    nextIndex = this.total - 1;
                }else{
                    nextIndex = (this.index -1) % this.total;
                }
            }

            return nextIndex;
        },

        // 获取banner URL
        getBannerUrl: function(index){
            return 'url(' + this.getBannerSrc(index) + ') ';
        },

        getBannerSrc: function(index){
            return this.options.images[index].url || '';
        },

        // 预加载图片
        preloadImages: function(){
            if(!this.options.preloadImages) return;
            for(var i=0; i<this.options.images.length; i++){
                (new Image).src = this.options.images[i].url;
            }
        },

        // 获取切换效果
        getBannerEffect: function(type){
            if(type && this.effect[type]){
                var result;
                for(var i=0; i<this.EFFECTS.length; i++){
                    if(this.effect[type] == this.EFFECTS[i]) result = true;
                }
                if(result) return this.effect[type];
                throw new Error('effect ' + this.effect[type] +' not support.');
            }
            return this.defaultEffect;
        },

        setBannerEffect: function(effect){
            if(Utils.isString(effect)){
                return this.effect = {
                    'prev': effect,
                    'next': effect,
                    'navi': effect
                }
            }
            this.effect = $.extend({
                'prev': this.defaultEffect,
                'next': this.defaultEffect,
                'navi': this.defaultEffect
            }, effect);
        },

        // 爆炸
        boomEffect: function(iNext){
            var self = this;
            if(!this.ready) return;
            this.ready = false;

            var R = 4;
            var C = 7;

            var cw = W/2;
            var ch = H/2;

            this.banner[0].innerHTML = '';
            this.banner[0].style.background = this.getBannerUrl(iNext) + ' center no-repeat';

            var aData = [];

            var wait = R*C;

            for(var i=0; i<R; i++){
                for(var j=0,k=0; j<C; j++,k++){
                    aData[i] = {
                        left: W*j/C,
                        top: H*i/R
                    }
                    var oNewDiv = document.createElement('div');

                    Utils.setStyle(oNewDiv, {
                        position: 'absolute',
                        background: self.getBannerUrl(self.index) + -aData[i].left + 'px ' + -aData[i].top + 'px no-repeat',
                        width: Math.ceil(W/C) + 'px',
                        height: Math.ceil(H/R) + 'px',
                        left: aData[i].left + 'px',
                        top: aData[i].top + 'px'
                    });

                    self.banner[0].appendChild(oNewDiv);

                    var l = ((aData[i].left + W/(2*C)) - cw) * Utils.rnd(2, 3) + cw - W/(2*C);
                    var t = ((aData[i].top + H/(2*R)) - ch) * Utils.rnd(2, 3) + ch - H/(2*R);

                    setTimeout((function(oNewDiv, l, t){
                        return function(){
                            Effect.buffer(
                                oNewDiv,
                                {left: oNewDiv.offsetLeft,top: oNewDiv.offsetTop,opacity: 100,x: 0,y: 0,z: 0,scale: 1,a: 0},
                                {left: l,top: t,opacity: 0,x: Utils.rnd(-180, 180),y: Utils.rnd(-180, 180),z: Utils.rnd(-180, 180),scale: Utils.rnd(1.5, 3), a: 1},
                                function(now){
                                    this.style.left = now.left + 'px';
                                    this.style.top = now.top + 'px';
                                    this.style.opacity = now.opacity/100;
                                    Utils.setStyle3(oNewDiv, 'transform', 'perspective(500px) rotateX(' + now.x + 'deg) rotateY(' + now.y + 'deg) rotateZ(' + now.z + 'deg) scale(' + now.scale + ')')
                                },
                                function(){
                                    setTimeout(function(){
                                        if(--wait == 0){
                                            self.ready = true;
                                            self.index = iNext;
                                        }
                                        self.banner[0].removeChild(oNewDiv);
                                    }, 200);
                                },
                                10
                            );
                        }
                    })(oNewDiv, l, t), Utils.rnd(0, 200));
                }
            }
        },

        // 翻转
        turnEffect: function(iNext){
            var self = this;
            if(!this.ready) return;
            this.ready = false;

            var R = 3;
            var C = 6;

            var wait = R*C;

            var dw = Math.ceil(W/C);
            var dh = Math.ceil(H/R);

            self.banner[0].style.background='none';
            self.banner[0].innerHTML='';

            for(var i=0; i<C; i++){
                for(var j=0; j<R; j++){
                    var oNewDiv = document.createElement('div');
                    var t = Math.ceil(H*j/R);
                    var l = Math.ceil(W*i/C);

                    Utils.setStyle(oNewDiv, {
                        position: 'absolute',
                        background: self.getBannerUrl(self.index) + -l + 'px ' + -t + 'px no-repeat',
                        left: l + 'px',
                        top: t + 'px',
                        width: dw + 'px',
                        height: dh + 'px'
                    });

                    (function (oNewDiv, l, t){
                        oNewDiv.ch=false;

                        setTimeout(function(){
                            Effect.linear(
                                oNewDiv,
                                {y: 0},
                                {y: 180},
                                function(now){
                                    if(now.y>90 && !oNewDiv.ch){
                                        oNewDiv.ch = true;
                                        oNewDiv.style.background = self.getBannerUrl(iNext) + -l + 'px ' + -t + 'px no-repeat';
                                    }

                                    if(now.y>90){
                                        Utils.setStyle3(oNewDiv, 'transform', 'perspective(500px) rotateY(' + now.y + 'deg) scale(-1,1)');
                                    }else{
                                        Utils.setStyle3(oNewDiv, 'transform', 'perspective(500px) rotateY(' + now.y + 'deg)');
                                    }
                                }, function(){
                                    if((--wait) == 0){
                                        self.ready = true;
                                        self.index = iNext;
                                    }
                                },
                                22
                            );
                        }, /*(i+j*R)*120*/(i+j)*200);
                    })(oNewDiv, l, t);

                    self.banner[0].appendChild(oNewDiv);
                }
            }
        },

        // 翻页
        pageEffect: function(iNext){
            var self = this;
            if(!this.ready) return;
            this.ready = false;

            this.banner[0].innerHTML = '';
            this.banner[0].style.background = this.getBannerUrl(iNext) + ' center no-repeat';

            var oDivPage = document.createElement('div');

            Utils.setStyle(oDivPage, {
                position: 'absolute',
                background: this.getBannerUrl(iNext) + ' right no-repeat',
                zIndex: 3,
                left: '50%',
                top: 0,
                width: '50%',
                height: '100%',
                overflow: 'hidden'
            });
            Utils.setStyle3(oDivPage, 'transform', 'perspective(1000px) rotateY(0deg)');
            Utils.setStyle3(oDivPage, 'transformOrigin', 'left');

            this.banner[0].appendChild(oDivPage);

            var oDivOld = document.createElement('div');

            Utils.setStyle(oDivOld, {
                position: 'absolute',
                left: 0,
                top: 0,
                width: '50%',
                height: '100%',
                zIndex: 2,
                background: this.getBannerUrl(this.index) + ' left no-repeat'
            });

            this.banner[0].appendChild(oDivOld);
            var oDivShadow = document.createElement('div');

            Utils.setStyle(oDivShadow, {
                position: 'absolute',
                right: 0,
                top: 0,
                width: '50%',
                height: '100%',
                zIndex: 2,
                background: 'rgba(0,0,0,1)'
            });

            this.banner[0].appendChild(oDivShadow);

            oDivPage.ch = false;
            Effect.buffer(
                oDivPage,
                {y: 0, opacity: 1},
                {y: -180, opacity: 0},
                function (now){
                    if(now.y<-90 && !oDivPage.ch){
                        oDivPage.ch = true;
                        oDivPage.innerHTML = '<img />';

                        var oImg = oDivPage.getElementsByTagName('img')[0];

                        oImg.src = self.getBannerSrc(iNext);
                        Utils.setStyle3(oImg, 'transform', 'scaleX(-1)');

                        Utils.setStyle(oImg, {
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: '200%',
                            height: '100%'
                        });

                        Utils.setStyle3(oDivPage, 'transformOrigin', 'left');
                    }

                    if(now.y<-90){
                        Utils.setStyle3(oDivPage, 'transform', 'perspective(1000px) scale(-1,1) rotateY(' + (180 - now.y) + 'deg)');
                    }else{
                        Utils.setStyle3(oDivPage, 'transform', 'perspective(1000px) rotateY(' + now.y + 'deg)');
                    }
                    oDivShadow.style.background = 'rgba(0,0,0,' + now.opacity + ')';
                }, function(){
                    self.ready = true;
                    self.index = iNext;
                },
                14
            );
        },

        // 扭曲
        skewEffect: function(iNext){
            var self = this;
            if(!this.ready) return;
            this.ready = false;

            var C = 6;
            var wait = C;

            var dw = Math.ceil(W/C);

            self.banner[0].style.background = 'none';
            self.banner[0].innerHTML = '';

            for(var i=0; i<C; i++){
                var oNewDiv = document.createElement('div');

                Utils.setStyle(oNewDiv, {
                    width: dw + 'px',
                    height: '100%',
                    position: 'absolute',
                    left: W*i/C + 'px',
                    top: 0
                });
                Utils.setStyle3(oNewDiv, 'transformStyle', 'preserve-3d');
                Utils.setStyle3(oNewDiv, 'transform', 'perspective(1000px) rotateX(0deg)');

                (function(oNewDiv, i){
                    oNewDiv.style.zIndex = C/2 - Math.abs(i-C/2);

                    setTimeout(function(){
                        Effect.buffer(
                            oNewDiv,
                            {a: 0, x: 0},
                            {a: 100, x: -90},
                            function(now){
                                Utils.setStyle3(oNewDiv, 'transform', 'perspective(1000px) rotateY(' + ((3*(i-C/2)) * (50 - Math.abs(now.a-50))/50) + 'deg) rotateX(' + now.x + 'deg)');
                            },
                            function(){
                                if(--wait == 0){
                                    self.ready=true;
                                }
                                self.index = iNext;
                            },
                            8
                        );
                    }, (i+1)*130);
                })(oNewDiv, i);

                oNewDiv.innerHTML = '<div></div><div></div><div></div><div></div>';

                var oNext = oNewDiv.getElementsByTagName('div')[0];
                var oNow = oNewDiv.getElementsByTagName('div')[1];
                var oBack = oNewDiv.getElementsByTagName('div')[2];
                var oBack2 = oNewDiv.getElementsByTagName('div')[3];

                Utils.setStyle([oNext, oNow, oBack, oBack2], {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0
                });
                Utils.setStyle(oNext, {
                    background: self.getBannerUrl(iNext) + -W*i/C + 'px 0px no-repeat'
                });
                Utils.setStyle3(oNext, 'transform', 'scale3d(0.870,0.870,0.870) rotateX(90deg) translateZ(' + H/2 + 'px)');

                Utils.setStyle(oNow, {
                    background: self.getBannerUrl(self.index) + -W*i/C + 'px 0px no-repeat'
                });
                Utils.setStyle3(oNow, 'transform', 'scale3d(0.870,0.870,0.870) rotateX(0deg) translateZ(' + H/2 + 'px)');

                Utils.setStyle(oBack, {
                    background: '#666'
                });
                Utils.setStyle3(oBack, 'transform', 'scale3d(0.870,0.870,0.870) rotateX(0deg) translateZ(-' + H/2 + 'px)');

                Utils.setStyle(oBack2, {
                    background: '#666'
                });
                Utils.setStyle3(oBack2, 'transform', 'scale3d(0.870,0.870,0.870) rotateX(90deg) translateZ(-' + H/2 + 'px)');

                self.banner[0].appendChild(oNewDiv);
            }
        },

        // 立方体
        cubeEffect: function(iNext){
            var self = this;
            if(!this.ready) return;
            this.ready = false;

            self.banner[0].innerHTML = '';
            self.banner[0].style.background = 'none';

            Utils.setStyle3(self.banner[0], 'transformStyle', 'preserve-3d');
            Utils.setStyle3(self.banner[0], 'transform', 'perspective(' + W/2 + ') rotateY(0deg)');

            var oNow = document.createElement('div');
            var oNext = document.createElement('div');

            Utils.setStyle([oNow, oNext], {
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0
            });

            Utils.setStyle3(oNow, 'transform', 'scale3d(0.5, 0.5, 0.5) rotate3d(0, 1, 0, 0deg) translate3d(0, 0,' + W/2 + 'px)');
            Utils.setStyle3(oNext, 'transform', 'scale3d(0.5, 0.5, 0.5) rotate3d(0, 1, 0, 90deg) translate3d(0, 0,' + W/2 + 'px)');

            self.banner[0].appendChild(oNext);
            self.banner[0].appendChild(oNow);

            oNow.style.background = self.getBannerUrl(self.index) + ' center no-repeat';
            oNext.style.background = self.getBannerUrl(iNext) + ' center no-repeat';
            setTimeout(function (){
                Effect.flex(
                    self.banner[0],
                    {y: 0},
                    {y: -90},
                    function(now){
                        Utils.setStyle3(self.banner[0], 'transform', 'perspective(' + W/2 + ') rotateY(' + now.y + 'deg)');
                    },
                    function (){
                        Utils.setStyle3(self.banner[0], 'transition', 'none');
                        Utils.setStyle3(self.banner[0], 'transformStyle', 'flat');
                        Utils.setStyle3(self.banner[0], 'transform', 'none');

                        self.banner[0].innerHTML = '';
                        self.banner[0].style.background = self.getBannerUrl(iNext) + ' center no-repeat';

                        self.index = iNext;

                        self.ready = true;
                    },
                    10,
                    0.6
                );
            }, 0);
        }
    }

    return Banner;
});