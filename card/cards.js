// 卡牌颜色
const CardColors = {
	[CardTypes.COMMON]: '#fff', // 通用(所有卡牌默认包含)
	[CardTypes.ATTACK]: 'red', // 攻击
	[CardTypes.DEFENSE]: 'blue', // 防御
	[CardTypes.MAGIC]: 'pupple', // 魔法
	[CardTypes.PROPS]: 'green', // 道具
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
		conditions: {
			// 卡牌使用条件
			index: 7,
			defaultValue: function () { return true }
		},
		effects: {
			// 卡牌特殊效果
			index: 8,
			defaultValue: function () { }
		},
	},
	[CardTypes.ATTACK]: {
		atk: { index: 0, defaultValue: 0 },
		penAtk: { index: 1, defaultValue: 0 },
		selfAtk: { index: 2, defaultValue: 0 },
		selfPenAtk: { index: 3, defaultValue: 0 },
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
 * 	}
 * }
 */
const Cards = {
	NormalAttack1: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: ['普通攻击', '造成1点伤害', CardColors[CardTypes.ATTACK], null, null],
			[CardTypes.ATTACK]: [1]
		}
	},
	NormalDefense1: {
		types: [CardTypes.DEFENSE],
		values: {
			[CardTypes.COMMON]: ['普通盾牌', '护盾+2', CardColors[CardTypes.DEFENSE], null, null],
			[CardTypes.DEFENSE]: [2]
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
	NormalAttack1: function () {
		attackPlayer(this)
	},
	NormalDefense1: function () {
		addShield(this)
	}
}
// 组合类型属性
function blendCardTypeProto(type = '', values = []) {
	const proto = {}
	for (let pKey in CardBaseProto[type]) {
		const { index, defaultValue } = CardBaseProto[type][pKey]
		proto[pKey] = values[index] || defaultValue
	}
	return proto
}
// 创建卡牌对象
function createCardObject(cardKey = '', extraAttr = {}) {
	const { types, values } = Cards[cardKey]
	let card = { types }
	for (let vType in values) {
		const valuesArr = values[vType]
		card = {
			...card,
			...blendCardTypeProto(vType, valuesArr),
			conditions: CardsConditions[cardKey],
			effects: CardsEffects[cardKey],
			...extraAttr
		}
	}
	return { id: getRandomKey(), key: cardKey, ...card }
}
// 生成卡组
function generateCardsGroup(id, cardsMap = {}) {
	const cards = {}
	for (let cKey in cardsMap) {
		const num = cardsMap[cKey]
		for (let i = 0; i < num; i++) {
			const card = createCardObject(cKey)
			cards[card.id] = { ...card, owner: id }
		}
	}
	return cards
}
