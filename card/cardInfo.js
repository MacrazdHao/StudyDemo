
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
		[CardItems.NEEDVIT]: { defaultValue: 1 }, // 体力消耗值
		rare: { defaultValue: CardRareTypes.DEFAULT }, // 体力消耗值
		image: { defaultValue: DefaultCardPath },
		playerInfo: { defaultValue: {} }, // 基础数值属性变更(仅作用于自己)
		conditions: { defaultValue: 'None' },
		effects: { defaultValue: 'None' },
		buffs: { defaultValue: {} }, // 增加的buff，数据结构: { [BuffKey]: EffectTargetTypes }
	},
	[CardTypes.ATTACK]: {
		[BaseValueAttributeKeys.ATTACK]: { defaultValue: 0 }, // 普通伤害
		[BaseValueAttributeKeys.PENATTACK]: { defaultValue: 0 }, // 穿透伤害
		selfAtk: { defaultValue: 0 }, // 己方伤害
		selfPenAtk: { defaultValue: 0 }, // 己方穿透伤害
	},
	[CardTypes.DEFENSE]: {
	},
	[CardTypes.MAGIC]: {
		[CardItems.NEEDMP]: { defaultValue: 0 }, // 灵力消耗值
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
	Test1: {
		types: [CardTypes.PROPS, CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '测试卡-稀有1', desc: '灵力+1', effects: '', rare: CardRareTypes.NORMAL,
				playerInfo: { [BaseValueAttributeKeys.MP]: 1 }
			},
			[CardTypes.MAGIC]: {},
			[CardTypes.PROPS]: {},
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
				name: '测试卡-稀有4', desc: '灵力+1', effects: '', rare: CardRareTypes.LEGEND,
				playerInfo: { [BaseValueAttributeKeys.MP]: 1 }
			},
			[CardTypes.MAGIC]: {}
		}
	},
	Test5: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '测试卡-稀有5', desc: '灵力+1', effects: '', rare: CardRareTypes.UNIQUE,
				playerInfo: { [BaseValueAttributeKeys.MP]: 1 }
			},
			[CardTypes.MAGIC]: {}
		}
	},
	NormalAttack1: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: { name: '小拳拳', desc: '造成1点伤害', effects: '', image: '/images/quan.jpg' },
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.ATTACK]: 1 }
		}
	},
	NormalAttack2: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: { name: '咸鱼突刺', desc: '造成1点穿透伤害', effects: '', image: '/images/xianyu.jpg' },
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.PENATTACK]: 1 }
		}
	},
	NormalAttack3: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: { name: '咸鱼雷电突刺', desc: '造成2点穿透伤害', effects: '', image: '/images/xianyu_dian.jpg' },
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.PENATTACK]: 2 }
		}
	},
	NormalDefense1: {
		types: [CardTypes.DEFENSE],
		values: {
			[CardTypes.COMMON]: {
				name: '大锅盖',
				desc: '护盾+1', effects: '', image: '/images/guo.jpg',
				playerInfo: { [BaseValueAttributeKeys.SHIELD]: 1 }
			},
			[CardTypes.DEFENSE]: {}
		}
	},
	Zhexuefuti: {
		types: [CardTypes.PROPS],
		values: {
			[CardTypes.COMMON]: {
				name: '哲♂学附体', desc: '获得[哲♂学之魂]Buff，效果：buff持续期间，每出一张卡牌，附加伤害+1，效果持续3回合',
				effects: '', image: '/images/zhexue.jpg', rare: CardRareTypes.PRECIOUS,
				playerInfo: {},
				buffs: {
					AddAtk2: EffectTargetTypes.PLAYER
				}
			},
			[CardTypes.PROPS]: {}
		}
	},
	Shandianwulianbian: {
		types: [CardTypes.ATTACK, CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '闪电五连鞭', desc: '造成2点伤害，2点穿透伤害', effects: '', image: 'bian', rare: CardRareTypes.UNUSUAL,
			},
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.ATTACK]: 2, [BaseValueAttributeKeys.PENATTACK]: 2 }
		},
		[CardTypes.MAGIC]: { [CardItems.NEEDMP]: 1 }
	},
	Haoziweizhi: {
		types: [CardTypes.PROPS],
		values: {
			[CardTypes.COMMON]: {
				name: '耗子尾汁', desc: '对自身造成2点穿透伤害，并获得3点护盾，敌方获得[耗子尾汁]Debuff，效果：buff持续期间，敌方伤害-1，效果持续3个回合',
				effects: '', image: 'haozi', rare: CardRareTypes.PRECIOUS,
				playerInfo: { [BaseValueAttributeKeys.HP]: -2, [BaseValueAttributeKeys.SHIELD]: 3 },
				buffs: {
					Haoziweizhi: EffectTargetTypes.ENEMY
				}
			},
			[CardTypes.PROPS]: {}
		}
	},
	Damahoudefennu: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: {
				name: '大马猴的愤怒', desc: '造成3点伤害', effects: '', image: 'houzi', rare: CardRareTypes.NORMAL,
				playerInfo: {},
			},
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.ATTACK]: 3 }
		}
	},
	Lvshihan: {
		types: [CardTypes.PROPS],
		values: {
			[CardTypes.COMMON]: {
				name: '律师函警告', desc: '敌方获得[律师函警告]Debuff，效果：敌方出牌阶段无法出牌，持续1个回合',
				effects: '', image: 'lvshihan', rare: CardRareTypes.UNUSUAL,
				playerInfo: {},
				buffs: {
					Lvshihan: EffectTargetTypes.ENEMY
				}
			},
			[CardTypes.PROPS]: {}
		}
	},
	Shutouyabo: {
		types: [CardTypes.MAGIC],
		values: {
			[CardTypes.COMMON]: {
				name: '鼠头鸭脖', desc: '敌方获得[中毒]Debuff，效果：每个回合受到1点穿透伤害，持续3个回合',
				effects: '', image: 'shutou', rare: CardRareTypes.NORMAL,
				playerInfo: {},
				buffs: {
					Shutouyabo: EffectTargetTypes.ENEMY
				}
			},
			[CardTypes.MAGIC]: { [CardItems.NEEDMP]: 2 }
		}
	},
	Jinitaimei: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: {
				name: '鸡你太美', desc: '造成3点伤害', effects: '', image: 'taimei', rare: CardRareTypes.NORMAL,
				playerInfo: {},
			},
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.ATTACK]: 3 }
		}
	},
	JinitaimeiKuang: {
		types: [CardTypes.ATTACK],
		values: {
			[CardTypes.COMMON]: {
				name: '狂·鸡你太美', desc: '造成3点伤害，3点穿透伤害', effects: '', image: 'taimei_kuang', rare: CardRareTypes.PRECIOUS,
				playerInfo: {},
				[CardItems.NEEDVIT]: 3,
			},
			[CardTypes.ATTACK]: { [BaseValueAttributeKeys.ATTACK]: 3, [BaseValueAttributeKeys.PENATTACK]: 3 }
		}
	},
}