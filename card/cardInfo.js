
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
			[CardTypes.COMMON]: { name: '小拳拳', desc: '造成1点伤害', effects: 'BaseAttackEffect', image: '/images/quan.jpg' },
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.ATTACK]: 1 }
		}
	},
	NormalAttack2: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: { name: '咸鱼突刺', desc: '造成1点穿透伤害', effects: 'BaseAttackEffect', image: '/images/xianyu.jpg' },
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.PENATTACK]: 1 }
		}
	},
	NormalDefense1: {
		types: [CardTypes.DEFENSE],
		values: {
			[CardTypes.COMMON]: { name: '大锅盖', desc: '护盾+1', effects: '', image: '/images/guo.jpg' },
			[CardTypes.DEFENSE]: { playerInfo: { [BaseValueAttributeKeys.SHIELD]: 1 } }
		}
	},
	Test1: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '测试卡-稀有1', desc: '灵力+1', effects: '', rare: CardRareTypes.NORMAL,
				playerInfo: { [BaseValueAttributeKeys.MP]: 1 }
			},
			[CardTypes.MAGIC]: {}
		}
	},
	Test2: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '测试卡-稀有2', desc: '灵力+1', effects: '', rare: CardRareTypes.UNUSUAL,
				playerInfo: { [BaseValueAttributeKeys.MP]: 1 }
			},
			[CardTypes.MAGIC]: {}
		}
	},
	Test3: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '测试卡-稀有3', desc: '灵力+1', effects: '', rare: CardRareTypes.PRECIOUS,
				playerInfo: { [BaseValueAttributeKeys.MP]: 1 }
			},
			[CardTypes.MAGIC]: {}
		}
	},
	Test4: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '测试卡-稀有4', desc: '灵力+1', effects: 'BaseAttrEffect', rare: CardRareTypes.LEGEND,
				playerInfo: { [BaseValueAttributeKeys.MP]: 1 }
			},
			[CardTypes.MAGIC]: {}
		}
	},
	Test5: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '测试卡-稀有5', desc: '灵力+1', effects: 'BaseAttrEffect', rare: CardRareTypes.UNIQUE,
				playerInfo: { [BaseValueAttributeKeys.MP]: 1 }
			},
			[CardTypes.MAGIC]: {}
		}
	},
}