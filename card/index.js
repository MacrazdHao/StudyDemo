// 游戏主循环
function startPolling() {
	updateFrame()
	roundListener()
	requestAnimationFrame(startPolling)
}
// 主应用
function main() {
	window.addEventListener('mouseenter', getMousePos)
	window.addEventListener('mousemove', getMousePos)
	window.addEventListener('click', (e) => {
		mouseClick(e, true)
	})
	dynamicFramesListener()
	startPolling()
	startFight()
}
main()