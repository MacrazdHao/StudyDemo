
// 画球
function drawBall({ x, y, radius = 10, color }) {
	Context.fillStyle = color
	Context.beginPath()
	Context.arc(x, y, radius, 0, 2 * Math.PI)
	Context.closePath()
	Context.fill()
}
function drawMouse() {
	drawBall(MousePos)
}

let DesktopCard = null
const CardPositionAnimation = {}

const CardStyle = {
	width: 150,
	height: 240,
	strokeColor: '#3f2400',
	reverseColor: 'gray'
}
const DesktopCardPosition = {
	x: (WhiteBoardWidth - CardStyle.width) / 2,
	y: (WhiteBoardHeight - CardStyle.height) / 2,
}
const HandCardShowRatio = 1 / 3
const ShowCardWidth = CardStyle.width * HandCardShowRatio
const MouseHandCardHoverHeight = 30
function updateCardPosisitonAnimationPos(cardId, startValue, endValue) {
	return endValue
	// let xAnimId = null
	// let yAnimId = null
	// if (!CardPositionAnimation[cardId]) {
	// 	if (!endValue) {
	// 		return startValue
	// 	}
	// 	if (!startValue) {
	// 		return endValue
	// 	}
	// 	if (!startValue && !endValue) {
	// 		return null
	// 	}
	// 	xAnimId = requestAnimation({
	// 		startValue: startValue.x, endValue: endValue.x,
	// 		duration: 3000
	// 	})
	// 	yAnimId = requestAnimation({
	// 		startValue: startValue.y, endValue: endValue.y,
	// 		duration: 3000
	// 	})
	// } else {
	// 	xAnimId = CardPositionAnimation[cardId].xAnimId
	// 	yAnimId = CardPositionAnimation[cardId].yAnimId
	// 	if (endValue) {
	// 		requestAnimation({
	// 			animationId: xAnimId,
	// 			// endValue: endValue.x
	// 		})
	// 		requestAnimation({
	// 			animationId: yAnimId,
	// 			// endValue: endValue.y
	// 		})
	// 	}
	// }
	// const x = getAnimationCurrentValue(xAnimId)
	// const y = getAnimationCurrentValue(yAnimId)
	// CardPositionAnimation[cardId] = {
	// 	xAnimId,
	// 	yAnimId
	// }
	// return { x, y }
}
// 获取手牌坐标
function getHandCardPosition(index, isMine = true) {
	const _player = isMine ? Player : EnemyPlayer
	const { width, height } = CardStyle
	const cardNum = _player.handCards.length
	const totalWidth = width + width * (cardNum - 1) * HandCardShowRatio
	const startX = (WhiteBoardWidth - totalWidth) / 2
	const endX = startX + totalWidth
	const startY = isMine ? WhiteBoardHeight - CardStyle.height : -160
	const endY = startY + height
	const currentCardId = _player.handCards[index]
	const isMouseHandCard = currentCardId === MouseHandCard
	const x = startX + index * ShowCardWidth
	const y = startY - (isMouseHandCard ? MouseHandCardHoverHeight : 0)
	if (isMine) {
		if (!isMouseHandCard && MousePos.x >= x && MousePos.x < x + (index === cardNum - 1 ? width : ShowCardWidth) &&
			MousePos.y >= y && MousePos.y <= y + height) {
			MouseHandCard = currentCardId
			const position = getHandCardPosition(index)
			return updateCardPosisitonAnimationPos(currentCardId, { x, y: startY }, { x: position.x, y: position.y })
		}
		if (MouseHandCard && (MousePos.x < startX || MousePos.x > endX ||
			MousePos.y < startY || MousePos.y > endY)) {
			MouseHandCard = null
			const position = getHandCardPosition(index)
			// if (isMouseHandCard) return updateCardPosisitonAnimationPos(currentCardId, { x, y: startY - MouseHandCardHoverHeight }, { x: position.x, y: position.y })
			return updateCardPosisitonAnimationPos(currentCardId, null, { x, y })
		}
	}
	return updateCardPosisitonAnimationPos(currentCardId, null, { x, y })
}

// 绘画卡牌
function drawCard(card, pos, handCard) {
	const isMine = PlayerId === card.owner
	const { color } = card
	const { width, height, strokeColor, reverseColor } = CardStyle
	let x = pos ? pos.x : 0
	let y = pos ? pos.y : 0
	if (handCard) {
		const { index } = handCard
		const pos = getHandCardPosition(index, isMine)
		x = pos.x
		y = pos.y
	}
	Context.fillStyle = isMine ? color : reverseColor
	Context.fillRect(x, y, width, height)
	Context.strokeStyle = strokeColor
	Context.lineWidth = 2
	Context.strokeRect(x, y, width, height)
	return {
		...card,
		x, y
	}
}
// 画出手牌
function drawHandCards() {
	const { handCards: myHandCards } = Player
	const { handCards: enHandCards } = EnemyPlayer
	const myHandCardsNum = myHandCards.length
	const enHandCardsNum = enHandCards.length
	for (let i = 0; i < myHandCardsNum; i++) {
		const card = getCardInfo(myHandCards[i])
		drawCard(card, null, { index: i })
	}
	for (let i = 0; i < enHandCardsNum; i++) {
		const card = getCardInfo(enHandCards[i], false)
		drawCard(card, null, { index: i })
	}
}
// 画出桌面的牌
function drawDesktopCard() {
	if (DesktopCard) drawCard(DesktopCard, DesktopCardPosition)
}
// 更新玩家数据
function updatePlayerInfoUI() {
	if (JSON.stringify(Player) !== '{}') {
		MyNameDom.innerHTML = Player.name
		MySHDDom.innerHTML = Player.shd
		MyHPDom.innerHTML = Player.hp
		MyMPDom.innerHTML = Player.mp
		MyVITDom.innerHTML = Player.vit
		MyFightCardsDom.innerHTML = Player.fightCards.length
		MyFightUsedCardsDom.innerHTML = Player.fightUsedCards.length
	}
	if (JSON.stringify(EnemyPlayer) !== '{}') {
		EnemyNameDom.innerHTML = EnemyPlayer.name
		EnemySHDDom.innerHTML = EnemyPlayer.shd
		EnemyHPDom.innerHTML = EnemyPlayer.hp
		EnemyMPDom.innerHTML = EnemyPlayer.mp
		EnemyVITDom.innerHTML = EnemyPlayer.vit
		EnemyFightCardsDom.innerHTML = EnemyPlayer.fightCards.length
		EnemyFightUsedCardsDom.innerHTML = EnemyPlayer.fightUsedCards.length
	}
}
// 帧
function getFrame() {
	Context.clearRect(0, 0, GameWindow.offsetWidth, GameWindow.offsetHeight)
	updatePlayerInfoUI()
	if (FightStatus === FightStatusTypes.FIGHTING) {
		drawHandCards()
		drawDesktopCard()
	}
	drawMouse()
	DynamicFrames++
}
// 开始帧监听
function updateFrame() {
	getFrame()
	doAnimation()
}