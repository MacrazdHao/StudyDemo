const BaseBuffPoto = {
	id: '',
	key: '',
	name: '',
	desc: '',
	owner: '',
	funcType: BuffFunctionTypes.NONE, // 功能类型，是否为增益/减益等
	type: BuffTypes.REPEAT, // buff复数处理类型
	enableTypes: null, // buff结算时机类型
	enableFightActions: null, // 当enableTypes包含FIGHTACTION时该属性生效，当前角色的战斗行为包含此处所设定的行为时触发当前buff，对应[战斗行为]:[战斗行为触发类型]即[FightActionType]:[FightActionWayTypes]
	immediately: false, // 是否在获得当前buff时立即触发
	round: 1, // 生效回合数
	maxOverlayRound: MAXNUM, // 可叠加生效回合数上限，用于type为REPEAT的buff
	maxRoundEffectTimes: 1, // 回合触发次数上限
	baseAttrEffects: null, // 影响的基础数值类型属性，仅作用于自己
	effectRecord: null, // 属性影响记录，仅支持数值类属性，记录的值与增益值相反(增益为正则记录为负数，否则相反)，其余的请在lose函数中处理
	losed: '', // 任何buff都会执行BaseBuffLoseEffect，而无需指定，这里所填写的影响函数，将会在原BaseBuffLoseEffect基础上额外执行
	effects: '', // 任何buff都会执行BaseBuffEffect，而无需指定，这里所填写的影响函数，将会在原BaseBuffEffect基础上额外执行
	effectTimes: 0, // effect执行次数
	maxEffectTimes: 1, // effect最大可执行次数
	buffs: null, // 增加的buff，数据结构: { [BuffKey]: EffectTargetTypes }
}

const Buffs = {
	AddAtk1: {
		key: 'AddAtk1',
		name: '攻击力提升',
		desc: '效果持续期间攻击力+1',
		funcType: BuffFunctionTypes.BUFF,
		type: BuffTypes.REPEAT,
		immediately: true,
		round: 1,
		losed: '', // 任何buff都会执行BaseBuffLoseEffect，而无需指定
		effects: '', // 任何buff都会执行BaseBuffEffect，而无需指定
		baseAttrEffects: {
			[BaseValueAttributeKeys.ATTACK]: 1
		},
		maxEffectTimes: 1,
	},
	AddAtk2: {
		key: 'AddAtk2',
		name: '哲♂学之魂',
		desc: 'buff持续期间，每主动打出一张卡牌，附加伤害+1',
		funcType: BuffFunctionTypes.BUFF,
		type: BuffTypes.OVERLAY,
		enableTypes: [BuffEnableTypes.FIGHTACTION],
		enableFightActions: { [FightActionTypes.PLAYCARD]: FightActionWayTypes.ALL },
		immediately: false,
		maxRoundEffectTimes: 3,
		round: 2,
		losed: '', // 任何buff都会执行BaseBuffLoseEffect，而无需指定
		effects: '', // 任何buff都会执行BaseBuffEffect，而无需指定
		baseAttrEffects: {
			[BaseValueAttributeKeys.ATTACK]: 1
		},
		maxEffectTimes: MAXNUM
	}
}

