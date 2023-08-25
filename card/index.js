// 游戏主循环
function startPolling() {
	fpsListener()
	updateFrame()
	gameStatusListener()
	fightStatusListener()
	roundStatusListener()
	requestAnimationFrame(startPolling)
}
// 自定义函数：加载所需静态资源
async function setImages() {
	addImage('reverse', '/images/reverse2.jpg')
	addImage('guo', '/images/guo.jpg')
	addImage('quan', '/images/quan.jpg')
	addImage('xianyu', '/images/xianyu.jpg')
	addImage('xianyu_dian', '/images/xianyu_dian.jpg')
	addImage('zhexue', '/images/zhexue.jpg')
	addImage('bian', '/images/bian.jpg')
	addImage('haozi', '/images/haozi.jpeg')
	addImage('houzi', '/images/houzi.jpeg')
	addImage('lvshihan', '/images/lvshihan.jpg')
	addImage('shutou', '/images/shutou.jpg')
	addImage('taimei_kuang', '/images/taimei_kuang.png')
	addImage('taimei', '/images/taimei.png')
	addImage('biaomei', '/images/biaomei.jpg')
	addImage('xizi', '/images/xizi.jpg')
	addImage('xizi2', '/images/xizi2.png')
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
	// dynamicFramesListener()
	startPolling()
	// })
}
main()