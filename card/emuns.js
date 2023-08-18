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
const CareerType = {
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
const CardLocType = {
	DOWN: -1,
	MIDDLE: 0,
	UP: 1,
	MIDDLERANDOM: 2,
	RANDOM: 3,
}