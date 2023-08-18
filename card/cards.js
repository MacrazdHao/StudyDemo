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
		name: { index: 0, defaultValue: '' },
		desc: { index: 1, defaultValue: '' },
		color: { index: 2, defaultValue: CardColors[CardTypes.COMMON] },
		status: { index: 3, defaultValue: 0 },
		statusTypes: { index: 4, defaultValue: [] },
		fightUseTimes: { index: 5, defaultValue: 9999999 }, // 当次战斗可使用次数
		gameUseTimes: { index: 6, defaultValue: 9999999 }, // 当局游戏可使用次数
		vit: { index: 7, defaultValue: 1 }, // 体力消耗值
		conditions: {
			// 卡牌使用条件
			index: 8,
			defaultValue: function () { return true }
		},
		effects: {
			// 卡牌特殊效果
			index: 9,
			defaultValue: function () { }
		},
	},
	[CardTypes.ATTACK]: {
		atk: { index: 0, defaultValue: 0 }, // 普通伤害
		penAtk: { index: 1, defaultValue: 0 }, // 穿透伤害
		selfAtk: { index: 2, defaultValue: 0 }, // 己方伤害
		selfPenAtk: { index: 3, defaultValue: 0 }, // 己方穿透伤害
	},
	[CardTypes.DEFENSE]: {
		shd: { index: 0, defaultValue: 0 },
	},
	[CardTypes.MAGIC]: {

	},
	[CardTypes.PROPS]: {

	},
}
/**
 * 卡牌原型
 * [卡牌Key]: {
 * 	types: Array(卡牌类型),
 * 	value: {
 * 		[卡牌类型ID]: Array(对应属性值)
 * 		// ...
 * 	}
 * }
 */
const Cards = {
	NormalAttack1: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: ['普通攻击', '造成1点伤害'],
			[CardTypes.ATTACK]: [1]
		}
	},
	NormalDefense1: {
		types: [CardTypes.DEFENSE],
		values: {
			[CardTypes.COMMON]: ['普通盾牌', '护盾+2'],
			[CardTypes.DEFENSE]: [1]
		}
	},
}
// 卡牌条件函数
const CardsConditions = {
	NormalAttack1: function () {
		const isMine = this.owner === PlayerId
		const _player = isMine ? Player : EnemyPlayer
		return true
	},
	NormalDefense1: function () {
		const isMine = this.owner === PlayerId
		const _player = isMine ? Player : EnemyPlayer
		return true
	}
}
// 卡牌影响函数
const CardsEffects = {
	NormalAttack1: 'NormalAttack1',
	NormalDefense1: 'NormalDefense1',
}
// 组合类型属性
function blendCardTypeProto(mainCardType = CardTypes.COMMON, type = '', values = []) {
	const proto = {}
	for (let pKey in CardBaseProto[type]) {
		const { index, defaultValue } = CardBaseProto[type][pKey]
		proto[pKey] = values[index] || CardTypesProto[mainCardType][pKey] || defaultValue
	}
	return proto
}
// 创建卡牌对象
function createCardObject(cardKey = '', extraAttr = {}, customEffects) {
	const { types, values } = Cards[cardKey]
	let card = { types: [...types, CardTypes.COMMON] }
	const mType = card.types[0]
	for (let vType in values) {
		const valuesArr = values[vType]
		card = {
			...card,
			...blendCardTypeProto(mType, vType, valuesArr),
			conditions: CardsConditions[cardKey],
			effects: customEffects || PresetEffects[CardsEffects[cardKey]],
			...extraAttr
		}
	}
	return { id: getRandomKey(), key: cardKey, ...card }
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
