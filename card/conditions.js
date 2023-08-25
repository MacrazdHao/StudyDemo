const PresetConditions = {
	None: function (context) { return true },
	BaseCondition: function (context) {
		const { needVit, needMp, owner } = context
		const isMine = owner === PlayerId
		const _player = isMine ? Player : EnemyPlayer
		if (needVit && _player[BaseValueAttributeKeys.VITALITY] < needVit) return false
		if (needMp && _player[BaseValueAttributeKeys.MP] < needMp) return false
		return true
	}
}