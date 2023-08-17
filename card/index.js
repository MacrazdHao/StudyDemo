// 游戏主循环
function startPolling() {
	updateFrame()
	gameStatusListener()
	fightStatusListener()
	roundStatusListener()
	requestAnimationFrame(startPolling)
}
// 主应用
function main() {
	window.addEventListener('mouseenter', getMousePos)
	window.addEventListener('mousemove', getMousePos)
	window.addEventListener('click', (e) => {
		mouseClick(e, true)
	})
	StartButton.addEventListener('click', gameStartFunc)
	FightButton.addEventListener('click', fightStartFunc)
	dynamicFramesListener()
	startPolling()
}
main()