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
	START: 1,
	PLAYING: 2,
	END: 3,
	STARTWAITING: 4,
	PLAYWAITING: 5,
	ENDWAITING: 6,
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