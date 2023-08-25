const PresetEffects = {
	None: function () { },
	BaseAttrEffect: function (context, attributes = null, reverse = false) {
		// 用于数值类型基础属性值的加减，可自定义属性，或反转作用目标
		const isMine = context.owner === PlayerId
		const _player = !reverse && isMine ? Player : EnemyPlayer
		const _attr = attributes || context
		for (let aKey in _attr) {
			switch (aKey) {
				case BaseValueAttributeKeys.MAXHP:
				case BaseValueAttributeKeys.MAXSHIELD:
				case BaseValueAttributeKeys.MAXMP:
				case BaseValueAttributeKeys.MAXVITALITY:
				case BaseValueAttributeKeys.MAXHANDCARDSNUM:
				case BaseValueAttributeKeys.ROUNDGETCARDNUM:
				case BaseValueAttributeKeys.INITIALVITALITY: _player[aKey] += _attr[aKey]; break;
				case BaseValueAttributeKeys.HP: changeHP(_attr[aKey], isMine); break;
				case BaseValueAttributeKeys.SHIELD: changeSHD(_attr[aKey], isMine); break;
				case BaseValueAttributeKeys.MP: changeMP(_attr[aKey], isMine); break;
				case BaseValueAttributeKeys.VITALITY: changeVIT(_attr[aKey], isMine); break;
				case BaseValueAttributeKeys.ATTACK: changeATK(_attr[aKey], isMine); break;
				case BaseValueAttributeKeys.PENATTACK: changePENATK(_attr[aKey], isMine); break;
			}
		}
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