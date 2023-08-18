const PresetEffects = {
	None: function () { },
	NormalAttack1: function () {
		attackPlayer(this)
	},
	NormalDefense1: function () {
		const isMine = this.owner === PlayerId
		addSHD(this.shd, isMine)
	},
	AddAtk1: function () {
		const isMine = this.owner === PlayerId
		addATK(1, isMine)
	}
}