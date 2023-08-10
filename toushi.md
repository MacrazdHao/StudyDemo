# 前言

最近略有时间(MoYu)，自己复刻了一下经典的点连线特效，写的时候发现有些初高中的函数知识，什么一次函数、圆形函数啥的，一下子搞得自己懵逼，问gpt也是答非所问，牛头不对马嘴，最后还是得自己手算，头都大，想不到当年初中数学常常150分的我竟沦落到如此地步。不得不感叹老矣，老矣——

# 先上效果

[jcode](https://code.juejin.cn/pen/7265161437910138934)

# 一些前置变量

我们先定义一些变量和定量，以方便后续重复使用

```js
const WhiteBoardDom = document.getElementById('WhiteBoard') // Canvas Dom
const Context = WhiteBoardDom.getContext('2d') // Canvas的2d上下文对象
let WindowWdith = document.body.offsetWidth // 窗口宽度
let WindowHeight = document.body.offsetHeight // 窗口高度

WhiteBoardDom.width = WindowWdith // 画布宽度
WhiteBoardDom.height = WindowHeight // 画布高度

const WhiteBoardWidth = WhiteBoardDom.width // 存储画布宽度
const WhiteBoardHeight = WhiteBoardDom.height // 存储画布高度

// 监听窗口尺寸变化，动态变更画布的宽高
window.onresize = () => {
	WindowWdith = document.body.offsetWidth
	WindowHeight = document.body.offsetHeight
	WhiteBoardDom.width = WindowWdith
	WhiteBoardDom.height = WindowHeight - OperatorDom.offsetHeight
}
let Points = [] // 点集
let MousePos = { x: 0, y: 0 } // 鼠标相对Canvas坐标系的坐标
const PointRadius = 1 // 点半径
const PointsNum = 1000 // 点数量
const MouseLinkDist = 80 // 鼠标连点距离
const MouseTractionDist = 40 // 点环绕鼠标距离
const PointLinkDist = 40 // 点点连接距离
```

# 一些通用函数

在后续会重复利用的函数，比如随机数、随机色、两点距离、Canvas画线和Canvas画点等等，一些函数其实也能比较方便用在其他项目里，有需要也可以自取

```js
// 将坐标转为相对canvas的坐标
function windowToCanvas(x, y) {
	let cvsbox = WhiteBoardDom.getBoundingClientRect();
	return { x: Math.round(x - cvsbox.left), y: Math.round(y - cvsbox.top) };
}
// 随机数
function getIntRandom(max = 1, min = 0) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
// 随机小数
function getFloatRandom(max = 1, min = 0) {
	return Math.random() * (max - min) + min
}
// 随机数(可去除部分数)
function getExcludeRandom(max = 0, min = 1, excludes = []) {
	let num = getIntRandom(max, min)
	while (excludes.includes(num)) {
		num = getIntRandom(max, min)
	}
	return num
}
// 距离计算
function getDistance(p1, p2) {
	return Math.floor(Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2))
}
// 随机色
function getRandomColor(minR = 0, maxR = 255, minG = 0, maxG = 255, minB = 0, maxB = 255) {
	const colorR = getIntRandom(maxR, minR)
	const colorG = getIntRandom(maxG, minG)
	const colorB = getIntRandom(maxB, minB)
	return `rgb(${colorR}, ${colorG}, ${colorB})`
}
// 画点
function drawPoint({ x, y, radius, color }) {
	Context.fillStyle = color
	Context.beginPath()
	Context.arc(x, y, radius, 0, 2 * Math.PI)
	Context.closePath()
	Context.fill()
}
// 画线
function drawLine(p1, p2, color) {
	Context.strokeStyle = color
	Context.beginPath()
	Context.moveTo(p1.x, p1.y)
	Context.lineTo(p2.x, p2.y)
	Context.lineWidth = p1.lineWidth
	Context.closePath()
	Context.stroke()
}
// 获取随机一次函数
function getRandomFunc(point) {
	const k = getExcludeRandom(1, -1, [0]) * getFloatRandom()
	return {
		k,
		b: point.y - k * point.x
	}
}
// 获取鼠标坐标
function getMousePos(e) {
	MousePos = windowToCanvas(e.x, e.y)
}
```

# 创建点、点连线

我们先定义创建随机点的函数，以及批量生成点的函数

点对象包含了不少属性，后续用到时就会明白是用来干什么的了

```js
// 创建点
function createPoint(radius = PointRadius) {
	const point = {
		x: getIntRandom(WhiteBoardWidth), // 随机x坐标
		y: getIntRandom(WhiteBoardHeight), // 随机y坐标
		radius, // 点半径，默认取PointRadius - (1)
		color: getRandomColor(), // 取随机色，也可以自己写死一种颜色
		direction: getExcludeRandom(1, -1, [0]), // 随机(x轴)移动方向，
		unitDist: getFloatRandom(0.3, 0.05), // 每帧随机单位移动距离（移动速度）
		nearMouse: false, // 是否接近鼠标
		lineWidth: 0.1, // 线宽
		track: null, // 移动轨迹函数
		nearCircleTrack: null // 接近鼠标但未达环绕鼠标距离的移动轨迹函数
	}
	point.track = getRandomFunc(point) // 生成随机轨迹函数
	return point
}
// 批量点
function createPoints(num = PointsNum) {
	for (let i = 0; i < num; i++) {
		const point = createPoint()
		Points.push(point)
		drawPoint(point)
	}
}
```

然后我们再定义一个点连线函数，实际上是调用先前定义的drawLine通用函数，为了方便且更符合当前需求，所以多套了一层减少了一个颜色参数

```js
// 两点连线
function linkPoints(p1, p2) {
	drawLine(p1, p2, p1.color)
}
```

# 点移动

点移动分为三个情况：

* 默认轨迹
* 接近鼠标，但未及环绕距离
* 达到环绕鼠标距离

在这之前，我们还要考虑一个问题，当点移动超出屏幕范围时应该怎么处理？毕竟如果不处理，最终所有点都会离开屏幕，最终可视范围内就没有任何的点了。

我在这里的处理方式就是将超出屏幕范围的点，重新创建一个新的点对象，替换为原来的点

```js
// 限定坐标于画板范围
function getBoardRangePos(point) {
	if (point.x > WhiteBoardWidth || point.x < 0 || point.y > WhiteBoardHeight || point.y < 0) {
        // 超出范围返回新的点
		return createPoint()
	}
	return point
}
```

首先我们先看第一种情况，这种情况实则是利用一次函数计算x轴以指定方向移动单位距离后的y坐标，最终返回变更了坐标的点对象

```js
// 计算点沿一次函数直线移动后的坐标（dis：x轴单位距离，dir：移动方向）
function getLinearPosition(p, { k, b }, dis, dir) {
	const x = p.x + dis * dir // 以指定方向移动单位距离的x坐标
	const y = k * x + b // 对应的新y坐标
	return getBoardRangePos({
		...p,
		x, y
	})
}
```

然后我们先跳过第二种情况，看最后一种环绕的移动轨迹计算，这里我们利用的是圆形的函数式进行计算的，而移动则是用原位置坐标与新位置坐标之间的扇形弧长作为移动距离

```js
// 计算点沿圆形函数移动后的坐标
function getCirclePosition(p, { o, r }, dis, dir) {
	const alpha = Math.atan2(p.y - o.y, p.x - o.x)
	const beta = alpha + dir * (dis * Math.PI) / 180
	return {
		...p,
		x: o.x + r * Math.cos(beta),
		y: o.y + r * Math.sin(beta)
	}
}
```

接着看第二种情况，第二种情况说复杂也能复杂，说简单也能简单，取决于你打算怎么改，其实我试过用圆弧来做这个轨迹，奈何我已经把这些几何知识忘得差不多了，用GPT又答非所问，唉，最终放弃，还是用回最简单的直线轨迹了。

直线轨迹的计算就是以鼠标的坐标和点的原坐标连成直线，求一次函数，剩下的就是重复利用getLinearPosition求新坐标了

```js
// 计算两点连成的一次函数
function getLinearFunc(p1, p2) {
	const k = (p1.y - p2.y) / (p1.x - p2.x)
	const b = p1.y - k * p1.x
	return { k, b }
}
```

这里我其实还保留了getCirclePosition函数的空缺，有大神懂的可以帮忙填充一下哈哈哈哈，这个函数里面的就不贴出来了，因为是错误的，但是在效果代码里面是有的

```js
// 已知圆形函数P，根据其上有一点A(x1, y1)，求含有一点B(x2, y2)，且于圆形P相切的圆形Q
function getCircleFunc(p, o, r, dir, { k, b }) {
    // TODO And Get the Circle Function
}
```

除此之外，本来想着圆形轨迹求着麻烦把，那我以点的原坐标沿环绕鼠标的圆做切线来实现第二种情况会不会更简单点，但毫无疑问，也是失败了，虽然不是完全的失败，确实能求到切线函数，但是当点抵达环绕范围时，点的移动可能会沿着鼠标以切线函数位移相反的反向环绕，于是懒得去折腾就放弃了，有大佬也可以研究研究

```js
// 圆外点作圆切线
function getCutLineFunc(p, o, r, dir) {
	const d = ((p.x - o.x) * (p.y - o.y) + dir * r * Math.sqrt((p.x - o.x) ** 2 + (p.y - o.y) ** 2 - r ** 2)) / ((p.x - o.x) ** 2 - r ** 2)
	return { k: d, b: -p.x * d + p.y }
}
```

最后我们将以上汇总到以下函数

## 鼠标牵引点的函数

```js
// 鼠标牵引
function mouseTraction(point, unitDist, direction, nearCircleTrack) {
	const dist = getDistance(point, MousePos)
	const radius = MouseTractionDist
	const dir = MousePos.x < point.x ? -1 : 1
	if (dist > radius) {
        // 未触达环绕距离时
		// const linear = getCutLineFunc(point, MousePos, radius, direction)
		const linear = getLinearFunc(point, MousePos)
		return getLinearPosition(point, linear, unitDist, dir)
	}
    // 触达环绕距离
	return getCirclePosition(point, { o: MousePos, r: radius }, unitDist, direction)
}
```

## 帧更新函数（更新点位置）

```js
// 帧（更新点位置）
function getFrame() {
	Points = Points.map(point => {
		let { direction, track, unitDist, nearMouse, nearCircleTrack } = point
		if (nearMouse) {
            // （此处的nearCircleTrack为启用，若要使用可以在mouseTraction中更改）
            // 是否已经接近鼠标，是则更新nearCircleTrack函数
			nearCircleTrack = getCircleFunc(point, MousePos, MouseTractionDist, direction, track)
		}
        // 接近鼠标时，调用鼠标牵引函数，否则调用默认一次函数轨迹的坐标更新函数
		const newPos = nearMouse ? mouseTraction(point, unitDist, direction, nearCircleTrack) : getLinearPosition(point, track, unitDist, direction)
        // 如果已经被鼠标牵引，说明该点坐标已经脱离原默认轨迹函数，依据当前新坐标生成新轨迹函数
		track = nearMouse ? getRandomFunc(newPos) : track
		return {
			...point,
			...newPos,
			track,
			nearCircleTrack
		}
	})
}
```

# 帧重绘

Canvas动画是需要逐帧重新绘制的，因此我们也需要有一个重绘函数，重绘内容包括绘点和连线

## 重绘点

```js
// 重绘
function refreshBoard() {
	Context.clearRect(0, 0, WhiteBoardDom.offsetWidth, WhiteBoardDom.offsetHeight)
	Points.forEach((point, index) => {
		Points[index].nearMouse = false
		drawPoint(point)
	})
}
```

## 重绘线段

线段分为两种：

* 点与点的连线
* 鼠标与点的连线

在此之前，我们先考虑他们的共同特征，那就是都需要根据目标点或鼠标的坐标，获取其在连线范围内(MouseLinkDisth和PointLinkDist)的点

```js
// 获取某坐标范围内的点
function getNearPoint(ePoint, maxNum = 0, nearCallback, dist = PointLinkDist) {
	const NearPoints = []
	const _MaxNum = Math.min(maxNum || Points.length, Points.length)
	for (let i = 0; i < Points.length; i++) {
		const point = Points[i]
		if (getDistance(point, ePoint) <= dist && NearPoints.length <= _MaxNum) {
			NearPoints.push(point)
			if (nearCallback) nearCallback(point, i)
		}
	}
	return NearPoints
}
```

好，既然我们能够知道具体坐标周围的点了，接着就是连线，两者实则大同小异，其实只是连线范围的区别罢了

先看第一种情况，点与点的连线

```js
// 点与点连线
function linkAllNearPointLine(maxLine = 3) {
	Points.forEach(point => {
		getNearPoint(point, maxLine, (nPoint) => {
			linkPoints(point, nPoint, PointLinkDist)
		})
	})
}
```

然后再看第二种情况，鼠标与点的连线。这里预留了一个参数，默认传鼠标坐标(MousePos)就行了，如果大家想传其他的坐标也可以根据自己的情况去传递，不局限于鼠标蛤

```js
// 鼠标与点连线
function linkNearMousePointLine(ePoint, maxLine = 0) {
	getNearPoint(ePoint, Math.min(maxLine || Points.length, Points.length), ((nPoint, i) => {
		Points[i].nearMouse = true
		linkPoints(nPoint, ePoint, MouseLinkDist)
	}), MouseLinkDist)
}
```

# 连帧动画

将上述函数并起来使用，组合成一个函数就好啦！注意调用的先后顺序其实也是有影响的哦！

其次需要注意的是，这里使用的是requestAnimationFrame来实现动画帧的循环更新

```js
// 连帧动画
function movePoints() {
	getFrame()
	refreshBoard()
	linkNearMousePointLine(MousePos)
	requestAnimationFrame(movePoints)
	linkAllNearPointLine()
}
```

## 启动！

```js
function startAnimation() {
	createPoints()
	movePoints()
	window.addEventListener('mouseenter', getMousePos)
	window.addEventListener('mousemove', getMousePos)
}
startAnimation()
```

# 大功告成！

恭喜你，你已经完成这个Canvas经典动画了！

没啥技术含量，主打的就是一个MoYu快餐，下次再见。