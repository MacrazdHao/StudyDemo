
const DefaultCardPath = '/images/none.png'
const ImagesMap = {}
const CardImages = {
	'/images/none.png': null, // 默认图，不会存入ImagesMap中
}
function addImage(key, path) {
	LoadingInfoDom.style.display = 'inline'
	LoadingInfoDom.innerHTML = `加载资源中 - ${path}`
	return new Promise(resolve => {
		ImagesMap[key] = path
		CardImages[path] = null
		loadCardImages().then(() => {
			resolve()
			LoadingInfoDom.style.display = 'none'
			LoadingInfoDom.innerHTML = ''
		})
	})
}
// 根据ImagesMapKey或CardImagesPath获取图片资源
function getImage(key) {
	if (!ImagesMap[key]) {
		if (!CardImages[key]) return CardImages[DefaultCardPath]
		return CardImages[key]
	}
	return CardImages[ImagesMap[key]]
}
// 静态资源加载
function loadCardImages() {
	return new Promise(resolve => {
		let finishImgNum = 0
		let allImgNum = 0
		for (let path in CardImages) {
			if (CardImages[path]) continue
			allImgNum++
			const img = new Image()
			img.src = baseurl + path
			img.onload = function () {
				CardImages[path] = this
				finishImgNum++
			}
			img.onerror = function () {
				CardImages[path] = 'notfound'
				finishImgNum++
			}
		}
		const waitingTimer = setInterval(() => {
			if (finishImgNum === allImgNum) {
				for (let path in CardImages) {
					if (CardImages[path] === 'notfound') {
						CardImages[path] = CardImages[DefaultCardPath]
					}
				}
				clearInterval(waitingTimer)
				resolve()
			}
		}, 100)
	})
}
// 默认静态图片资源加载
async function loadDefaultImages() {
	await loadCardImages()
}