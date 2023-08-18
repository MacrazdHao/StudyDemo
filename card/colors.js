// 回合角色颜色
const RoundPlayerColors = {
	[RoundPlayerTypes.NULL]: 'gray',
	[RoundPlayerTypes.ENEMY]: 'red',
	[RoundPlayerTypes.PLAYER]: 'green',
}
// 卡牌颜色
const CardColors = {
	[CardTypes.COMMON]: '#fff', // 通用(所有卡牌默认包含)
	[CardTypes.ATTACK]: 'red', // 攻击
	[CardTypes.DEFENSE]: 'blue', // 防御
	[CardTypes.MAGIC]: 'pupple', // 魔法
	[CardTypes.PROPS]: 'green', // 道具
}