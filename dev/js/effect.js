;(function(root, factory){
	if(typeof module !== 'undefined' && module.exports){// CommonJS
        module.exports = factory();
    }else if (typeof define === 'function' && define.amd){// AMD / RequireJS
        define(factory);
    }else{
        root.Effect = factory.call(root);
    }
})(this, function(){
	'use strict';

	// 效果对象
	var Effect = {};

	// 浏览器检测
	Effect.browser_test = function(){
		IE6 = window.navigator.userAgent.search(/MSIE 6/)!=-1;
		IE7 = window.navigator.userAgent.search(/MSIE 7/)!=-1;
		IE8 = window.navigator.userAgent.search(/MSIE 8/)!=-1;
		IE9 = window.navigator.userAgent.search(/MSIE 9/)!=-1;
		IE10 = window.navigator.userAgent.search(/MSIE 10/)!=-1;
	}

	//弹性运动
	Effect.flex = function(obj, cur, target, fnDo, fnEnd, fs, ms){
		if(Effect.browser_test.IE6){
			fnDo && fnDo.call(obj, target);
			fnEnd && fnEnd.call(obj, target);
			return;
		}
		var MAX_SPEED = 16;

		if(!fs)fs = 6;
		if(!ms)ms = 0.75;
		var now = {};
		var x = 0;	//0-100

		if(!obj.__flex_v) obj.__flex_v = 0;

		if(!obj.__last_timer) obj.__last_timer = 0;
		var t = new Date().getTime();
		if(t-obj.__last_timer>20){
			fnMove();
			obj.__last_timer = t;
		}

		clearInterval(obj.timer);
		obj.timer = setInterval(fnMove, 20);

		function fnMove(){
			obj.__flex_v += (100-x)/fs;
			obj.__flex_v *= ms;

			if(Math.abs(obj.__flex_v)>MAX_SPEED)obj.__flex_v = obj.__flex_v>0?MAX_SPEED:-MAX_SPEED;

			x += obj.__flex_v;

			for(var i in cur){
				now[i] = (target[i]-cur[i])*x/100+cur[i];
			}

			if(fnDo)fnDo.call(obj, now);

			if(Math.abs(obj.__flex_v)<1 && Math.abs(100-x)<1){
				clearInterval(obj.timer);
				if(fnEnd)fnEnd.call(obj, target);
				obj.__flex_v = 0;
			}
		}
	}

	// 缓冲运动
	Effect.buffer = function(obj, cur, target, fnDo, fnEnd, fs){
		if(Effect.browser_test.IE6){
			fnDo && fnDo.call(obj, target);
			fnEnd && fnEnd.call(obj, target);
			return;
		}

		if(!fs) fs = 6;
		var now = {};
		var x = 0;
		var v = 0;

		if(!obj.__last_timer) obj.__last_timer = 0;
		var t = new Date().getTime();
		if(t-obj.__last_timer>20){
			fnMove();
			obj.__last_timer = t;
		}

		clearInterval(obj.timer);
		obj.timer = setInterval(fnMove, 20);
		function fnMove(){
			v = Math.ceil((100-x)/fs);

			x += v;

			for(var i in cur){
				now[i] = (target[i]-cur[i])*x/100+cur[i];
			}

			if(fnDo)fnDo.call(obj, now);

			if(Math.abs(v)<1 && Math.abs(100-x)<1){
				clearInterval(obj.timer);
				if(fnEnd)fnEnd.call(obj, target);
			}
		}
	}

	// 线性运动
	Effect.linear = function(obj, cur, target, fnDo, fnEnd, fs){
		if(Effect.browser_test.IE6){
			fnDo&&fnDo.call(obj, target);
			fnEnd&&fnEnd.call(obj, target);
			return;
		}
		if(!fs)fs = 50;
		var now = {};
		var x = 0;
		var v = 0;

		if(!obj.__last_timer)obj.__last_timer = 0;
		var t = new Date().getTime();
		if(t-obj.__last_timer>20){
			fnMove();
			obj.__last_timer = t;
		}

		clearInterval(obj.timer);
		obj.timer = setInterval(fnMove, 20);

		v = 100/fs;
		function fnMove(){
			x += v;

			for(var i in cur){
				now[i] = (target[i]-cur[i])*x/100+cur[i];
			}

			if(fnDo)fnDo.call(obj, now);

			if(Math.abs(100-x)<1){
				clearInterval(obj.timer);
				if(fnEnd)fnEnd.call(obj, target);
			}
		}
	}

	// function Effect(options){
	// 	console.log('Effect')
	// }

	// Effect.prototype = {

	// }

	return Effect;
});