const PresetConditions = {
	None: function (context) { return true },
	BaseCondition: function (context) {
		const isMine = context.owner === PlayerId
		const _player = isMine ? Player : EnemyPlayer
		if (context[CardItems.NEEDVIT] && _player[BaseValueAttributeKeys.VITALITY] < context[CardItems.NEEDVIT]) return false
		if (context[CardItems.NEEDMP] && _player[BaseValueAttributeKeys.MP] < context[CardItems.NEEDMP]) return false
		return true
	}
}