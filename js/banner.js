// 效果对象
var Effect = {};

// 浏览器检测
Effect.browser_test=function(){
	IE6=window.navigator.userAgent.search(/MSIE 6/)!=-1;
	IE7=window.navigator.userAgent.search(/MSIE 7/)!=-1;
	IE8=window.navigator.userAgent.search(/MSIE 8/)!=-1;
	IE9=window.navigator.userAgent.search(/MSIE 9/)!=-1;
	IE10=window.navigator.userAgent.search(/MSIE 10/)!=-1;
}

//弹性运动
Effect.flex=function (obj, cur, target, fnDo, fnEnd, fs, ms){
	if(Effect.browser_test.IE6){
		fnDo&&fnDo.call(obj, target);
		fnEnd&&fnEnd.call(obj, target);
		return;
	}
	var MAX_SPEED=16;

	if(!fs)fs=6;
	if(!ms)ms=0.75;
	var now={};
	var x=0;	//0-100

	if(!obj.__flex_v)obj.__flex_v=0;

	if(!obj.__last_timer)obj.__last_timer=0;
	var t=new Date().getTime();
	if(t-obj.__last_timer>20){
		fnMove();
		obj.__last_timer=t;
	}

	clearInterval(obj.timer);
	obj.timer=setInterval(fnMove, 20);

	function fnMove(){
		obj.__flex_v+=(100-x)/fs;
		obj.__flex_v*=ms;

		if(Math.abs(obj.__flex_v)>MAX_SPEED)obj.__flex_v=obj.__flex_v>0?MAX_SPEED:-MAX_SPEED;

		x+=obj.__flex_v;

		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}


		if(fnDo)fnDo.call(obj, now);

		if(Math.abs(obj.__flex_v)<1 && Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
			obj.__flex_v=0;
		}
	}
}

// 缓冲运动
Effect.buffer=function (obj, cur, target, fnDo, fnEnd, fs){
	if(Effect.browser_test.IE6){
		fnDo&&fnDo.call(obj, target);
		fnEnd&&fnEnd.call(obj, target);
		return;
	}

	if(!fs)fs=6;
	var now={};
	var x=0;
	var v=0;

	if(!obj.__last_timer)obj.__last_timer=0;
	var t=new Date().getTime();
	if(t-obj.__last_timer>20){
		fnMove();
		obj.__last_timer=t;
	}

	clearInterval(obj.timer);
	obj.timer=setInterval(fnMove, 20);
	function fnMove(){
		v=Math.ceil((100-x)/fs);

		x+=v;

		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}


		if(fnDo)fnDo.call(obj, now);

		if(Math.abs(v)<1 && Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
		}
	}
}

// 线性运动
Effect.linear=function (obj, cur, target, fnDo, fnEnd, fs){
	if(Effect.browser_test.IE6){
		fnDo&&fnDo.call(obj, target);
		fnEnd&&fnEnd.call(obj, target);
		return;
	}
	if(!fs)fs=50;
	var now={};
	var x=0;
	var v=0;

	if(!obj.__last_timer)obj.__last_timer=0;
	var t=new Date().getTime();
	if(t-obj.__last_timer>20){
		fnMove();
		obj.__last_timer=t;
	}

	clearInterval(obj.timer);
	obj.timer=setInterval(fnMove, 20);

	v=100/fs;
	function fnMove(){
		x+=v;

		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}

		if(fnDo)fnDo.call(obj, now);

		if(Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
		}
	}
}


// 设置样式
function _setStyle(now){
	setStyle(this, now);
}

