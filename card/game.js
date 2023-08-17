let GameStatus = GameStatusTypes.WAITING
let FightStatus = GameStatusTypes.NULL
let RoundStatus = RoundStatusTypes.NULL

let Round = 0

// 游戏状态
const GameStatusTexts = {
	[GameStatusTypes.NULL]: '无',
	[GameStatusTypes.WAITING]: '等待开始',
	[GameStatusTypes.START]: '已开始',
	[GameStatusTypes.OVER]: '结束',
}
// 战斗状态
const FightStatusTexts = {
	[FightStatusTypes.NULL]: '无',
	[FightStatusTypes.WAITING]: '等待开始',
	[FightStatusTypes.START]: '战斗开始',
	[FightStatusTypes.FIGHTING]: '战斗中',
	[FightStatusTypes.END]: '战斗结束',
}
// 回合状态
const RoundStatusTexts = {
	[RoundStatusTypes.NULL]: '无',
	[RoundStatusTypes.WAITING]: '等待开始',
	[RoundStatusTypes.STARTWAITING]: '开始前置',
	[RoundStatusTypes.START]: '回合开始',
	[RoundStatusTypes.PLAYWAITING]: '回合前置',
	[RoundStatusTypes.PLAYING]: '回合中',
	[RoundStatusTypes.ENDWAITING]: '结束前置',
	[RoundStatusTypes.END]: '结束',
}

function setGameStatus(status) {
	GameStatus = status
}
function setFightStatus(status) {
	FightStatus = status
}
function setRoundStatus(status) {
	RoundStatus = status
}

function gameStatusListener() {
	switch (GameStatus) {
		case GameStatusTypes.NULL: break;
		case GameStatusTypes.WAITING: break;
		case GameStatusTypes.START: break;
		case GameStatusTypes.OVER: break;
	}
	GameStatusDom.innerHTML = GameStatusTexts[GameStatus]
}

function fightStatusListener() {
	switch (FightStatus) {
		case FightStatusTypes.NULL: break;
		case FightStatusTypes.WAITING: break;
		case FightStatusTypes.START:
			// 战斗开始前置阶段，回合状态为准备开始状态
			setRoundStatus(RoundStatusTypes.STARTWAITING)
			// 战斗开始状态结算，完成后变为PLAYING状态
			setFightStatus(fightStartSettle())
			break;
		case FightStatusTypes.FIGHTING: break;
		case FightStatusTypes.END: break;
	}
	FightStatusDom.innerHTML = FightStatusTexts[FightStatus]
}

function roundStatusListener() {
	switch (RoundStatus) {
		case RoundStatusTypes.NULL: break;
		case RoundStatusTypes.STARTWAITING:
			setRoundStatus(roundStartWaitingSettle())
			break
		case RoundStatusTypes.START:
			setRoundStatus(roundStartSettle());
			break
		case RoundStatusTypes.PLAYWAITING:
			setRoundStatus(roundPlayWaitingSettle())
			break
		case RoundStatusTypes.PLAYING: break;
		case RoundStatusTypes.ENDWAITING:
			setRoundStatus(roundEndWaitingSettle())
			break
		case RoundStatusTypes.END:
			setRoundStatus(roundEndSettle())
			break
	}
	RoundStatusDom.innerHTML = RoundStatusTexts[RoundStatus]
}

function startGame() {
	setGameStatus(GameStatusTypes.START)
	setFightStatus(FightStatusTypes.WAITING)
}
function startFight() {
	setFightStatus(FightStatusTypes.START)
}
function endRound() {
	setRoundStatus(RoundStatusTypes.ENDWAITING)
}