const WhiteBoardDom = document.getElementById('WhiteBoard')
const Context = WhiteBoardDom.getContext('2d')
let WindowWdith = document.body.offsetWidth
let WindowHeight = document.body.offsetHeight

WhiteBoardDom.width = WindowWdith
WhiteBoardDom.height = WindowHeight

const WhiteBoardWidth = WhiteBoardDom.width
const WhiteBoardHeight = WhiteBoardDom.height

window.onresize = () => {
	WindowWdith = document.body.offsetWidth
	WindowHeight = document.body.offsetHeight
	WhiteBoardDom.width = WindowWdith
	WhiteBoardDom.height = WindowHeight - OperatorDom.offsetHeight
}
let Points = []
let MousePos = { x: 0, y: 0 }

function windowToCanvas(x, y) {
	// 将坐标转为相对canvas的坐标
	var cvsbox = WhiteBoardDom.getBoundingClientRect();
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
// 创建点
function createPoint(radius = 1) {
	const point = {
		x: getIntRandom(WhiteBoardWidth),
		y: getIntRandom(WhiteBoardHeight),
		radius,
		color: getRandomColor(),
		direction: getExcludeRandom(1, -1, [0]),
		unitDist: getFloatRandom(0.3, 0.05),
		nearMouse: false,
		lineWidth: 0.1,
		track: null,
	}
	point.track = getRandomFunc(point)
	return point
}
// 批量点
function createPoints(num = 1000) {
	for (let i = 0; i < num; i++) {
		const point = createPoint()
		Points.push(point)
		drawPoint(point)
	}
}
// 两点连线
function linkPoints(p1, p2) {
	drawLine(p1, p2, p1.color)
}
// 限定坐标于画板范围
function getBoardRangePos(point) {
	if (point.x > WhiteBoardWidth || point.x < 0 || point.y > WhiteBoardHeight || point.y < 0) {
		return createPoint()
	}
	return point
}
// 获取随机一次函数
function getRandomFunc(point) {
	const k = getExcludeRandom(1, -1, [0]) * getFloatRandom()
	return {
		k,
		b: point.y - k * point.x
	}
}
// 计算点沿一次函数直线移动后的坐标
function getLinearPosition(p, { k, b }, dis, dir) {
	const x = p.x + dis * dir
	const y = k * x + b
	return getBoardRangePos({
		...p,
		x, y
	})
}
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
// 计算两点连成的一次函数
function getLinearFunc(p1, p2) {
	const k = (p1.y - p2.y) / (p1.x - p2.x)
	const b = p1.y - k * p1.x
	return { k, b }
}
// 鼠标牵引
function mouseTraction(point, unitDist, direction, radius = 40) {
	const dist = getDistance(point, MousePos)
	if (dist > radius) {
		const linear = getLinearFunc(point, MousePos)
		dir = MousePos.x < point.x ? -1 : 1
		return getLinearPosition(point, linear, unitDist, dir)
	}
	return getCirclePosition(point, { o: MousePos, r: radius }, unitDist, direction)
}
// 帧（更新点位置）
function getFrame() {
	Points = Points.map(point => {
		let { direction, track, unitDist, nearMouse } = point
		const newPos = nearMouse ? mouseTraction(point, unitDist, direction) : getLinearPosition(point, track, unitDist, direction)
		track = nearMouse ? getRandomFunc(newPos) : track
		return {
			...point,
			...newPos,
			track,
		}
	})
}
// 重绘
function refreshBoard() {
	Context.clearRect(0, 0, WhiteBoardDom.offsetWidth, WhiteBoardDom.offsetHeight)
	Points.forEach((point, index) => {
		Points[index].nearMouse = false
		drawPoint(point)
	})
}
// 获取某坐标范围内的点
function getNearPoint(ePoint, maxDist = 60, maxNum = 0, nearCallback) {
	const NearPoints = []
	const _MaxNum = Math.min(maxNum || Points.length, Points.length)
	for (let i = 0; i < Points.length; i++) {
		const point = Points[i]
		if (getDistance(point, ePoint) <= maxDist && NearPoints.length <= _MaxNum) {
			NearPoints.push(point)
			if (nearCallback) nearCallback(point, i)
		}
	}
	return NearPoints
}
// 连线
function linkNearMousePointLine(ePoint, maxDist = 80, maxLine = 0) {
	getNearPoint(ePoint, maxDist, Math.min(maxLine || Points.length, Points.length), ((nPoint, i) => {
		Points[i].nearMouse = true
		linkPoints(nPoint, ePoint, maxDist)
	}))
}
// 连接所有点
function linkAllNearPointLine(maxLine = 3, maxDist = 30) {
	Points.forEach(point => {
		getNearPoint(point, maxDist, maxLine, (nPoint) => {
			linkPoints(point, nPoint, maxDist)
		})
	})
}
// 随机移动
function movePoints() {
	getFrame()
	refreshBoard()
	linkNearMousePointLine(MousePos)
	requestAnimationFrame(movePoints)
	linkAllNearPointLine()
}
// 获取鼠标坐标
function getMousePos(e) {
	MousePos = windowToCanvas(e.x, e.y)
}
// 启动
function startAnimation() {
	createPoints()
	movePoints()
	window.addEventListener('mouseenter', getMousePos)
	window.addEventListener('mousemove', getMousePos)
}
startAnimation()