// 设置CSS3样式
function setStyle3(obj, name, value){
	obj.style['Webkit'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
	obj.style['Moz'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
	obj.style['ms'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
	obj.style['O'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
	obj.style[name]=value;
}

// 通过class获取元素
function getByClass(oParent, sClass){
	var aEle=oParent.getElementsByTagName('*');
	var re=new RegExp('\\b'+sClass+'\\b', 'i');
	var aResult=[];

	for(var i=0;i<aEle.length;i++)
	{
		if(re.test(aEle[i].className))
		{
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}

// 获取随机值
function rnd(n, m){
	return parseInt(Math.random()*(m-n)+n);
}

// 设置多个样式
function setStyle(obj, json){
	if(obj.length){
		for(var i=0;i<obj.length;i++){
			setStyle(obj[i], json);
		}
	}else{
		for(var i in json){
			obj.style[i]=json[i];
		}
	}
}

var buffer = Effect.buffer;
var linear = Effect.linear;
var flex = Effect.flex;

$(function(){

	var now=0;
	var oDiv=document.getElementById('banner_img');
	var ready=true;
	var W=1080;
	var H=300;

	var haha=document.createElement('div');


	var index = 0,
		todo = 1,
		autoTime = 90000,	// 自动滚动时间
		$bannerCenterA = $(".banner_center a"),
		$bannerImg = $("#banner_img"),
		$bannerPrev = $(".banner_prev"),
		$bannerNext = $(".banner_next"),
		bannerLen = $bannerCenterA.length;

	// 获取下一页index
	function getNextIndex(flag){
		// true为顺时针
		if (flag) {
			if (now == bannerLen-1) {
				todo = 0;
			} else {
				todo = (now + 1) % bannerLen;
			}
		} else {
			if(now == 0){
				todo = bannerLen-1;
			}else{
				todo = (now - 1) % bannerLen;
			}
		}
		return todo;
	};

	function pageTurn(){
		var galleryHref = $bannerImg.data("href").split("|")[todo];
		$bannerCenterA.eq(todo)
							.addClass("current")
							.siblings("a")
							.removeClass("current");
		$bannerImg.attr("href", galleryHref);
	}

	// 上一张
	$bannerPrev.click(function(){
		if(!ready)return;
		turnEffect( getNextIndex(false) );
		pageTurn();
	});

	// 下一张
	$bannerNext.click(function(){
		if(!ready)return;
		boomEffect( getNextIndex(true) );
		pageTurn();
	});

	// 圆点导航
	$bannerCenterA.each(function(i){
		$(this).click(function(){
			if(!ready)return;

			if(i == 0){
				now = 2;
			}else{
				now=i-1;
			}
			pageEffect(i);
			$(this).addClass("current").siblings("a").removeClass("current");
			$bannerImg.attr("href", $bannerImg.data("href").split("|")[i]);
		});
	});

	var timer = setInterval(function(){
		$bannerNext.trigger("click");
	}, autoTime);

	$("#banner").hover(function(){
			clearInterval(timer);
		}, function(){
			timer = setInterval(function(){
				$bannerNext.trigger("click");
			}, autoTime);
		}
	);

	function getBannerUrl(index){
		return 'url(' + getBannerSrc(index) + ')';
	}

	function getBannerSrc(index){
		return 'http://www.xuanfengge.com/wp-content/themes/lee2.0/images/banner/banner_'+index+'.jpg'
	}


	//爆炸
	var boomEffect = function(iNext){
		if(!ready)return;
		ready=false;

		var R=4;
		var C=7;

		var cw=W/2;
		var ch=H/2;

		oDiv.innerHTML='';
		oDiv.style.background = getBannerUrl(iNext) + ' center no-repeat';

		var aData=[];

		var wait=R*C;

		for(var i=0;i<R;i++)
		{
			for(var j=0,k=0;j<C;j++,k++)
			{
				aData[i]={left: W*j/C, top: H*i/R};
				var oNewDiv=document.createElement('div');

				setStyle(oNewDiv, {
					position: 'absolute',
					background: getBannerUrl(now) +-aData[i].left+'px '+-aData[i].top+'px no-repeat',
					width:Math.ceil(W/C)+'px', height: Math.ceil(H/R)+'px', left: aData[i].left+'px', top: aData[i].top+'px'
				});
				//setStyle3(oNewDiv, 'transition', '0.5s all ease-out');

				oDiv.appendChild(oNewDiv);

				var l=((aData[i].left+W/(2*C))-cw)*rnd(2,3)+cw-W/(2*C);
				var t=((aData[i].top+H/(2*R))-ch)*rnd(2,3)+ch-H/(2*R);

				setTimeout((function (oNewDiv,l,t){
					return function ()
					{
						buffer(
							oNewDiv,
							{left: oNewDiv.offsetLeft, top: oNewDiv.offsetTop, opacity: 100, x:0,y:0,z:0,scale:1, a:0},
							{left: l, top: t, opacity: 0,x:rnd(-180, 180),y:rnd(-180, 180),z:rnd(-180, 180),scale:rnd(1.5, 3), a:1},
							function (now){
								this.style.left=now.left+'px';
								this.style.top=now.top+'px';
								this.style.opacity=now.opacity/100;
								setStyle3(oNewDiv, 'transform', 'perspective(500px) rotateX('+now.x+'deg) rotateY('+now.y+'deg) rotateZ('+now.z+'deg) scale('+now.scale+')')
							}, function (){
								setTimeout(function (){
									// oDiv.removeChild(oNewDiv);
									$bannerImg.empty();
								}, 200);
								if(--wait==0)
								{
									ready=true;
									now=iNext;
								}
							}, 10
						);
					};
				})(oNewDiv,l,t), rnd(0, 200));
			}
		}
	};

	//翻转
	var turnEffect = function(iNext){
		if(!ready)return;
		ready=false;

		var R=3;
		var C=6;

		var wait=R*C;

		var dw=Math.ceil(W/C);
		var dh=Math.ceil(H/R);

		oDiv.style.background='none';
		oDiv.innerHTML='';

		for(var i=0;i<C;i++)
		{
			for(var j=0;j<R;j++)
			{
				var oNewDiv=document.createElement('div');
				var t=Math.ceil(H*j/R);
				var l=Math.ceil(W*i/C);

				setStyle(oNewDiv, {
					position: 'absolute', background: getBannerUrl(now)+-l+'px '+-t+'px no-repeat',
					left: l+'px', top: t+'px', width: dw+'px', height: dh+'px'
				});

				(function (oNewDiv, l, t){
					oNewDiv.ch=false;

					setTimeout(function (){
						linear(oNewDiv, {y:0}, {y:180}, function (now){
							if(now.y>90 && !oNewDiv.ch)
							{
								oNewDiv.ch=true;
								oNewDiv.style.background= getBannerUrl(iNext) +-l+'px '+-t+'px no-repeat';
							}

							if(now.y>90)
							{
								setStyle3(oNewDiv, 'transform', 'perspective(500px) rotateY('+now.y+'deg) scale(-1,1)');
							}
							else
							{
								setStyle3(oNewDiv, 'transform', 'perspective(500px) rotateY('+now.y+'deg)');
							}
						}, function (){
							if((--wait)==0)
							{
								ready=true;
								now=iNext;
							}
						}, 22);
					}, /*(i+j*R)*120*/(i+j)*200);
				})(oNewDiv, l, t);

				oDiv.appendChild(oNewDiv);
			}
		}
	};

	//翻页
	var pageEffect = function(iNext){
		if(!ready)return;
		ready=false;

		oDiv.innerHTML='';
		oDiv.style.background= getBannerUrl(iNext) + ' center no-repeat';

		var oDivPage=document.createElement('div');

		setStyle(oDivPage, {
			position: 'absolute', background: getBannerUrl(iNext) + ' right no-repeat', zIndex: 3,
			left: '50%', top: 0, width: '50%', height: '100%', overflow: 'hidden'
		});
		setStyle3(oDivPage, 'transform', 'perspective(1000px) rotateY(0deg)');
		setStyle3(oDivPage, 'transformOrigin', 'left');

		oDiv.appendChild(oDivPage);

		var oDivOld=document.createElement('div');

		setStyle(oDivOld, {
			position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', zIndex:2,
			background: getBannerUrl(now) + ' left no-repeat'
		});

		oDiv.appendChild(oDivOld);
		var oDivShadow=document.createElement('div');

		setStyle(oDivShadow, {
			position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', zIndex:2,
			background: 'rgba(0,0,0,1)'
		});

		oDiv.appendChild(oDivShadow);

		oDivPage.ch=false;
		buffer(oDivPage, {y:0, opacity: 1}, {y:-180, opacity: 0}, function (now){
			if(now.y<-90 && !oDivPage.ch)
			{
				oDivPage.ch=true;
				oDivPage.innerHTML='<img />';

				var oImg=oDivPage.getElementsByTagName('img')[0];

				oImg.src=getBannerSrc(iNext);
				setStyle3(oImg, 'transform', 'scaleX(-1)');

				setStyle(oImg, {
					position: 'absolute', right: 0, top: 0, width: '200%', height: '100%'
				});

				setStyle3(oDivPage, 'transformOrigin', 'left');
			}

			if(now.y<-90)
			{
				setStyle3(oDivPage, 'transform', 'perspective(1000px) scale(-1,1) rotateY('+(180-now.y)+'deg)');
			}
			else
			{
				setStyle3(oDivPage, 'transform', 'perspective(1000px) rotateY('+now.y+'deg)');
			}
			oDivShadow.style.background='rgba(0,0,0,'+now.opacity+')';
		}, function (){
			setTimeout(function (){
				$bannerImg.empty();
			}, 200);
			now=iNext;
			ready=true;
		}, 14);
	};

	// 扭曲
	var skewEffect = function(iNext){
		if(!ready)return;
		ready=false;
		var C=7;

		var wait=C;

		var dw=Math.ceil(W/C);

		oDiv.style.background='none';
		oDiv.innerHTML='';

		for(var i=0;i<C;i++)
		{
			var oNewDiv=document.createElement('div');

			setStyle(oNewDiv, {
				width: dw+'px', height: '100%', position: 'absolute', left: W*i/C+'px', top: 0
			});
			setStyle3(oNewDiv, 'transformStyle', 'preserve-3d');
			setStyle3(oNewDiv, 'transform', 'perspective(1000px) rotateX(0deg)');
			//setStyle3(oNewDiv, 'transition', '0.5s all linear');

			(function (oNewDiv,i){
				oNewDiv.style.zIndex=C/2-Math.abs(i-C/2);

				setTimeout(function (){
					buffer(oNewDiv, {a:0, x:0}, {a:100, x:-90}, function (now){
						setStyle3(oNewDiv, 'transform', 'perspective(1000px) rotateY('+((3*(i-C/2))*(50-Math.abs(now.a-50))/50)+'deg) rotateX('+now.x+'deg)');
					}, function (){
						if(--wait==0)
						{
							ready=true;
						}
						now=iNext;
					}, 8);
					//setStyle3(oNewDiv, 'transform', 'perspective(1000px) rotateY('+3*(i-C/2)+'deg) rotateX(-45deg)');
				}, (i+1)*130);
			})(oNewDiv,i);

			oNewDiv.innerHTML='<div></div><div></div><div></div><div></div>';

			var oNext=oNewDiv.getElementsByTagName('div')[0];
			var oNow=oNewDiv.getElementsByTagName('div')[1];
			var oBack=oNewDiv.getElementsByTagName('div')[2];
			var oBack2=oNewDiv.getElementsByTagName('div')[3];

			setStyle([oNext, oNow, oBack, oBack2], {width: '100%', height: '100%', position: 'absolute', left: 0, top: 0});
			setStyle(oNext, {
				background: getBannerUrl(iNext) +-W*i/C+'px 0px no-repeat'
			});
			setStyle3(oNext, 'transform', 'scale3d(0.836,0.836,0.836) rotateX(90deg) translateZ('+H/2+'px)');

			setStyle(oNow, {
				background: getBannerUrl(now) +-W*i/C+'px 0px no-repeat'
			});
			setStyle3(oNow, 'transform', 'scale3d(0.834,0.834,0.834) rotateX(0deg) translateZ('+H/2+'px)');

			setStyle(oBack, {
				background: '#666'
			});
			setStyle3(oBack, 'transform', 'scale3d(0.834,0.834,0.834) rotateX(0deg) translateZ(-'+H/2+'px)');

			setStyle(oBack2, {
				background: '#666'
			});
			setStyle3(oBack2, 'transform', 'scale3d(0.834,0.834,0.834) rotateX(90deg) translateZ(-'+H/2+'px)');

			oDiv.appendChild(oNewDiv);
		}
	};

	// 立方体
	var cubeEffect = function(iNext){
		if(!ready)return;
		ready=false;

		oDiv.innerHTML='';
		oDiv.style.background='none';

		setStyle3(oDiv, 'transformStyle', 'preserve-3d');
		setStyle3(oDiv, 'transform', 'perspective(1000px) rotateY(0deg)');

		var oNow=document.createElement('div');
		var oNext=document.createElement('div');

		setStyle([oNow, oNext], {
			position: 'absolute',
			width: '100%', height: '100%', left: 0, top: 0
		});

		setStyle3(oNow, 'transform', 'scale3d(0.741,0.741,0.741) rotate3d(0,1,0,0deg) translate3d(0,0,'+W/2+'px)');
		setStyle3(oNext, 'transform', 'scale3d(0.741,0.741,0.741) rotate3d(0,1,0,90deg) translate3d(0,0,'+W/2+'px)');

		oDiv.appendChild(oNext);
		oDiv.appendChild(oNow);

		oNow.style.background=getBannerUrl(now) + ' center no-repeat';
		oNext.style.background=getBannerUrl(iNext) + ' center no-repeat';
		//return;
		setTimeout(function (){
			//setStyle3(oDiv, 'transition', '1s all ease-in-out');
			flex(oDiv, {y:0}, {y:-90}, function (now){
				setStyle3(oDiv, 'transform', 'perspective(1000px) rotateY('+now.y+'deg)');
			}, function (){
				setStyle3(oDiv, 'transition', 'none');
				setStyle3(oDiv, 'transformStyle', 'flat');
				setStyle3(oDiv, 'transform', 'none');

				oDiv.innerHTML='';
				oDiv.style.background=getBannerUrl(iNext) + ' center no-repeat';

				now=iNext;

				ready=true;
			}, 10, 0.6);
		},0);
	}

});
