
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
	width: 180,
	height: 240,
	strokeColor: '#3f2400',
	reverseColor: 'gray',
}
const NameStyle = {
	background: 'white',
	fontColor: 'black',
	fontSize: 12,
	width: CardStyle.width - 6 * 2,
	height: 20,
	offset: {
		x: 6,
		y: 6
	},
	textOffset: {
		x: 6 + 4,
		y: 6 + 14
	}
}
const DescStyle = {
	background: 'white',
	fontColor: 'black',
	fontSize: 10,
	width: CardStyle.width - 6 * 2,
	height: 48,
	offset: {
		x: 6,
		y: CardStyle.height - 48 - 6
	},
	textOffset: {
		x: 6 + 4,
		y: CardStyle.height - 48 - 6 + 14
	}
}
const IllustrationStyle = {
	width: CardStyle.width - 6 * 2,
	height: CardStyle.height - NameStyle.height - DescStyle.height - NameStyle.offset.y - 12 - 6,
	offset: {
		x: 6,
		y: NameStyle.offset.y + NameStyle.height + 6
	},
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
	const { name, desc, image, color, rare } = card
	const { width, height, strokeColor, reverseColor } = CardStyle
	let x = pos ? pos.x : 0
	let y = pos ? pos.y : 0
	if (handCard) {
		const { index } = handCard
		const pos = getHandCardPosition(index, isMine)
		x = pos.x
		y = pos.y
	}
	let _strokeColor = strokeColor
	if (isMine || !handCard) {
		Context.fillStyle = color
		_strokeColor = CardRareColors[rare]
		if (rare === CardRareTypes.UNIQUE) {
			_strokeColor = Context.createLinearGradient(x, y, x + width, y + height)
			CardRareColors[rare].forEach((color, index, arr) => {
				_strokeColor.addColorStop(index / arr.length, color)
			})
		}
	} else Context.fillStyle = reverseColor
	Context.fillRect(x, y, width, height)
	Context.strokeStyle = _strokeColor
	Context.lineWidth = 2
	Context.strokeRect(x, y, width, height)
	Context.strokeStyle = strokeColor
	Context.lineWidth = 1
	Context.strokeRect(x + 2, y + 2, width - 4, height - 4)


	// 名称
	Context.fillStyle = NameStyle.background
	Context.fillRect(x + NameStyle.offset.x, y + NameStyle.offset.y, NameStyle.width, NameStyle.height)
	Context.font = `${NameStyle.fontSize}px Georgia`;
	Context.fillStyle = NameStyle.fontColor
	Context.fillText(name, x + NameStyle.textOffset.x, y + NameStyle.textOffset.y)
	// 插画
	Context.fillStyle = 'blue'
	Context.drawImage(CardImages[image], x + IllustrationStyle.offset.x, y + IllustrationStyle.offset.y, IllustrationStyle.width, IllustrationStyle.height)
	// 描述
	Context.fillStyle = DescStyle.background
	Context.fillRect(x + DescStyle.offset.x, y + DescStyle.offset.y, DescStyle.width, DescStyle.height)
	Context.font = `${DescStyle.fontSize}px Georgia`;
	Context.fillStyle = DescStyle.fontColor
	Context.fillText(desc, x + DescStyle.textOffset.x, y + DescStyle.textOffset.y)
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
		MyHPDom.innerHTML = Player[BaseValueAttributeKeys.HP]
		MySHDDom.innerHTML = Player[BaseValueAttributeKeys.SHIELD]
		MyMPDom.innerHTML = Player[BaseValueAttributeKeys.MP]
		MyVITDom.innerHTML = Player[BaseValueAttributeKeys.VITALITY]
		MyFightCardsDom.innerHTML = Player.fightCards.length
		MyFightUsedCardsDom.innerHTML = Player.fightUsedCards.length
	}
	if (JSON.stringify(EnemyPlayer) !== '{}') {
		EnemyNameDom.innerHTML = EnemyPlayer.name
		EnemyHPDom.innerHTML = EnemyPlayer[BaseValueAttributeKeys.HP]
		EnemySHDDom.innerHTML = EnemyPlayer[BaseValueAttributeKeys.SHIELD]
		EnemyMPDom.innerHTML = EnemyPlayer[BaseValueAttributeKeys.MP]
		EnemyVITDom.innerHTML = EnemyPlayer[BaseValueAttributeKeys.VITALITY]
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