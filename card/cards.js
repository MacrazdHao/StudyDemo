// 卡牌类型-属性自带默认值
const CardTypesProto = {
	[CardTypes.COMMON]: {},
	[CardTypes.ATTACK]: {
		color: CardColors[CardTypes.ATTACK]
	},
	[CardTypes.DEFENSE]: {
		color: CardColors[CardTypes.DEFENSE]
	},
	[CardTypes.MAGIC]: {
		color: CardColors[CardTypes.MAGIC]
	},
	[CardTypes.PROPS]: {
		color: CardColors[CardTypes.PROPS]
	},
}
// 卡牌类型属性key-index
// [属性Key]: index
const CardBaseProto = {
	[CardTypes.COMMON]: {
		name: { defaultValue: '' },
		desc: { defaultValue: '' },
		color: { defaultValue: CardColors[CardTypes.COMMON] },
		status: { defaultValue: 0 },
		statusTypes: { defaultValue: [] },
		fightUseTimes: { defaultValue: MAXNUM }, // 当次战斗可使用次数
		gameUseTimes: { defaultValue: MAXNUM }, // 当局游戏可使用次数
		needVit: { defaultValue: 1 }, // 体力消耗值
		rare: { defaultValue: CardRareTypes.DEFAULT }, // 体力消耗值
		image: { defaultValue: null },
		conditions: { defaultValue: 'None' },
		effects: { defaultValue: 'None' },
	},
	[CardTypes.ATTACK]: {
		[BaseValueAttributeKeys.ATTACK]: { defaultValue: 0 }, // 普通伤害
		[BaseValueAttributeKeys.PENATTACK]: { defaultValue: 0 }, // 穿透伤害
		selfAtk: { defaultValue: 0 }, // 己方伤害
		selfPenAtk: { defaultValue: 0 }, // 己方穿透伤害
	},
	[CardTypes.DEFENSE]: {
		shd: { defaultValue: 0 },
	},
	[CardTypes.MAGIC]: {
	},
	[CardTypes.PROPS]: {
	},
}
// 组合类属性
function blendCardTypeProto(mainCardType = CardTypes.COMMON, type = '', values = []) {
	const proto = {}
	for (let pKey in CardBaseProto[type]) {
		const { defaultValue } = CardBaseProto[type][pKey]
		proto[pKey] = values[pKey] || CardTypesProto[mainCardType][pKey] || defaultValue
		if (pKey === 'effects') {
			proto[pKey] = PresetEffects[proto[pKey]]
		}
		if (pKey === 'conditions') {
			proto[pKey] = PresetConditions[proto[pKey]]
		}
	}
	return proto
}
// 创建卡牌对象
function createCardObject(cardKey = '', extraAttr = {}) {
	const { types, values } = Cards[cardKey]
	let card = { types: [...types, CardTypes.COMMON] }
	const mType = card.types[0]
	for (let vType in values) {
		const typeAttrs = values[vType]
		card = {
			...card,
			...blendCardTypeProto(mType, vType, typeAttrs),
			...extraAttr
		}
	}
	return {
		id: getRandomKey(), key: cardKey, ...card,
		// conditions: PresetConditions[conditions],
		// effects: PresetEffects[effects],
	}
}
// 生成卡组
function generateCardsGroup(playerId, cardsMap = {}) {
	const cards = {}
	for (let cKey in cardsMap) {
		const num = cardsMap[cKey]
		for (let i = 0; i < num; i++) {
			const card = createCardObject(cKey)
			cards[card.id] = { ...card, owner: playerId }
		}
	}
	return cards
}
