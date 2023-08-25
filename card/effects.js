const PresetEffects = {
	None: function () { },
	BaseAttrEffect: function (context, attributes = null, reverse = false) {
		// 用于数值类型基础属性值的加减，可自定义属性，或反转作用目标
		const isMine = context.owner === PlayerId
		const _player = !reverse && isMine ? Player : EnemyPlayer
		const _attr = attributes || context
		if (_attr[BaseValueAttributeKeys.MAXHP]) _player[BaseValueAttributeKeys.MAXHP] += _attr[BaseValueAttributeKeys.MAXHP]
		if (_attr[BaseValueAttributeKeys.MAXSHIELD]) _player[BaseValueAttributeKeys.MAXSHIELD] += _attr[BaseValueAttributeKeys.MAXSHIELD]
		if (_attr[BaseValueAttributeKeys.MAXMP]) _player[BaseValueAttributeKeys.MAXMP] += _attr[BaseValueAttributeKeys.MAXMP]
		if (_attr[BaseValueAttributeKeys.MAXVITALITY]) _player[BaseValueAttributeKeys.MAXVITALITY] += _attr[BaseValueAttributeKeys.MAXVITALITY]
		if (_attr[BaseValueAttributeKeys.MAXHANDCARDSNUM]) _player[BaseValueAttributeKeys.MAXHANDCARDSNUM] += _attr[BaseValueAttributeKeys.MAXHANDCARDSNUM]
		if (_attr[BaseValueAttributeKeys.ROUNDGETCARDNUM]) _player[BaseValueAttributeKeys.ROUNDGETCARDNUM] += _attr[BaseValueAttributeKeys.ROUNDGETCARDNUM]
		if (_attr[BaseValueAttributeKeys.INITIALVITALITY]) _player[BaseValueAttributeKeys.INITIALVITALITY] += _attr[BaseValueAttributeKeys.INITIALVITALITY]
		if (_attr[BaseValueAttributeKeys.SHIELD]) changeSHD(_attr[BaseValueAttributeKeys.SHIELD], isMine)
		if (_attr[BaseValueAttributeKeys.HP]) changeHP(_attr[BaseValueAttributeKeys.HP], isMine)
		if (_attr[BaseValueAttributeKeys.MP]) changeMP(_attr[BaseValueAttributeKeys.MP], isMine)
		if (_attr[BaseValueAttributeKeys.VITALITY]) changeVIT(_attr[BaseValueAttributeKeys.VITALITY], isMine)
		if (_attr[BaseValueAttributeKeys.ATTACK]) changeATK(_attr[BaseValueAttributeKeys.ATTACK], isMine)
		if (_attr[BaseValueAttributeKeys.PENATTACK]) changePENATK(_attr[BaseValueAttributeKeys.PENATTACK], isMine)
		if (!reverse) {
			PresetEffects.BaseAddBuffEffect(context)
		}
	},
	BaseReverseAttrEffect: function (context, attributes = null) {
		// 反转作用目标
		PresetEffects.BaseAttrEffect(context, attributes || context, true)
	},
	BaseAddBuffEffect: function (context) {
		const isMine = context.owner === PlayerId
		for (let bKey in context.buffs) {
			switch (context.buffs[bKey]) {
				case EffectTargetTypes.PLAYER: addBuff(isMine, bKey, bKey, false); break;
				case EffectTargetTypes.ENEMY: addBuff(!isMine, bKey, bKey, true); break;
				case EffectTargetTypes.ALL:
					addBuff(isMine, bKey, bKey, false)
					addBuff(!isMine, bKey, bKey, true)
					break;
			}
		}
	},
	BaseBuffEffect: function (context, otherEffect = null) {
		PresetEffects.BaseAttrEffect(context, context.baseAttrEffects)
		pushBuffRecord(context)
		if (otherEffect) otherEffect(context)
	},
	BaseBuffLoseEffect: function (context, otherLoseEffect = null) {
		// 注意这里不能使用this，而是context
		// effectRecord存储的值为baseAttrEffects的取反值(增益为正则记录为负数，否则相反)，因此可直接用BaseAttrEffect
		// PresetEffects.BaseAttrEffect(context, context.effectRecord)
		const isMine = context.owner === PlayerId
		const _player = isMine ? Player : EnemyPlayer
		const _attr = context.effectRecord
		for (let aKey in _attr) {
			switch (aKey) {
				case BaseValueAttributeKeys.MAXHP:
				case BaseValueAttributeKeys.MAXSHIELD:
				case BaseValueAttributeKeys.MAXMP:
				case BaseValueAttributeKeys.MAXVITALITY:
				case BaseValueAttributeKeys.MAXHANDCARDSNUM:
				case BaseValueAttributeKeys.ROUNDGETCARDNUM:
				case BaseValueAttributeKeys.INITIALVITALITY: _player[aKey] += _attr[aKey]; break;
				case BaseValueAttributeKeys.ATTACK: changeATK(_attr[aKey], isMine); break;
				case BaseValueAttributeKeys.PENATTACK: changePENATK(_attr[aKey], isMine); break;
			}
		}
		if (otherLoseEffect) otherLoseEffect(context)
	},
	BaseAttackEffect: function (context) {
		attackPlayer(context)
	},
	Zhexuefuti: function () {

	}
}