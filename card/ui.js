
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

const HeaderBoxMargin = 3
const HeaderBoxPadding = 3
const CardStyle = {
	width: 180,
	height: 240,
	strokeColor: '#3f2400',
	reverseColor: 'gray',
}
const NeedVitStyle = {
	fontColor: 'white',
	fontSize: 12,
	width: 20,
	height: 20,
	margin: [6, 6],
	padding: [8, 7],
}
const NeedMpStyle = {
	fontColor: 'white',
	fontSize: 12,
	width: 20,
	height: 20,
	margin: [6, 6],
	padding: [8, 7],
}
const NameStyle = {
	background: 'white',
	fontColor: 'black',
	fontSize: 12,
	// width: CardStyle.width - NeedVitStyle.width - NeedVitStyle.margin[1] - 6,
	height: 20,
	margin: [6, 6, 0, 6],
	padding: [8, 7],
	offset: {
		x: CardStyle.width + NeedVitStyle.width + 6 + 6,
		y: HeaderBoxMargin * 2
	},
	textOffset: {
		x: CardStyle.width + NeedVitStyle.width + 6 + 6 + 6,
		y: HeaderBoxMargin * 2 + 14
	}
}
const IllustrationStyle = {
	height: 140,
	margin: [6, 6, 0, 6],
}
const DescStyle = {
	background: 'white',
	fontColor: 'black',
	fontSize: 10,
	margin: [6, 6, 6, 6],
	padding: [8, 7, 8, 7],
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
// 获取文字内容的行内容
function getTextLines(text, width, height, fontSize, lineHeight) {
	const _text = text.split('')
	let line = ''
	let lines = []
	for (let i = 0; i < _text.length; i++) {
		const isOverHeight = !(lines.length * lineHeight < height && lines.length * lineHeight + lineHeight < height)
		if (Context.measureText(line).width < width && Context.measureText(line + _text[i]).width < width) {
			line += _text[i]
		} else {
			lines.push(line)
			line = _text[i]
		}
	}
	lines.push(line)
	return lines
}
// 绘画文字
function drawText(text, width, height, fontSize, lineHeight, color = 'black', position, wrap = false, hidden = true) {
	Context.font = `${fontSize} Georgia`
	lineHeight = lineHeight || fontSize + 4
	const lines = getTextLines(text, width, height, lineHeight, lineHeight)
	lines.forEach((line, index) => {
		Context.fillStyle = color
		Context.fillText(line, position.x, position.y + index * lineHeight)
	})
}
// 绘画卡牌
function drawCard(card, pos, handCard) {
	const isMine = PlayerId === card.owner
	const { name, desc, image, color, rare, needVit, needMp, types } = card
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
		// 卡牌类型背景色
		Context.fillStyle = color
		_strokeColor = getGradientColor(Context, CardRareColors[rare], { x, y }, { x: x + width, y: y + height })
		Context.fillRect(x, y, width, height)
		// 卡牌稀有度边框色
		Context.strokeStyle = _strokeColor
		Context.lineWidth = 2
		Context.strokeRect(x, y, width, height)
		// 卡牌默认内边框色
		Context.strokeStyle = strokeColor
		Context.lineWidth = 1
		Context.strokeRect(x + 2, y + 2, width - 4, height - 4)
		// 体力消耗
		const needVitBoxOffset = {
			x: x + NeedVitStyle.margin[1],
			y: y + NeedVitStyle.margin[0]
		}
		const needVitFontOffset = {
			x: needVitBoxOffset.x + NeedVitStyle.padding[1],
			y: needVitBoxOffset.y + NeedVitStyle.fontSize / 2 + NeedVitStyle.padding[0]
		}
		Context.fillStyle = _strokeColor
		Context.fillRect(needVitBoxOffset.x, needVitBoxOffset.y, NeedVitStyle.width, NeedVitStyle.height)
		Context.font = `${NeedVitStyle.fontSize}px Georgia`;
		Context.fillStyle = NeedVitStyle.fontColor
		Context.fillText(needVit, needVitFontOffset.x, needVitFontOffset.y)
		const nameBoxOffset = {
			x: needVitBoxOffset.x + NeedVitStyle.width + NameStyle.margin[1],
			y: y + NeedVitStyle.margin[0]
		}
		let nameWidth = CardStyle.width - NameStyle.margin[1] - NameStyle.margin[3] - NeedVitStyle.width - NeedMpStyle.margin[1]
		// 魔法消耗
		const isMagicCard = types.includes(CardTypes.MAGIC)
		if (isMagicCard) {
			const needMpBoxOffset = {
				x: needVitBoxOffset.x + NeedVitStyle.width + NeedMpStyle.margin[1],
				y: y + NeedMpStyle.margin[0]
			}
			const needMpFontOffset = {
				x: needMpBoxOffset.x + NeedVitStyle.padding[1],
				y: needMpBoxOffset.y + NeedMpStyle.fontSize / 2 + NeedMpStyle.padding[0]
			}
			Context.fillStyle = _strokeColor
			Context.fillRect(needMpBoxOffset.x, needMpBoxOffset.y, NeedMpStyle.width, NeedMpStyle.height)
			Context.font = `${NeedMpStyle.fontSize}px Georgia`;
			Context.fillStyle = NeedMpStyle.fontColor
			Context.fillText(needMp, needMpFontOffset.x, needMpFontOffset.y)
			nameBoxOffset.x = needMpBoxOffset.x + NeedMpStyle.width + NameStyle.margin[1]
			nameWidth = nameWidth - NeedMpStyle.width - NeedMpStyle.margin[1]
		}
		// 名称
		const nameFontOffset = {
			x: nameBoxOffset.x + NameStyle.padding[1],
			y: nameBoxOffset.y + NameStyle.fontSize / 2 + NameStyle.padding[0]
		}
		Context.fillStyle = NameStyle.background
		Context.fillRect(nameBoxOffset.x, nameBoxOffset.y, nameWidth, NameStyle.height)
		Context.font = `${NameStyle.fontSize}px Georgia`;
		Context.fillStyle = '#000'
		Context.fillText(name, nameFontOffset.x, nameFontOffset.y)
		// 插画
		const illustrationWidth = CardStyle.width - IllustrationStyle.margin[1] - IllustrationStyle.margin[3]
		const illustrationOffset = {
			x: x + IllustrationStyle.margin[1],
			y: nameBoxOffset.y + NameStyle.height + IllustrationStyle.margin[0]
		}
		Context.drawImage(getImage(image), illustrationOffset.x, illustrationOffset.y, illustrationWidth, IllustrationStyle.height)
		// 描述
		const descWidth = CardStyle.width - DescStyle.margin[1] - DescStyle.margin[3]
		const textWidth = descWidth - DescStyle.padding[1] - DescStyle.padding[3]
		const descHeight = CardStyle.height - NameStyle.margin[0] - NameStyle.height - IllustrationStyle.margin[0] - IllustrationStyle.height - DescStyle.margin[0] - DescStyle.margin[2]
		const textHeight = descHeight - DescStyle.padding[0] - DescStyle.padding[2]
		const descOffset = {
			x: x + DescStyle.margin[1],
			y: illustrationOffset.y + IllustrationStyle.height + DescStyle.margin[0]
		}
		const descFontOffset = {
			x: descOffset.x + DescStyle.padding[1],
			y: descOffset.y + DescStyle.fontSize / 2 + DescStyle.padding[0]
		}
		Context.fillStyle = DescStyle.background
		Context.fillRect(descOffset.x, descOffset.y, descWidth, descHeight)
		// Context.font = `${DescStyle.fontSize}px Georgia`;
		// Context.fillStyle = DescStyle.fontColor
		// Context.fillText(desc, descFontOffset.x, descFontOffset.y)
		drawText(desc, textWidth, textHeight, DescStyle.fontSize, DescStyle.fontSize + 2, DescStyle.fontColor, descFontOffset)
	} else {
		Context.fillStyle = reverseColor
		Context.fillRect(x, y, width, height)
		Context.strokeStyle = _strokeColor
		Context.lineWidth = 2
		Context.strokeRect(x, y, width, height)
		Context.strokeStyle = strokeColor
		Context.lineWidth = 1
		Context.strokeRect(x + 2, y + 2, width - 4, height - 4)
	}
	Context.fillStyle = _strokeColor
	Context.fillRect(x, y, width, height)
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
		MyAtkDom.innerHTML = Player[BaseValueAttributeKeys.ATTACK]
		MyPenAtkDom.innerHTML = Player[BaseValueAttributeKeys.PENATTACK]
		MyHPDom.innerHTML = Player[BaseValueAttributeKeys.HP]
		MySHDDom.innerHTML = Player[BaseValueAttributeKeys.SHIELD]
		MyMPDom.innerHTML = Player[BaseValueAttributeKeys.MP]
		MyVITDom.innerHTML = Player[BaseValueAttributeKeys.VITALITY]
		MyFightCardsDom.innerHTML = Player.fightCards.length
		MyFightUsedCardsDom.innerHTML = Player.fightUsedCards.length
	}
	if (JSON.stringify(EnemyPlayer) !== '{}') {
		EnemyNameDom.innerHTML = EnemyPlayer.name
		EnemyAtkDom.innerHTML = EnemyPlayer[BaseValueAttributeKeys.ATTACK]
		EnemyPenAtkDom.innerHTML = EnemyPlayer[BaseValueAttributeKeys.PENATTACK]
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