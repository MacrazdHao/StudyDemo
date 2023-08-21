const PresetEffects = {
	None: function () { },
	BaseAttrEffect: function (attributes = null, reverse = false) {
		// 用于数值类型基础属性值的加减，可自定义属性，或反转作用目标
		const isMine = this.owner === PlayerId
		const _player = !reverse && isMine ? Player : EnemyPlayer
		const _attr = attributes || this
		for (let aKey in _attr) {
			switch (aKey) {
				case BaseValueAttributeKeys.MAXHP:
				case BaseValueAttributeKeys.MAXSHIELD:
				case BaseValueAttributeKeys.MAXMP:
				case BaseValueAttributeKeys.MAXVITALITY:
				case BaseValueAttributeKeys.MAXHANDCARDSNUM:
				case BaseValueAttributeKeys.ROUNDGETCARDNUM:
				case BaseValueAttributeKeys.INITIALVITALITY: _player[aKey] += this[aKey]; break;
				case BaseValueAttributeKeys.HP: changeHP(this[aKey], isMine); break;
				case BaseValueAttributeKeys.SHIELD: changeSHD(this[aKey], isMine); break;
				case BaseValueAttributeKeys.MP: changeMP(this[aKey], isMine); break;
				case BaseValueAttributeKeys.VITALITY: changeVIT(this[aKey], isMine); break;
				case BaseValueAttributeKeys.ATTACK: changeATK(this[aKey], isMine); break;
				case BaseValueAttributeKeys.PENATTACK: changePENATK(this[aKey], isMine); break;
			}
		}
	},
	BaseReverseAttrEffect: function (attributes = null) {
		// 反转作用目标
		PresetEffects.BaseAttrEffect(attributes || this, true)
	},
	BaseBuffEffect: function (context, otherEffect = null) {
		PresetEffects.BaseAttrEffect(context.baseAttrEffects)
		pushBuffRecord(context)
		otherEffect(context)
	},
	BaseBuffLoseEffect: function (context, otherLoseEffect = null) {
		// 注意这里不能使用this，而是context
		const isMine = context.owner === PlayerId
		const _player = isMine ? Player : EnemyPlayer
		// effectRecord存储的值为baseAttrEffects的取反值(增益为正则记录为负数，否则相反)，因此可直接用BaseAttrEffect
		PresetEffects.BaseAttrEffect(context.effectRecord)
		if (otherLoseEffect) otherLoseEffect(context)
	},
	BaseAttackEffect: function () {
		attackPlayer(this)
	}
}