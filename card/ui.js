
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
	reverseImage: 'reverse',
}
const NeedVitStyle = {
	fontSize: 12,
	width: 20,
	height: 20,
	margin: [6, 6],
	padding: [8, 7],
}
const NeedMpStyle = {
	fontSize: 12,
	width: 20,
	height: 20,
	margin: [6, 6],
	padding: [8, 7],
}
const NameStyle = {
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
function getCurrentCardPosition(cardId, defaultPos) {
	const xKey = `pos_x_${cardId}`
	const yKey = `pos_y_${cardId}`
	let xAnimKey = CardPositionAnimation[xKey] || null
	let yAnimKey = CardPositionAnimation[yKey] || null
	x = getCurrentAnimationNum(xAnimKey)
	y = getCurrentAnimationNum(yAnimKey)
	return {
		x: x || defaultPos.x,
		y: y || defaultPos.y,
	}
}
function updateCardPosisitonAnimationPos(cardId, startPos, endPos, duration = 100) {
	// if (startPos.x === endPos.x && startPos.y === endPos.y) return
	let x = endPos.x
	let y = endPos.y
	const xKey = `pos_x_${cardId}`
	const yKey = `pos_y_${cardId}`
	let xAnimKey = CardPositionAnimation[xKey] || null
	let yAnimKey = CardPositionAnimation[yKey] || null
	if (!startPos) {
		if (!xAnimKey && yAnimKey) {
			y = getCurrentAnimationNum(yAnimKey)
		}
		if (xAnimKey && !yAnimKey) {
			x = getCurrentAnimationNum(xAnimKey)
		}
		if (xAnimKey && yAnimKey) {
			x = getCurrentAnimationNum(xAnimKey)
			y = getCurrentAnimationNum(yAnimKey)
		}
	} else {
		if (!xAnimKey) {
			CardPositionAnimation[xKey] = pushAnimation(startPos.x, endPos.x, 0)
			xAnimKey = CardPositionAnimation[xKey]
		}
		if (!yAnimKey) {
			CardPositionAnimation[yKey] = pushAnimation(startPos.y, endPos.y, 500)
			yAnimKey = CardPositionAnimation[yKey]
		}
		const xAnim = getAnimationInfo(xAnimKey)
		const yAnim = getAnimationInfo(yAnimKey)
		// console.log(xAnim, yAnim)
		if (xAnim.end !== endPos.x) updateAnimationInfo(xAnimKey, { start: startPos.x, end: endPos.x })
		if (yAnim.end !== endPos.y) updateAnimationInfo(yAnimKey, { start: startPos.y, end: endPos.y })
		if (xAnim.duration !== duration) updateAnimationInfo(xAnimKey, { start: startPos.x, duration })
		if (yAnim.duration !== duration) updateAnimationInfo(yAnimKey, { start: startPos.y, duration })
		x = getCurrentAnimationNum(xAnimKey)
		y = getCurrentAnimationNum(yAnimKey)
	}
	return { x, y }
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
	// const isMouseHandCard = currentCardId === MouseHandCard
	// const { x, y } = getCurrentCardPosition(currentCardId, { x: startX + index * ShowCardWidth, y: startY - (isMouseHandCard ? MouseHandCardHoverHeight : 0) })
	const { x, y } = getCurrentCardPosition(currentCardId, { x: startX + index * ShowCardWidth, y: startY })
	let position = { x, y }
	if (!isMine) return position
	console.log(index, currentCardId, x)
	if (MousePos.x < startX || MousePos.x > endX || MousePos.y < y || MousePos.y > endY) {
		// 当前鼠标不在手牌范围内(注意，当有卡牌突出来时，应以突出部分的y为准，此处MousePos.y < y即是如此)
		MouseHandCard = null
		// 所有卡牌回到底部
		position = updateCardPosisitonAnimationPos(currentCardId, position, { x, y: startY })
	} else {
		// if ((isMouseHandCard && MousePos.x >= x && MousePos.x <= x + width && MousePos.y >= y && MousePos.y <= startY)){
		// 	// 当前index对应卡牌为鼠标所在卡牌
		// 	MouseHandCard = currentCardId
		// 	// 去往顶部
		// 	position = updateCardPosisitonAnimationPos(currentCardId, position, { x, y: startY - MouseHandCardHoverHeight })
		// }
		// 当前鼠标在手牌范围内
		if ((MousePos.x >= x && MousePos.x < x + (index === cardNum - 1 ? width : ShowCardWidth) &&
			MousePos.y >= y && MousePos.y <= endY)) {
			// 当前index对应卡牌为鼠标所在卡牌
			MouseHandCard = currentCardId
			// 去往顶部
			position = updateCardPosisitonAnimationPos(currentCardId, position, { x, y: startY - MouseHandCardHoverHeight })
		} else {
			// 当前index对应卡牌不为鼠标所在卡牌
			position = updateCardPosisitonAnimationPos(currentCardId, { x, y }, { x, y: startY })
		}
	}
	return position
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
	const { width, height } = CardStyle
	let x = pos ? pos.x : 0
	let y = pos ? pos.y : 0
	if (handCard) {
		const { index } = handCard
		const pos = getHandCardPosition(index, isMine)
		x = pos.x
		y = pos.y
	}
	let _strokeColor = CardRareColors[CardRareTypes.DEFAULT]
	if (isMine || !handCard) {
		// 卡牌类型背景色
		Context.fillStyle = color
		Context.fillRect(x, y, width, height)
		// 卡牌稀有度边框色
		_strokeColor = getGradientColor(Context, CardRareColors[rare], { x, y }, { x: x + width, y: y + height })
		Context.strokeStyle = _strokeColor
		Context.lineWidth = 2
		Context.strokeRect(x, y, width, height)
		// 体力消耗
		const needVitBoxOffset = {
			x: x + NeedVitStyle.margin[1],
			y: y + NeedVitStyle.margin[0]
		}
		const needVitFontOffset = {
			x: needVitBoxOffset.x + NeedVitStyle.padding[1],
			y: needVitBoxOffset.y + NeedVitStyle.fontSize / 2 + NeedVitStyle.padding[0]
		}
		Context.fillStyle = CardItemColors[CardItems.NEEDVIT]
		Context.fillRect(needVitBoxOffset.x, needVitBoxOffset.y, NeedVitStyle.width, NeedVitStyle.height)
		Context.font = `${NeedVitStyle.fontSize}px Georgia`;
		Context.fillStyle = CardItemFontColors[CardItems.NEEDVIT]
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
			Context.fillStyle = CardItemColors[CardItems.NEEDMP]
			Context.fillRect(needMpBoxOffset.x, needMpBoxOffset.y, NeedMpStyle.width, NeedMpStyle.height)
			Context.font = `${NeedMpStyle.fontSize}px Georgia`;
			Context.fillStyle = CardItemFontColors[CardItems.NEEDMP]
			Context.fillText(needMp, needMpFontOffset.x, needMpFontOffset.y)
			nameBoxOffset.x = needMpBoxOffset.x + NeedMpStyle.width + NameStyle.margin[1]
			nameWidth = nameWidth - NeedMpStyle.width - NeedMpStyle.margin[1]
		}
		// 名称
		const nameFontOffset = {
			x: nameBoxOffset.x + NameStyle.padding[1],
			y: nameBoxOffset.y + NameStyle.fontSize / 2 + NameStyle.padding[0]
		}
		Context.fillStyle = CardItemColors[CardItems.NAME]
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
		Context.fillStyle = CardItemColors[CardItems.DESC]
		Context.fillRect(descOffset.x, descOffset.y, descWidth, descHeight)
		drawText(desc, textWidth, textHeight, DescStyle.fontSize, DescStyle.fontSize + 2, CardItemFontColors[CardItems.DESC], descFontOffset)
	} else {
		Context.drawImage(getImage(CardStyle.reverseImage), x, y, width, height)
	}
	// 卡牌稀有度炫彩色
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
}
// 开始帧监听
function updateFrame() {
	getFrame()
}