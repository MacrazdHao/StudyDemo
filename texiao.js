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

function windowToCanvas(x, y) {
	// 将坐标转为相对canvas的坐标
	var cvsbox = WhiteBoardDom.getBoundingClientRect();
	return { x: Math.round(x - cvsbox.left), y: Math.round(y - cvsbox.top) };
}
// 随机数
function getIntRandom(max = 1, min = 0) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
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
// 随机色
function getRandomColor(minR = 0, maxR = 255, minG = 0, maxG = 255, minB = 0, maxB = 255) {
	const colorR = getIntRandom(maxR, minR)
	const colorG = getIntRandom(maxG, minG)
	const colorB = getIntRandom(maxB, minB)
	return `rgb(${colorR}, ${colorG}, ${colorB})`
}

let Points = []

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
	Context.lineWidth = 0.1
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
		unitDist: getFloatRandom(0.3, 0.01)
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
	drawLine(p1, p2, p2.color)
}
// 
function getBoardRangePos(point) {
	if (point.x > WhiteBoardWidth || point.x < 0 || point.y > WhiteBoardHeight || point.y < 0) {
		return createPoint()
	}
	return point
}
function calculateX2(x, y, k, b, n, d) {
	// const a = 1 + k * k;
	// const bCoeff = 2 * (k * b - k * y - x);
	// const c = (b - y) * (b - y) - n * n;

	// const discriminant = bCoeff * bCoeff - 4 * a * c;

	// if (discriminant < 0) {
	// 	// 判别式小于 0，无实数解，返回 undefined 或其他适当的结果
	// 	return undefined;
	// } else {
	// 	const x2_1 = (-bCoeff + d * Math.sqrt(discriminant)) / (2 * a);
	// 	// 返回两个解之一，根据问题的上下文或需求选择合适的解
	// 	return x2_1;
	// }
	return x + d * n
}

// 获取随机一次函数
function getRandomFunc(point, minK = -100, maxK = 100) {
	// const k = getExcludeRandom(maxK, minK, [0])
	const k = getExcludeRandom(1, -1, [0]) * getFloatRandom()
	return {
		k,
		b: point.y - k * point.x,
		getPositiveClosePos(p, dis, dir) {
			const k = this.k
			const b = this.b
			// console.log(k, b, point, dis, dir)
			// console.log(calculateX2(p1.x, p1.y, k, b, dis, dir))
			const x = calculateX2(p.x, p.y, k, b, dis, dir)
			const y = k * x + b
			// console.log(x, y)
			return getBoardRangePos({
				...p,
				x, y
			})
		}
	}
}
// 帧（更新点位置）
function getFrame() {
	Points = Points.map(point => {
		const { direction, track, unitDist } = point
		return {
			...point,
			...track.getPositiveClosePos(point, unitDist, direction),
		}
	})
	// console.log(Points)
}
// 重绘
function refreshBoard() {
	Context.clearRect(0, 0, WhiteBoardDom.offsetWidth, WhiteBoardDom.offsetHeight)
	Points.forEach(point => {
		drawPoint(point)
	})
}
// 随机移动
function movePoints(maxSpeed = 20, minSpeed = 10) {
	getFrame()
	refreshBoard()
	setTimeout(() => {
		requestAnimationFrame(movePoints)
	}, 10);
}

createPoints()
movePoints()
