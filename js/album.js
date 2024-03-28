var carousel = document.getElementById("carousel");
var imgs = document.getElementsByClassName("imgs")[0];
var dots = document.getElementsByClassName("dots")[0];
var btns = document.getElementsByClassName("btns")[0];	
var dotss = dots.children;
var len = imgs.children.length; //图片张数
var width = carousel.offsetWidth; //每张图片的宽度
var rate = 15; //一张图片的切换速度， 单位为px
var times = 1; //切换速度的倍率
var timer = null; //初始化一个定时器
var imgSub = 0; //当前显示的图片下标
var dotSub = 0; //当前显示图片的小圆点下标
var temp;
// 创建一个文档片段，此时还没有插入到 DOM 结构中
const frag = document.createDocumentFragment()
// 根据图片数量添加相应的小圆点到文档片段中
for (let i = 0; i < len; i++) {
	const dot = document.createElement("li");
	dot.className = 'quiet';
	// 先插入文档片段中
	frag.appendChild(dot);
}
// 将小圆点片段统一插入到 DOM 结构中
dots.appendChild(frag)
// 第一个小圆点高亮显示
dots.children[0].className = "active";
// 滑动函数
function Roll(distance) { //参数distance：滚动的目标点（必为图片宽度的倍数）
	clearInterval(imgs.timer); //每次运行该函数必须清除之前的定时器！
	//判断图片移动的方向
	var speed = imgs.offsetLeft < distance ? rate : (0 - rate);
	//设置定时器，每隔10毫秒，调用一次该匿名函数
	imgs.timer = setInterval(function() {
		//每一次调用滚动到的地方 (速度为 speed px/10 ms)         
		imgs.style.left = imgs.offsetLeft + speed + "px";
		//距目标点剩余的px值      
		var leave = distance - imgs.offsetLeft;
		/*接近目标点时的处理，滚动接近目标时直接到达， 避免rate值设置不当时不能完整显示图片*/
		if (Math.abs(leave) <= Math.abs(speed)) {
			clearInterval(imgs.timer);
			imgs.style.left = distance + "px";
		}
	}, 10);
}
/*克隆第一个li到列表末*/
imgs.appendChild(imgs.children[0].cloneNode(true));
function autoRun() {
	imgSub++;
	dotSub++;
	if (imgSub > len) { //滚动完克隆项后
		imgs.style.left = 0; //改变left至真正的第一项处
		imgSub = 1; //从第二张开始显示
	}
	// 调用滚动函数，参数为该下标的滚动距离
	Roll(-imgSub * width);
	// 如果圆点下标已滚动到最后，则将下标重置为0
	if (dotSub > len - 1) { //判断是否到了最后一个圆点
		dotSub = 0;
	}
	// 循环修改所有圆点默认样式
	for (var i = 0; i < len; i++) {
		dotss[i].className = "quiet";
	}
	// 给当前滚动到的圆点添加高亮样式
	dotss[dotSub].className = "active";
}
// 创建定时器，开始自动滚动
timer = setInterval(autoRun,2000);
// 循环添加小圆点的触发事件
for (var i = 0; i < len; i++) {
	dotss[i].index = i;
	dotss[i].onmouseover = function() {
		for (var j = 0; j < len; j++) {
			dotss[j].className = "quiet";
		}
		this.className = "active";
		temp = dotSub;
		imgSub = dotSub = this.index;
		times = Math.abs(this.index - temp); //距离上个小圆点的距离
		rate = rate * times; //根据距离改变切换速率
		Roll(-this.index * width);
		rate = 15;
	}
}
// 添加事件：鼠标移动到carousel上，左右切换按钮显示
carousel.onmouseover = function() {
	clearInterval(timer);
	btns.style.display = 'block';
}
// 添加事件：鼠标移出carousel，左右切换按钮隐藏
carousel.onmouseout = function() {
	timer = setInterval(autoRun,2000);
	btns.style.display = 'none';
}
// 点击上一张按钮 触发事件
btns.children[0].onclick = function() {
	imgSub--;
	dotSub--;
	if (imgSub < 0) { //滚动完第一项后
		imgs.style.left = -len * width + "px"; //改变left至克隆的第一项处
		imgSub = dotSub = len - 1;
	}
	Roll(-imgSub * width);
	if (dotSub < 0) {
		dotSub = len - 1;
	}
	for (var i = 0; i < len; i++) {
		dotss[i].className = "quiet";
	}
	dotss[dotSub].className = "active";
}
// 点击下一张按钮 触发事件
btns.children[1].onclick = autoRun;