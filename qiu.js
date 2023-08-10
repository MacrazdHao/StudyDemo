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
	WhiteBoardDom.height = WindowHeight
}
let Balls = []
let MousePos = { x: 0, y: 0, color: getRandomColor() }

const BallsNum = 20
const BallRadiusRange = { max: 50, min: 20 }
const RateRange = { max: 1, min: -1 }
let BallDensity = 2

const FrictionRate = 0.1

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
// 生成无重叠/卡边缘坐标
function getUniquePos(ball) {
	const _ball = JSON.parse(JSON.stringify(ball))
	_ball.x = getIntRandom(WhiteBoardWidth)
	_ball.y = getIntRandom(WhiteBoardHeight)
	let collBalls = collisionDetect(_ball)
	let xBoundaryColl = _ball.x > WhiteBoardWidth - _ball.radius || _ball.x < _ball.radius
	let yBoundaryColl = _ball.y > WhiteBoardHeight - _ball.radius || _ball.y < _ball.radius
	while (collBalls.length > 0 || xBoundaryColl || yBoundaryColl) {
		_ball.x = getIntRandom(WhiteBoardWidth)
		_ball.y = getIntRandom(WhiteBoardHeight)
		collBalls = collisionDetect(_ball)
		xBoundaryColl = _ball.x > WhiteBoardWidth - _ball.radius || _ball.x < _ball.radius
		yBoundaryColl = _ball.y > WhiteBoardHeight - _ball.radius || _ball.y < _ball.radius
	}
	return _ball
}
// 创建球
function createBall(radius) {
	const ball = {
		x: 0,
		y: 0,
		radius: radius || getIntRandom(BallRadiusRange.max, BallRadiusRange.min),
		color: getRandomColor(),
		rateX: getExcludeRandom(RateRange.max, RateRange.min, [0]),
		rateY: getExcludeRandom(RateRange.max, RateRange.min, [0]),
		density: BallDensity,
		mass: 0,
	}
	ball.mass = getBallMass(ball.radius, ball.density)
	return getUniquePos(ball)
}
// 批量创建球
function createPoints(num = BallsNum) {
	for (let i = 0; i < num; i++) {
		const ball = createBall()
		Balls.push(ball)
		drawBall(ball)
	}
}
// 画球
function drawBall({ x, y, radius, color }) {
	Context.fillStyle = color
	Context.beginPath()
	Context.arc(x, y, radius, 0, 2 * Math.PI)
	Context.closePath()
	Context.fill()
}
// 质量=密度*体积
function getBallMass(radius, density) {
	return density * Math.PI * (radius ** 3) * 3 / 4
}
// 速度向量计算
function updateBallRate(ball, collBalls = []) {
	let { rateX, rateY, mass } = ball
	collBalls.forEach(cBall => {
		const _rateX = cBall.rateX
		const _rateY = cBall.rateY
		const _mass = cBall.mass
		rateX = Math.floor(((mass - _mass) * rateX + 2 * _mass * _rateX) / (mass + _mass))
		rateY = Math.floor(((mass - _mass) * rateY + 2 * _mass * _rateY) / (mass + _mass))
	})
	return {
		...ball,
		rateX, rateY
	}
}
// 限定坐标于画板范围
function getBoardRangePos(ball) {
	let { x, y, rateX, rateY, radius } = ball
	if (x >= WhiteBoardWidth - radius || x <= radius) {
		// 锁边
		if (x >= WhiteBoardWidth - radius) x = WhiteBoardWidth - radius
		if (x <= radius) x = radius
		// 速度反弹
		rateX = -rateX
	}
	if (y >= WhiteBoardHeight - radius || y <= radius) {
		// 锁边
		if (y >= WhiteBoardHeight - radius) y = WhiteBoardHeight - radius
		if (y <= radius) y = radius
		// 速度反弹
		rateY = -rateY
	}
	return {
		...ball,
		x, y,
		rateX, rateY,
	}
}
// 获取下一位置
function getNextBallPos(ball) {
	return getBoardRangePos({
		...ball,
		// rateX: ball.rateX + (ball.rateX === 0 ? 0 : ball.rateX < 0 ? FrictionRate : -FrictionRate),
		// rateY: ball.rateY + (ball.rateY === 0 ? 0 : ball.rateY < 0 ? FrictionRate : -FrictionRate),
		x: ball.x + ball.rateX,
		y: ball.y + ball.rateY
	})
}
// 碰撞检测
function collisionDetect(ball, selfIndex = -1) {
	return Balls.filter((_ball, index) => {
		if (index === selfIndex) return false
		return getDistance(ball, _ball) <= ball.radius + _ball.radius
	})
}
// 碰撞回调
function collideCallback() {
	let _Balls = JSON.parse(JSON.stringify(Balls))
	_Balls = Balls.map((ball, index) => {
		const cBalls = collisionDetect(ball, index)
		return updateBallRate(ball, cBalls)
	})
	Balls = _Balls
}
// 帧
function getFrame() {
	Context.clearRect(0, 0, WhiteBoardDom.offsetWidth, WhiteBoardDom.offsetHeight)
	Balls = Balls.map(ball => {
		drawBall(ball)
		return {
			...getNextBallPos(ball),
		}
	})
}
// 随机移动
function moveBalls() {
	collideCallback()
	getFrame()
	requestAnimationFrame(moveBalls)
}
// 启动
function startAnimation() {
	createPoints()
	moveBalls()
	// window.addEventListener('mouseenter', getMousePos)
	// window.addEventListener('mousemove', getMousePos)
}
startAnimation()
