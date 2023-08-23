const RealFps = 60 // 映射帧，用于过渡动画
let OriginFps = 160 // 原始帧，requestAnimationFrame的频率
let ConvertFpsRatio = OriginFps / RealFps // 原始帧和映射帧的比例 - n原始帧=每单位映射帧

let OriginFpsTimer = 0 // 原始帧计数器
let RealFpsTimer = 0 // 映射帧计数器

let FpsTimestamp = new Date().getTime() // 计时时间戳

// 帧率侦听器
function fpsListener() {
	const ts = new Date().getTime()
	OriginFps++
	if (Math.abs(OriginFps - OriginFpsTimer) >= ConvertFpsRatio) {
		OriginFpsTimer = OriginFps
		if (RealFpsTimer === 60) RealFpsTimer = 0
		RealFpsTimer++
		doWhenFpsUpdate()
	}
	if (ts - FpsTimestamp >= 1000) {
		FpsTimestamp = ts
		ConvertFpsRatio = OriginFps / RealFps
		OriginFps = 0
	}
}

// 技术类型
const AnimationTypes = {
	LINEAR: 1, // 线性
}

// 数值变化起始帧记录器
const NumberStartFpsRecorder = {}

function pushAnimation(start, end, duration = 200, type = AnimationTypes.LINEAR) {
	const key = getRandomKey()
	NumberStartFpsRecorder[key] = {
		type, duration,
		ts: FpsTimestamp, // 当前帧的时间戳
		startFps: RealFpsTimer, // 起始帧
		start, end, // 起始值和终点值
		unit: getUnitNum(start, end, duration) // 单位数值变化量
	}
	return key
}

function updateAnimationInfo(key, { type = AnimationTypes.LINEAR, start, end, duration }) {
	type = type || NumberStartFpsRecorder[key].type
	start = start || NumberStartFpsRecorder[key].start
	end = end || NumberStartFpsRecorder[key].end
	duration = duration || NumberStartFpsRecorder[key].duration
	NumberStartFpsRecorder[key] = {
		type, duration,
		start, end, // 起始值和终点值
		ts: FpsTimestamp, // 起始帧对应的时间戳
		startFps: RealFpsTimer, // 起始帧
		unit: getUnitNum(start, end, duration) // 单位数值变化量
	}
	return key
}

function getAnimationInfo(key) {
	return NumberStartFpsRecorder[key] || null
}

// 映射帧变化时需要执行的动作
function doWhenFpsUpdate() {

}

// 获取每映射帧的数值变化单位量
function getUnitNum(start, end, duration) {
	return (end - start) / ((duration / 1000) * RealFps)
}

// 获取记录器中某条数值记录变化后应得的数值
function getCurrentAnimationNum(key) {
	if (!key || !NumberStartFpsRecorder[key]) return null
	const { type, ts, startFps, start, end, unit } = NumberStartFpsRecorder[key]
	const tsDiff = (new Date()).getTime() - ts
	// // 前后不足1000ms的时间片段的帧数
	// const fpsDiff = RealFpsTimer > startFps ? (RealFpsTimer - startFps) : (RealFps - startFps + RealFpsTimer)
	// let addFps = fpsDiff
	// if (tsDiff >= 1000) {
	// 	// 加上 中间大于等于1000ms的时间片段的帧数
	// 	addFps = addFps + RealFps * Math.floor(tsDiff / 1000)
	// }
	const addFps = Math.floor(tsDiff / (1000 / RealFps))
	// console.log(tsDiff, (1000 / RealFps))
	let resNum = 0
	switch (type) {
		case AnimationTypes.LINEAR:
			resNum = start > end ? Math.max(start + addFps * unit, end) : Math.min(start + addFps * unit, end)
			break
	}
	// if (resNum === end) delete NumberStartFpsRecorder[key]
	return resNum
}