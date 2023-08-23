// 回合角色颜色
const RoundPlayerColors = {
	[RoundPlayerTypes.NULL]: 'gray',
	[RoundPlayerTypes.ENEMY]: 'red',
	[RoundPlayerTypes.PLAYER]: 'green',
}
// 卡片消耗颜色
const CardNeedColor = {
	[BaseValueAttributeKeys.VITALITY]: 'rgba(223,182,124,1)',
	[BaseValueAttributeKeys.MP]: 'rgba(159,124,223,1)',
}
// 卡牌颜色
const CardColors = {
	[CardTypes.COMMON]: 'rgba(255,255,255,1)', // 通用(所有卡牌默认包含)
	[CardTypes.ATTACK]: 'rgba(106,41,41,1)', // 攻击
	[CardTypes.DEFENSE]: 'rgba(41,70,106,1)', // 防御
	[CardTypes.MAGIC]: 'rgba(78,41,106,1)', // 魔法
	[CardTypes.PROPS]: 'rgba(43,106,41,1)', // 道具
}
// 卡牌稀有度颜色（边框）
const CardRareColors = {
	[CardRareTypes.DEFAULT]: { 0.3: 'rgba(255,255,255,0)', 0.4: 'rgba(255,255,255,0.4)', 0.6: 'rgba(255,255,255,0)' }, // 灰，默认
	[CardRareTypes.NORMAL]: { 0.3: 'rgba(135,135,230,0)', 0.4: 'rgba(135,135,230,0.4)', 0.6: 'rgba(135,135,230,0)' }, // 蓝，普通
	[CardRareTypes.UNUSUAL]: { 0.3: 'rgba(191,146,227,0)', 0.4: 'rgba(191,146,227,0.4)', 0.6: 'rgba(191,146,227,0)' }, // 紫，罕见
	[CardRareTypes.PRECIOUS]: { 0.3: 'rgba(244,145,145,0)', 0.4: 'rgba(244,145,145,0.4)', 0.6: 'rgba(244,145,145,0)' }, // 粉，珍稀
	[CardRareTypes.LEGEND]: { 0.3: 'rgba(234,183,137,0)', 0.4: 'rgba(234,183,137,0.4)', 0.6: 'rgba(234,183,137,0)' }, // 橙，传说
	[CardRareTypes.UNIQUE]: {
		0.30: 'rgba(266,1,65,0)',
		0.40: 'rgba(266,1,65,0.3)',
		0.45: 'rgba(135,135,230,0.3)',
		0.50: 'rgba(191,146,227,0.3)',
		0.55: 'rgba(244,145,145,0.3)',
		0.60: 'rgba(234,183,137,0.3)',
		0.65: 'rgba(234,183,137,0)',
	}, // 彩，唯一
}