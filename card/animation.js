const RealFps = 60 // 映射帧，用于过渡动画
const FpsCycleTime = 1000 // 每过RealFps个映射帧经过的单位时长
let OriginFps = 160 // 原始帧，requestAnimationFrame的频率
let ConvertFpsRatio = OriginFps / RealFps // 原始帧和映射帧的比例 - n原始帧=每单位映射帧

let OriginFpsTimer = 0 // 原始帧计数器
let RealFpsTimer = 0 // 映射帧计数器

let RealFpsTimestamp = new Date().getTime()
let FpsTimestamp = new Date().getTime() // 计时时间戳

// 帧率侦听器
function fpsListener() {
	const ts = new Date().getTime()
	OriginFps++
	if (Math.abs(OriginFps - OriginFpsTimer) >= ConvertFpsRatio) {
		OriginFpsTimer = OriginFps
		if (RealFpsTimer === 60) RealFpsTimer = 0
		RealFpsTimer++
		RealFpsTimestamp = ts
	}
	if (ts - FpsTimestamp >= FpsCycleTime) {
		FpsTimestamp = ts
		ConvertFpsRatio = OriginFps / RealFps
		OriginFps = 0
	}
}

// 技术类型
const AnimationTypes = {
	LINEAR: 1, // 线性
	BEZIER: 2, // 贝塞尔曲线
}

// 数值变化起始帧记录器
const NumberStartFpsRecorder = {}

function clearAnimation(key) {
	if (!key) return
	delete NumberStartFpsRecorder[key]
}

function pushAnimation(start, end, duration = 200, type = AnimationTypes.LINEAR, bezierPoints) {
	const key = getRandomKey()
	NumberStartFpsRecorder[key] = {
		type, duration,
		bezierPoints: type === AnimationTypes.BEZIER ? bezierPoints || [0, 1] : [0, 1], // 贝塞尔曲线关键点
		ts: RealFpsTimestamp, // 当前映射帧的时间戳
		startFps: RealFpsTimer, // 起始映射帧
		start, end, // 起始值和终点值
		totalFps: getTotalFps(duration),
	}
	return key
}

function updateAnimationInfo(key, { type = AnimationTypes.LINEAR, bezierPoints, start, end, duration }) {
	type = type || NumberStartFpsRecorder[key].type
	start = start || NumberStartFpsRecorder[key].start
	end = end || NumberStartFpsRecorder[key].end
	bezierPoints = type === AnimationTypes.BEZIER ? bezierPoints || NumberStartFpsRecorder[key].bezierPoints : [0, 1]
	duration = duration || NumberStartFpsRecorder[key].duration
	NumberStartFpsRecorder[key] = {
		type, duration,
		bezierPoints, // 贝塞尔曲线关键点
		start, end, // 起始值和终点值
		ts: RealFpsTimestamp, // 起始帧对应的时间戳
		startFps: RealFpsTimer, // 起始帧
		totalFps: getTotalFps(duration),
	}
	return key
}

function getAnimationInfo(key) {
	return NumberStartFpsRecorder[key] || null
}

// 获取每映射帧的数值变化单位量
function getTotalFps(duration) {
	return Math.ceil((duration / FpsCycleTime) * RealFps)
}

// 获取记录器中某条数值记录变化后应得的数值
function getCurrentAnimationNum(key) {
	if (!key || !NumberStartFpsRecorder[key]) return null
	const { type, ts, startFps, start, end, totalFps, bezierPoints } = NumberStartFpsRecorder[key]
	const tsDiff = RealFpsTimestamp - ts
	let addFps = 0
	if (tsDiff < FpsCycleTime) {
		if (startFps > RealFpsTimer) {
			// 跨域一个60帧周期
			addFps = RealFps - startFps + RealFpsTimer
		} else {
			// 同一个60帧周期
			addFps = RealFpsTimer - startFps
		}
	} else {
		// 整数的60帧周期数
		const fullFpsCycle = tsDiff % FpsCycleTime
		// 剩余不满一60帧周期的时间(ms)
		const reduceTime = tsDiff - fullFpsCycle
		addFps = RealFps * fullFpsCycle + Math.floor(reduceTime / (FpsCycleTime / RealFps))
	}
	let resNum = 0
	resNum = bezierInterpolation(start, end, addFps / totalFps, bezierPoints)
	return resNum
}

// for (let i = 0; i <= 100; i++) {
// 	console.log(bezierInterpolation(0, 1, i / 100, [0, 0.5, 0.1, 0.2]))
// }