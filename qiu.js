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
const RateRange = { max: 10, min: -10 }
let BallDensity = 0.000001

const FloorFriction = 0.0001
const AirFriction = 0.00001
const Gravity = 0
const BounceCoefficient = 0.8

const StopCoefficient = 9.1

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
	let collBalls = getCollideBalls(_ball)
	let xBoundaryColl = _ball.x > WhiteBoardWidth - _ball.radius || _ball.x < _ball.radius
	let yBoundaryColl = _ball.y > WhiteBoardHeight - _ball.radius || _ball.y < _ball.radius
	while (collBalls.length > 0 || xBoundaryColl || yBoundaryColl) {
		_ball.x = getIntRandom(WhiteBoardWidth)
		_ball.y = getIntRandom(WhiteBoardHeight)
		collBalls = getCollideBalls(_ball)
		xBoundaryColl = _ball.x > WhiteBoardWidth - _ball.radius || _ball.x < _ball.radius
		yBoundaryColl = _ball.y > WhiteBoardHeight - _ball.radius || _ball.y < _ball.radius
	}
	return _ball
}
// 创建球
function createBall(id, radius) {
	const ball = {
		id,
		x: 0,
		y: 0,
		radius: radius || getIntRandom(BallRadiusRange.max, BallRadiusRange.min),
		color: getRandomColor(),
		rateX: getExcludeRandom(RateRange.max, RateRange.min, [0]),
		rateY: getExcludeRandom(RateRange.max, RateRange.min, [0]),
		density: BallDensity,
		mass: 0,
		collBallsStatus: {}
	}
	ball.mass = getBallMass(ball.radius, ball.density)
	return getUniquePos(ball)
}
// 批量创建球
function createPoints(num = BallsNum) {
	for (let i = 0; i < num; i++) {
		const ball = createBall(i)
		Balls.push(ball)
		drawBall(ball)
	}
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			if (i === j) continue
			// 0 - 未碰撞   1 - 已碰撞但未触发回调   2 - 已碰撞并触发回调
			Balls[i].collBallsStatus[j] = 0
		}
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
	let { x, y, rateX, rateY, mass, collBallsStatus } = ball
	collBalls.forEach(cBall => {
		const centerDist = getDistance(ball, cBall)
		const normalCenterDist = ball.radius + cBall.radius
		if (collBallsStatus[cBall.id] === 2) {
			// console.log('碰撞过了')
			if (centerDist - normalCenterDist < -0.01) {
				const xRatio = (ball.x - cBall.x) / centerDist
				const yRatio = (ball.y - cBall.y) / centerDist
				const ballXRatio = ball.x / cBall.x
				const ballYRatio = ball.y / cBall.y
				// x = ball.x + normalCenterDist * xRatio * ballXRatio
				// y = ball.y + normalCenterDist * yRatio * ballYRatio
				// rateX = rateX * (normalCenterDist * xRatio / (ball.x - cBall.x))
				// rateY = rateY * (normalCenterDist * yRatio / (ball.y - cBall.y))
				rateX += (xRatio * ballXRatio)
				rateY += (yRatio * ballYRatio)
				// for (let cBallId in collBallsStatus) {
				// collBallsStatus[cBallId] = collBallsStatus[cBallId] === 2 ? 1 : collBallsStatus[cBallId]
				// console.log(cBallId)
				// }
			}
			return {
				...ball,
				x, y,
				collBallsStatus,
				rateX, rateY
			}
		}
		const _rateX = cBall.rateX
		const _rateY = cBall.rateY
		const _mass = cBall.mass
		rateX = parseFloat((((mass - _mass) * rateX + 2 * _mass * _rateX) / (mass + _mass))) * BounceCoefficient
		rateY = parseFloat((((mass - _mass) * rateY + 2 * _mass * _rateY) / (mass + _mass))) * BounceCoefficient
		// 防重叠处理
		// for (let cBallId in collBallsStatus) {
		// collBallsStatus[cBallId] = collBallsStatus[cBallId] === 2 ? 1 : collBallsStatus[cBallId]
		// console.log(cBallId)
		// }
		collBallsStatus[cBall.id] = 2
	})
	return {
		...ball,
		x, y,
		collBallsStatus,
		// rateX, rateY
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
		rateX = -rateX * BounceCoefficient
	}
	if (y >= WhiteBoardHeight - radius || y <= radius) {
		// 锁边
		if (y >= WhiteBoardHeight - radius) {
			y = WhiteBoardHeight - radius
			const accY = ball.mass * Gravity + 2 * radius * (rateY < 0 ? AirFriction : -AirFriction)
			rateY = rateY <= accY * StopCoefficient ? 0 : (-rateY * BounceCoefficient)
		}
		if (y <= radius) {
			y = radius
			// 速度反弹
			rateY = -rateY * BounceCoefficient
		}
	}
	return {
		...ball,
		x, y,
		rateX, rateY,
	}
}
// 获取下一位置
function updateBall(ball) {
	const { radius, x, y } = ball
	let rateX = ball.rateX
	let rateY = ball.rateY
	const accX = 2 * radius * (rateX < 0 ? AirFriction : -AirFriction) + (y <= WhiteBoardHeight - radius ? (rateX < 0 ? FloorFriction : -FloorFriction) : 0)
	const accY = ball.mass * Gravity + 2 * radius * (rateY < 0 ? AirFriction : -AirFriction)
	rateX = parseFloat((rateX >= 0 ? Math.max(rateX + accX, 0) : Math.min(rateX + accX, 0)))
	rateY = parseFloat((rateY >= 0 ? Math.max(rateY + accY, 0) : Math.min(rateY + accY, 0)))
	// console.log(rateY, accY)
	return getBoardRangePos({
		...ball,
		rateX,
		rateY,
		x: x + ball.rateX,
		y: y + ball.rateY
	})
}
// 
function updateBallCollideStatus(ball, cBallsMap) {
	// cBalls.forEach(cBall => {
	const { collBallsStatus } = ball
	for (let cBallId in collBallsStatus) {
		collBallsStatus[cBallId] = cBallsMap[cBallId] || 0
	}
	// })
	return { ...ball, collBallsStatus }
}
// 碰撞检测
function getCollideBalls(ball, selfIndex = -1) {
	return Balls.filter((_ball, index) => {
		if (index === selfIndex) return false
		return getDistance(ball, _ball) <= ball.radius + _ball.radius
	})
}
// 碰撞检测
function getCollideBallsMap(ball, cBalls) {
	const collBallsMap = {}
	cBalls.forEach((_ball) => {
		collBallsMap[_ball.id] = ball.collBallsStatus[_ball.id] || 1
	})
	return collBallsMap
}
// 碰撞回调
function collideCallback() {
	let _Balls = JSON.parse(JSON.stringify(Balls))
	_Balls = Balls.map((ball, index) => {
		const cBalls = getCollideBalls(ball, index)
		const cBallsMap = getCollideBallsMap(ball, cBalls)
		return updateBallRate(updateBallCollideStatus(ball, cBallsMap), cBalls)
	})
	Balls = _Balls
}
// 帧
function getFrame() {
	Context.clearRect(0, 0, WhiteBoardDom.offsetWidth, WhiteBoardDom.offsetHeight)
	Context.fillStyle = '#000'
	Context.fillRect(0, 0, WhiteBoardWidth, WhiteBoardHeight)
	Balls = Balls.map(ball => {
		drawBall(ball)
		return {
			...updateBall(ball),
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

// 如何保证每次碰撞只触发一次反弹
// 如何保证速度过快不会穿透碰撞物体