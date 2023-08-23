// 获取随机ID
function getRandomKey() {
	return Math.random().toString(36).slice(2)
}
// 将坐标转为相对canvas的坐标
function windowToCanvas(x, y, originPoint) {
	let cvsbox = GameWindow.getBoundingClientRect();
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
// 随机色
function getRandomColor(minR = 0, maxR = 255, minG = 0, maxG = 255, minB = 0, maxB = 255) {
	const colorR = getIntRandom(maxR, minR)
	const colorG = getIntRandom(maxG, minG)
	const colorB = getIntRandom(maxB, minB)
	return `rgb(${colorR}, ${colorG}, ${colorB})`
}
// 逐色增加
// function getUpperColor(rgba) {
// 	let UpperColorTimer = 0
// 	let ColorBuffer = null
// 	return function () {
// 		ColorBuffer = rgba
// 		UpperColorTimer++
// 		if (UpperColorTimer % 120 * 3 === 0) {
// 			const _rgba = ColorBuffer.replace(/rgba\(|\)/g, '').split(',')
// 			const r = _rgba[0] + 10 ? 0 : (_rgba[0] + 10)
// 			const g = _rgba[1] + 10 ? 0 : (_rgba[1] + 10)
// 			const b = _rgba[2] + 10 ? 0 : (_rgba[2] + 10)
// 			const a = _rgba[3] || 1
// 			ColorBuffer = `rgba(${r},${g},${b},${a})`
// 		}
// 	}
// }
// 获取渐变色
function getGradientColor(ctx, colorsMap = {}, startPos, endPos) {
	let strokeColor = ctx.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y)
	const colorProcess = Object.keys(colorsMap).sort((a, b) => a - b)
	colorProcess.forEach((process) => {
		strokeColor.addColorStop(process, colorsMap[process])
	})
	return strokeColor
}
// 随机重排数组
function randomArray(arr = []) {
	return arr.sort(() => Math.random() - 0.5)
}
