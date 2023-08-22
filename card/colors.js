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
	[CardTypes.MAGIC]: 'purple', // 魔法
	[CardTypes.PROPS]: 'green', // 道具
}
// 卡牌稀有度颜色（标题、边框）
const CardRareColors = {
	[CardRareTypes.DEFAULT]: '#6b6b6b', // 灰，默认
	[CardRareTypes.NORMAL]: '#8787e6', // 蓝，普通
	[CardRareTypes.UNUSUAL]: '#bf92e3', // 紫，罕见
	[CardRareTypes.PRECIOUS]: '#f49191', // 粉，珍稀
	[CardRareTypes.LEGEND]: '#eab789', // 橙，传说
	[CardRareTypes.UNIQUE]: ['rgba(266,1,65,1)',
		'rgba(135,135,230,1)',
		'rgba(191,146,227,1)',
		'rgba(244,145,145,1)',
		'rgba(234,183,137,1)',
	], // 彩，唯一
}