const BaseBuffPoto = {
	id: '',
	key: '',
	name: '',
	desc: '',
	owner: '',
	type: BuffTypes.REPEAT,
	enableTypes: [BuffEnableTypes.BEFOREROUND], // buff触发时机类型
	enableFightActions: {}, // 当enableTypes包含FIGHTACTION时该属性生效，当前角色的战斗行为包含此处所设定的行为时触发当前buff，对应[战斗行为]:[战斗行为触发类型]即[FightActionType]:[FightActionWayTypes]
	immediately: false, // 是否在获得当前buff时立即触发
	round: 1, // 生效回合数
	maxOverlayRound: MAXNUM, // 可叠加生效回合数上限，用于type为REPEAT的buff
	maxRoundEffectTimes: 1, // 回合触发次数上限
	baseAttrEffects: {}, // 影响的基础数值类型属性，仅作用于自己
	effectRecord: {}, // 属性影响记录，仅支持数值类属性，记录的值与增益值相反(增益为正则记录为负数，否则相反)，其余的请在lose函数中处理
	losed: '', // 任何buff都会执行BaseBuffLoseEffect，而无需指定，这里所填写的影响函数，将会在原BaseBuffLoseEffect基础上额外执行
	effects: '', // 任何buff都会执行BaseBuffEffect，而无需指定，这里所填写的影响函数，将会在原BaseBuffEffect基础上额外执行
	effectTimes: 0, // effect执行次数
	maxEffectTimes: 1, // effect最大可执行次数
}

const Buffs = {
	AddAtk1: {
		key: 'AddAtk1',
		name: '攻击力提升',
		desc: '效果持续期间攻击力+1',
		type: BuffTypes.REPEAT,
		immediately: true,
		round: 2,
		losed: '', // 任何buff都会执行BaseBuffLoseEffect，而无需指定
		effects: '', // 任何buff都会执行BaseBuffEffect，而无需指定
		baseAttrEffects: {
			[BaseValueAttributeKeys.ATTACK]: 1
		},
		maxEffectTimes: 1,
	},
	AddAtk2: {
		key: 'AddAtk2',
		name: '攻击力提升',
		desc: '效果持续期间，每回合攻击力+1',
		type: BuffTypes.REPEAT,
		immediately: true,
		round: 2,
		losed: '', // 任何buff都会执行BaseBuffLoseEffect，而无需指定
		effects: '', // 任何buff都会执行BaseBuffEffect，而无需指定
		baseAttrEffects: {
			[BaseValueAttributeKeys.ATTACK]: 1
		},
		maxEffectTimes: MAXNUM
	}
}

function pushBuffRecord(context) {
	for (let aKey in context.baseAttrEffects) {
		switch (aKey) {
			case BaseValueAttributeKeys.MAXHP:
			case BaseValueAttributeKeys.MAXSHIELD:
			case BaseValueAttributeKeys.MAXMP:
			case BaseValueAttributeKeys.MAXVITALITY:
			case BaseValueAttributeKeys.MAXHANDCARDSNUM:
			case BaseValueAttributeKeys.ROUNDGETCARDNUM:
			case BaseValueAttributeKeys.INITIALVITALITY:
			case BaseValueAttributeKeys.HP:
			case BaseValueAttributeKeys.SHIELD:
			case BaseValueAttributeKeys.MP:
			case BaseValueAttributeKeys.VITALITY:
			case BaseValueAttributeKeys.ATTACK:
			case BaseValueAttributeKeys.PENATTACK:
				context.effectRecord[aKey] = (context.effectRecord[aKey] || 0) - context.baseAttrEffects[aKey]
				break
		}
	}
}

function createBuffObject(playerId, buffKey, extraAttr = {}) {
	const { effects, losed } = Buffs[buffKey]
	return {
		...Buffs[buffKey],
		id: getRandomKey(),
		owner: playerId,
		effects: function () {
			if (this.effectTimes < this.maxEffectTimes) {
				PresetEffects.BaseBuffEffect(this, PresetEffects[effects])
				this.effectTimes++
			}
		},
		losed: function () {
			PresetEffects.BaseBuffLoseEffect(this, PresetEffects[losed])
		},
		...extraAttr,
		roundEffectTimes: 0, // 回合触发次数
	}
}