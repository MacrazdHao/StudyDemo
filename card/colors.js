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
// 卡牌稀有度颜色（标题、边框）
const CardRareColors = {
	[CardRareTypes.DEFAULT]: 'gray', // 灰，默认
	[CardRareTypes.NORMAL]: 'blue', // 蓝，普通
	[CardRareTypes.UNUSUAL]: 'purple', // 紫，罕见
	[CardRareTypes.PRECIOUS]: 'pink', // 粉，珍稀
	[CardRareTypes.LEGEND]: 'orange', // 橙，传说
	[CardRareTypes.UNIQUE]: 'colorful', // 彩，唯一
}