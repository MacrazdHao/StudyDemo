function pushBuffRecord(context) {
	const isMine = context.owner === PlayerId
	const _player = isMine ? Player : EnemyPlayer
	const { id, baseAttrEffects } = context
	for (let aKey in baseAttrEffects) {
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
				_player.usedBuffs[id].effectRecord[aKey] = (_player.usedBuffs[id].effectRecord[aKey] || 0) - baseAttrEffects[aKey]
				break
		}
	}
}

function createBuffObject(playerId, buffKey, extraAttr = {}) {
	const { effects, losed } = Buffs[buffKey]
	return {
		...BaseBuffPoto,
		// 以下数组、对象不能直接使用默认值，而需要直接重置，因为会存在内存空间冲突问题，所以需要重新分配
		enableFightActions: {},
		baseAttrEffects: {},
		effectRecord: {},
		buffs: {},
		enableTypes: [BuffEnableTypes.BEFOREROUND],
		...Buffs[buffKey],
		id: getRandomKey(),
		key: buffKey,
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