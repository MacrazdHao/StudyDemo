// 游戏状态文案
const GameStatusTexts = {
	[GameStatusTypes.NULL]: '无',
	[GameStatusTypes.WAITING]: '等待开始',
	[GameStatusTypes.START]: '已开始',
	[GameStatusTypes.OVER]: '结束',
}
// 战斗状态文案
const FightStatusTexts = {
	[FightStatusTypes.NULL]: '无',
	[FightStatusTypes.WAITING]: '等待开始',
	[FightStatusTypes.START]: '战斗开始',
	[FightStatusTypes.FIGHTING]: '战斗中',
	[FightStatusTypes.END]: '战斗结束',
}
// 回合状态文案
const RoundStatusTexts = {
	[RoundStatusTypes.NULL]: '无',
	[RoundStatusTypes.WAITING]: '等待开始',
	[RoundStatusTypes.STARTWAITING]: '开始前置',
	[RoundStatusTypes.START]: '回合开始',
	[RoundStatusTypes.PLAYWAITING]: '回合前置',
	[RoundStatusTypes.PLAYING]: '回合中',
	[RoundStatusTypes.ENDWAITING]: '结束前置(弃牌)',
	[RoundStatusTypes.END]: '结束',
}
// 回合角色文案
const RoundPlayerTexts = {
	[RoundPlayerTypes.NULL]: '无',
	[RoundPlayerTypes.ENEMY]: '敌方回合',
	[RoundPlayerTypes.PLAYER]: '己方回合',
}
// 战斗结果文案
const FightResultTexts = {
	[FightResultTypes.NULL]: '战斗未开始',
	[FightResultTypes.WAITING]: '等待结束',
	[FightResultTypes.WIN]: '胜利',
	[FightResultTypes.FAIL]: '败北',
	[FightResultTypes.DRAW]: '平手',
}
