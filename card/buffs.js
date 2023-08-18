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
	effectRecord: {}, // 属性影响记录，仅支持数值类属性，其余的请在lose函数中处理
	effects: 'None'
}

const Buffs = {
	AddAtk1: {
		key: 'AddAtk1',
		name: '攻击力提升',
		desc: '攻击力+1',
		type: BuffTypes.REPEAT,
		immediately: true,
		round: 2,
		losed: 'AddAtk1',
		effects: 'AddAtk1',
	}
}

const BuffLoseFunctions = {
	AddAtk1(context) {
		// 注意这里不能使用this，而是context
	}
}

function commonLoseFunction(context) {
	// 注意这里不能使用this，而是context
	const isMine = context.owner === PlayerId
	const _player = isMine ? Player : EnemyPlayer
	for (let attr in context.effectRecord) {
		_player[attr] -= context.effectRecord[attr]
	}
}

function createBuffObject(playerId, buffKey, extraAttr = {}, customEffects) {
	const { effects, losed } = Buffs[buffKey]
	return {
		...Buffs[buffKey],
		id: getRandomKey(),
		owner: playerId,
		effects: customEffects || PresetEffects[effects],
		losed() {
			commonLoseFunction(this)
			BuffLoseFunctions[losed](this)
		},
		...extraAttr,
		roundEffectTimes: 0, // 回合触发次数
	}
}