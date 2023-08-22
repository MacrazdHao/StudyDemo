const MAXNUM = 9999999 // 最大值
const MINNUM = -9999999 // 最小值
// 游戏状态
const GameStatusTypes = {
	NULL: -1,
	WAITING: 0,
	START: 1,
	OVER: 2,
}
// 战斗状态
const FightStatusTypes = {
	NULL: -1,
	WAITING: 0,
	START: 1,
	FIGHTING: 2,
	END: 3,
}
// 回合状态
const RoundStatusTypes = {
	NULL: -1,
	WAITING: 0,
	STARTWAITING: 1,
	START: 2,
	PLAYWAITING: 3,
	PLAYING: 4,
	ENDWAITING: 5,
	END: 6,
}
// 回合角色状态
const RoundPlayerTypes = {
	NULL: -1,
	ENEMY: 0,
	PLAYER: 1,
}
// 战斗结果类型
const FightResultTypes = {
	NULL: -1,
	WAITING: 0,
	WIN: 1,
	FAIL: 2,
	DRAW: 3
}
// 职业类型
const CareerTypes = {
	HUMAN: 0
}
// 卡牌类型
const CardTypes = {
	COMMON: 0, // 通用(所有卡牌默认包含)
	ATTACK: 1, // 攻击
	DEFENSE: 2, // 防御
	MAGIC: 3, // 魔法
	PROPS: 4, // 道具
}
// 卡牌类型
const CardRareTypes = {
	DEFAULT: 0, // 灰，默认
	NORMAL: 1, // 蓝，普通
	UNUSUAL: 2, // 紫，罕见
	PRECIOUS: 3, // 粉，珍稀
	LEGEND: 4, // 橙，传说
	UNIQUE: 5, // 彩，唯一
}
// 卡牌操作事件类型
const CardEventStatusTypes = {
	DROP: 0,
	PLAY: 1
}
// 卡牌位置类型
const CardLocTypes = {
	DOWN: -1,
	MIDDLE: 0,
	UP: 1,
	MIDDLERANDOM: 2,
	RANDOM: 3,
}
// buff类型
const BuffTypes = {
	REPEAT: 0,
	UNIQUE: 1,
	OVERLAY: 2,
}
// buff触发时机类型
const BuffEnableTypes = {
	BEFOREROUND: 0,
	AFTERROUND: 1,
	FIGHTACTION: 2,
}
// buff功能类型
const BuffFunctionTypes = {
	NONE: 0, // 无类型
	BUFF: 1, // 增益buff
	DEBUFF: 2, // 减益buff
	ALL: 3, // 同时是增益和减益buff
	STATIC: 4, // 不可清除buff
}
// 战斗行为类型（一般用于Buff，行为细节用effect做限制即可）
const FightActionTypes = {
	PLAYCARD: 1, // 出牌
	EXTRACTHANDCARD: 2, // 抽取手牌
	GETHANDCARD: 3, // 获得手牌(不包含抽取卡牌)
	LOSEHANDCARD: 4, // 失去手牌(不包含弃牌)
	ABANDONCARD: 5, // 弃牌
	ATTACK: 6, // 攻击
	BEATTACKED: 7, // 被攻击
	LOSEHP: 8, // 失去生命
	LOSESHD: 9, // 失去护盾
	LOSEMP: 10, // 失去灵力
	LOSEVIT: 11, // 失去体力
	LOSEATK: 12, // 失去额外攻击
	LOSEPENATK: 13, // 失去额外穿透攻击
	LOSEBUFF: 14, // 失去Buff
	LOSEREBORN: 15, // 失去重生
	ADDHP: 16, // 获得生命
	ADDSHD: 17, // 获得护盾
	ADDMP: 18, // 获得灵力
	ADDVIT: 19, // 获得体力
	ADDATK: 20, // 获得额外攻击
	ADDPENATK: 21, // 获得额外穿透攻击
	ADDBUFF: 22, // 获得Buff
	ADDREBORN: 23, // 获得重生
	REBORN: 24, // 重生
	DEAD: 25, // 阵亡(无被动主动之分，默认为ALL)
}
// 战斗行为触发类型
const FightActionWayTypes = {
	NULL: -1, // 无
	WAITING: 0, // 等待战斗行为
	ALL: 1, // 主动和被动
	INITIACTIVE: 2, // 主动触发
	FORCE: 3, // 被动触发
}
// 基础数值属性Key值
const BaseValueAttributeKeys = {
	MAXHP: 'maxHp', // 最大血量
	MAXSHIELD: 'maxShd', // 最大护盾
	MAXMP: 'maxMp', // 最大灵力
	MAXVITALITY: 'maxVit', // 最大体力
	HP: 'hp', // 血量
	SHIELD: 'shd', // 护盾
	MP: 'mp', // 灵力
	VITALITY: 'vit', // 体力
	ATTACK: 'atk', // 额外伤害
	PENATTACK: 'penAtk', // 额外穿透伤害
	MAXHANDCARDSNUM: 'maxHandCardsNum', // 最大手牌数
	ROUNDGETCARDNUM: 'roundGetCardNum', // 回合卡牌抽取数
	INITIALVITALITY: 'initVit', // 初始体力
}
// 生效对象类型
const EffectTargetTypes = {
	ENEMY: 0, // 敌人
	PLAYER: 1, // 自己
	ALL: 2, // 所有人
}