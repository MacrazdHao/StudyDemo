// 辅助函数：计算组合数
function choose(n, k) {
	let coeff = 1
	for (let i = 1; i <= k; i++) {
		coeff *= (n - i + 1) / i
	}
	return coeff
}
// 贝塞尔曲线数值
function bezierInterpolation(startValue, endValue, t, controlPoints) {
	if (t >= 1) return endValue
	controlPoints = controlPoints || [0, 1]
	const n = controlPoints.length - 1
	let interpolatedValue = 0
	for (let i = 0; i <= n; i++) {
		const binomialCoeff = choose(n, i)
		const factor1 = Math.pow(1 - t, n - i)
		const factor2 = Math.pow(t, i)
		interpolatedValue += controlPoints[i] * binomialCoeff * factor1 * factor2
	}
	interpolatedValue = startValue + (endValue - startValue) * interpolatedValue
	return interpolatedValue
}