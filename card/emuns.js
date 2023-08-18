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
// 卡牌操作事件类型
const CardEventStatusTypes = {
	DROP: 0,
	PLAY: 1
}
// 初始卡组
const InitCards = {
	NormalAttack1: 3,
	NormalDefense1: 3,
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
	ADDHP: 15, // 获得生命
	ADDSHD: 16, // 获得护盾
	ADDMP: 17, // 获得灵力
	ADDVIT: 18, // 获得体力
	ADDATK: 19, // 获得额外攻击
	ADDPENATK: 20, // 获得额外穿透攻击
	GETBUFF: 21, // 获得Buff
	REBORN: 22, // 重生
}
// 战斗行为触发类型
const FightActionWayTypes = {
	NULL: -1, // 无
	WAITING: 0, // 等待战斗行为
	INITIACTIVE: 1, // 主动和被动
	INITIACTIVE: 2, // 主动触发
	FORCE: 3, // 被动触发
}