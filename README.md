#Benner-Effect 轩枫阁banner效果
基于CSS3实现的banner特效 - 轩枫阁

##功能
- 支持配置图片及链接
- 支持事件回调等
- 仅支持高级浏览器
- 支持5种切换效果：爆炸、翻转、翻页、扭曲、立方体

	- boomEffect（爆炸）
	- turnEffect（翻转）
	- pageEffect（翻页）
	- skewEffect（扭曲）
	- cubeEffect（立方体）



##使用
构建：基于[WeFlow](https://weflow.io/)

查看Demo：http://www.xuanfengge.com/demo/201610/banner-effect/html/index.html

查看Demo代码：dist目录

引入JS文件：dist/banner-effect.js



##配置
````
banner: '#banner_img',       // banner dom（不包含子元素）
index: 0,           // 设定初始化时banner的索引
autoplay: 3000,     // 自动切换的时间间隔（单位ms），不设定该参数banner不会自动切换
width: 1200,        // banner宽度
height: 300,        // banner高度

// 图片相关
images: [{
	url: '../img/banner/1.jpg',
	link: 'http://www.xuanfengge.com'
}, {
	url: '../img/banner/2.jpg',
	link: 'javascript:;'
}, {
	url: '../img/banner/3.jpg',
	link: 'javascript:;'
}],         // 图片url列表
preloadImages: true,// 预加载所有图片

// 分页及控制
pagination: '.js_banner_nav',     // 分页dom
paginationClick: true,  // 分页是否可点击
prevButton: '.js_banner_prev',     // 下一张dom
nextButton: '.js_banner_next',     // 上一张dom

// 回调函数
onInit: function(){
	console.log('init');
},     // 初始化后执行
onClick: function(event, index){
	console.log('onClick: ' + index);
},    // 点击banner后执行
onBannerChange: function(){
	console.log('onBannerChange');
},  // banner切换后执行

Effects: 'boomEffect'
// Effects: {
// 	'prev': 'turnEffect',
// 	'next': 'boomEffect',
// 	'navi': 'pageEffect'
// },        // 切换效果
});
````

## 参与贡献
 
如果有 `Bug反馈` 或 `功能建议`，请创建 [Issue](https://github.com/xuanfeng/banner-effect/issues) 或发送 [Pull Request](https://github.com/xuanfeng/banner-effect/pulls)，感谢你的参与和贡献。

[轩枫阁](http://www.xuanfengge.com/)
