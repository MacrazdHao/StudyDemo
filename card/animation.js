const StaticFrames = 60 // 固定帧，用于过渡动画
let DynamicFrames = 0 // 动态帧，requestAnimationFrame的频率
const unitFrameTime = 6000 / StaticFrames // 每固定帧间隔多少毫秒
let ConvertFramesUnit = 0 // 动态帧对应固定帧的比例
let DynamicFramesTimer = null // 动态帧侦听器(计时器)
let DynamicFramesCycleTimer = 0 // 动态帧循环计数器

// 动画栈
const AnimationStack = {}
// 线性动画
function getLinearUnit(startValue, endValue, duration) {
	return (endValue - startValue) * unitFrameTime / duration
}
// 请求动画
function requestAnimation({ animationId, startValue, endValue, duration = 200, animationType = 'linear' }) {
	let frameUnitValue = animationId ? AnimationStack[animationId].frameUnitValue : 0
	const _endValue = endValue || AnimationStack[animationId].endValue
	const _startValue = animationId ? endValue ? AnimationStack[animationId].currentValue : AnimationStack[animationId].startValue : startValue
	
	const _currentValue = animationId ? AnimationStack[animationId].currentValue : startValue
	const _frameTimer = animationId ? AnimationStack[animationId].currentValue : 0
	const _duration = animationId ? AnimationStack[animationId].duration : duration
	if (!animationId ||
		(animationId &&
			(animationType !== AnimationStack[animationId].animationType
				|| _endValue !== AnimationStack[animationId].endValue
			)
		)
	) {
		switch (animationType) {
			case 'linear': frameUnitValue = getLinearUnit(_startValue, _endValue, _duration); break;
		}
	}
	const id = animationId || getRandomKey()
	AnimationStack[id] = {
		startValue: _startValue,
		endValue: _endValue,
		currentValue: _currentValue,
		duration,
		frameUnitValue,
		frameTimer: _frameTimer,
		animationType
	}
	return id
}
// 获取动画的变动值
function getAnimationCurrentValue(animationId) {
	return AnimationStack[animationId]?.currentValue
}
// 获取动画的起始值
function getAnimationStartValue(animationId) {
	return AnimationStack[animationId]?.startValue
}
// 获取动画的终止值
function getAnimationEndValue(animationId) {
	return AnimationStack[animationId]?.endValue
}
// 获取动画对象
function getAnimationObject(animationId) {
	return AnimationStack[animationId] || null
}

// 侦听动态帧
function dynamicFramesListener() {
	DynamicFramesTimer = setInterval(() => {
		ConvertFramesUnit = Math.ceil(DynamicFrames / StaticFrames)
		DynamicFrames = 0
	}, 1000)
}
// 静态帧动画循环
function doAnimation() {
	if (ConvertFramesUnit > 0) DynamicFramesCycleTimer++
	if (DynamicFramesCycleTimer === ConvertFramesUnit) {
		DynamicFramesCycleTimer = 0
		for (let aId in AnimationStack) {
			let { currentValue, frameUnitValue, startValue, endValue } = AnimationStack[aId]
			const addType = startValue < endValue
			// console.log(AnimationStack[aId])
			if ((addType && currentValue < endValue) || (!addType && currentValue > endValue)) {
				if ((addType && endValue - AnimationStack[aId].currentValue < frameUnitValue) || (!addType && endValue - AnimationStack[aId].currentValue > frameUnitValue)) {
					AnimationStack[aId].currentValue = endValue
				} else {
					AnimationStack[aId].currentValue += frameUnitValue
				}
				// console.log(AnimationStack[aId])
			} else if ((startValue < endValue && currentValue >= endValue) || (startValue > endValue && currentValue <= endValue)) {
				// delete AnimationStack[aId]
			}
		}
	}
}