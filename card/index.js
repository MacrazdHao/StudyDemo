// 游戏主循环
function startPolling() {
	updateFrame()
	gameStatusListener()
	fightStatusListener()
	roundStatusListener()
	requestAnimationFrame(startPolling)
}
// 自定义函数：加载所需静态资源
async function setImages() {
	addImage('guo', '/images/guo.jpg')
	addImage('quan', '/images/quan.jpg')
	addImage('xianyu', '/images/xianyu.jpg')
	addImage('xianyu_dian', '/images/xianyu_dian.jpg')
	addImage('zhexue', '/images/zhexue.jpg')
}
// 主应用
async function main() {
	// loadCardImages().then(() => {
	await loadDefaultImages()
	setImages()
	window.addEventListener('mouseenter', getMousePos)
	window.addEventListener('mousemove', getMousePos)
	window.addEventListener('click', (e) => {
		mouseClick(e, true)
	})
	StartButton.addEventListener('click', gameStartFunc)
	FightButton.addEventListener('click', fightStartFunc)
	RetryButton.addEventListener('click', retryFunc)
	EndRoundButton.addEventListener('click', roundEndFunc)
	dynamicFramesListener()
	startPolling()
	// })
}
main()