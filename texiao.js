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
let MousePos = { x: 0, y: 0, color: getRandomColor() }
const PointRadius = 1
const PointsNum = 1000
const MouseLinkDist = 80
const MouseTractionDist = 40
const PointLinkDist = 40

// 将坐标转为相对canvas的坐标
function windowToCanvas(x, y, originPoint) {
	let cvsbox = WhiteBoardDom.getBoundingClientRect();
	return { ...originPoint, x: Math.round(x - cvsbox.left), y: Math.round(y - cvsbox.top) };
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
	// Context.shadowColor=color
	// Context.shadowBlur = 10
	Context.fillStyle = color
	Context.beginPath()
	Context.arc(x, y, radius, 0, 2 * Math.PI)
	Context.closePath()
	Context.fill()
}
// 画线
function drawLine(p1, p2, opacity) {
	const linearGradient = Context.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
	const rgba1 = p1.color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
	const rgba2 = p2.color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
	linearGradient.addColorStop(0, rgba1);
	linearGradient.addColorStop(1, rgba2);
	Context.strokeStyle = linearGradient
	Context.beginPath()
	Context.moveTo(p1.x, p1.y)
	Context.lineTo(p2.x, p2.y)
	Context.lineWidth = p1.lineWidth
	Context.closePath()
	Context.stroke()
}
// 创建点
function createPoint(radius = PointRadius) {
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
		nearCircleTrack: null
	}
	point.track = getRandomFunc(point)
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
// 两点连线
function linkPoints(p1, p2, opacity) {
	drawLine(p1, p2, opacity)
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
// 已知圆形函数P，根据其上有一点A(x1, y1)，求含有一点B(x2, y2)，且于圆形P相切的圆形Q
function getCircleFunc(p, o, r, dir, { k, b }) {
	const k2 = -1 / k
	const b2 = p.y + p.x / k
	const discriminant = Math.pow(-2 * o.x - 2 * k2 * o.y, 2) - 4 * (1 + Math.pow(k2, 2)) * (Math.pow(o.x, 2) + Math.pow(o.y, 2) - 2 * o.y * b2 + Math.pow(b2, 2) - Math.pow(r, 2));
	if (discriminant < 0) {
		return null
	}
	const x1 = (-(-2 * o.x - 2 * k2 * o.y) + Math.sqrt(discriminant)) / (2 * (1 + Math.pow(k2, 2)));
	const x2 = (-(-2 * o.x - 2 * k2 * o.y) - Math.sqrt(discriminant)) / (2 * (1 + Math.pow(k2, 2)));
	const y1 = k2 * x1 + b2
	const y2 = k2 * x2 + b2
	const dist1 = getDistance({ x: x1, y: y1 }, p)
	const dist2 = getDistance({ x: x2, y: y2 }, p)
	if (dist1 === 2 * r) {
		return { o: { x: x1, y: y1 }, r: 2 * r }
	}
	if (dist2 === 2 * r) {
		return { o: { x: x1, y: y1 }, r: 2 * r }
	}
	return null

	// return { o: { x, y }, r };
}
// 圆外点作圆切线
function getCutLineFunc(p, o, r, dir) {
	const d = ((p.x - o.x) * (p.y - o.y) + dir * r * Math.sqrt((p.x - o.x) ** 2 + (p.y - o.y) ** 2 - r ** 2)) / ((p.x - o.x) ** 2 - r ** 2)
	return { k: d, b: -p.x * d + p.y }
}
// 鼠标牵引
function mouseTraction(point, unitDist, direction, nearCircleTrack) {
	const dist = getDistance(point, MousePos)
	const radius = MouseTractionDist
	const dir = MousePos.x < point.x ? -1 : 1
	if (dist > radius) {
		// const linear = getCutLineFunc(point, MousePos, radius, direction)
		const linear = getLinearFunc(point, MousePos)
		return nearCircleTrack ? getCirclePosition(point, nearCircleTrack, unitDist, direction) : getLinearPosition(point, linear, unitDist, dir)
	}
	return getCirclePosition(point, { o: MousePos, r: radius }, unitDist, direction)
}
// 帧（更新点位置）
function getFrame() {
	Points = Points.map(point => {
		let { direction, track, unitDist, nearMouse, nearCircleTrack } = point
		if (nearMouse) {
			nearCircleTrack = getCircleFunc(point, MousePos, MouseTractionDist, direction, track)
		}
		const newPos = nearMouse ? mouseTraction(point, unitDist, direction, nearCircleTrack) : getLinearPosition(point, track, unitDist, direction)
		track = nearMouse ? getRandomFunc(newPos) : track
		return {
			...point,
			...newPos,
			track,
			nearCircleTrack
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
function getNearPoint(startIndex = 0, ePoint, maxNum = 0, nearCallback, dist = PointLinkDist) {
	const NearPoints = []
	const _MaxNum = Math.min(maxNum || Points.length, Points.length)
	for (let i = startIndex; i < Points.length; i++) {
		const point = Points[i]
		const pointsDist = getDistance(point, ePoint)
		if (pointsDist <= dist && NearPoints.length <= _MaxNum) {
			NearPoints.push(point)
			if (nearCallback) nearCallback({ point, dist: pointsDist, index: i })
		}
	}
	return NearPoints
}
// 连线
function linkNearMousePointLine(ePoint, maxLine = 0) {
	getNearPoint(0, ePoint, Math.min(maxLine || Points.length, Points.length), ((item) => {
		const nPoint = item.point
		const { index, dist } = item
		Points[index].nearMouse = true
		const maxDist = MouseLinkDist - MouseTractionDist
		const opacity = 1 - (dist - MouseTractionDist) / maxDist
		linkPoints(nPoint, ePoint, opacity)
	}), MouseLinkDist)
}
// 连接所有点
function linkAllNearPointLine(maxLine = 3) {
	Points.forEach((point, index) => {
		getNearPoint(index + 1, point, maxLine, (item) => {
			const nPoint = item.point
			const { dist } = item
			const opacity = 1 - (dist / PointLinkDist)
			linkPoints(point, nPoint, opacity)
		})
	})
}
// 随机移动
function movePoints() {
	getFrame()
	refreshBoard()
	linkNearMousePointLine(MousePos)
	linkAllNearPointLine()
	requestAnimationFrame(movePoints)
}
// 获取鼠标坐标
function getMousePos(e) {
	MousePos = windowToCanvas(e.x, e.y, { ...MousePos, color: getRandomColor() })
}
// 启动
function startAnimation() {
	createPoints()
	movePoints()
	window.addEventListener('mouseenter', getMousePos)
	window.addEventListener('mousemove', getMousePos)
}
startAnimation()