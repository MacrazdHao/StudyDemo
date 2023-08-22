
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
			[CardTypes.COMMON]: { name: '大锅盖', desc: '护盾+1', effects: 'BaseAttrEffect', image: '/images/guo.jpg' },
			[CardTypes.DEFENSE]: { [BaseValueAttributeKeys.SHIELD]: 1 }
		}
	},
	Test1: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: { name: '测试卡-稀有1', desc: '灵力+1', rare: CardRareTypes.NORMAL },
			[CardTypes.MAGIC]: { [BaseValueAttributeKeys.MP]: 1 }
		}
	},
	Test2: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: { name: '测试卡-稀有2', desc: '灵力+1', rare: CardRareTypes.UNUSUAL },
			[CardTypes.MAGIC]: { [BaseValueAttributeKeys.MP]: 1 }
		}
	},
	Test3: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: { name: '测试卡-稀有3', desc: '灵力+1', rare: CardRareTypes.PRECIOUS },
			[CardTypes.MAGIC]: { [BaseValueAttributeKeys.MP]: 1 }
		}
	},
	Test4: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: { name: '测试卡-稀有4', desc: '灵力+1', rare: CardRareTypes.LEGEND },
			[CardTypes.MAGIC]: { [BaseValueAttributeKeys.MP]: 1 }
		}
	},
	Test5: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: { name: '测试卡-稀有5', desc: '灵力+1', rare: CardRareTypes.UNIQUE },
			[CardTypes.MAGIC]: { [BaseValueAttributeKeys.MP]: 1 }
		}
	},
}