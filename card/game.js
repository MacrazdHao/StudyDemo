let GameStatus = GameStatusTypes.WAITING
let FightStatus = GameStatusTypes.NULL
let RoundStatus = RoundStatusTypes.NULL
let FightResult = FightResultTypes.NULL
let RoundPlayer = RoundPlayerTypes.NULL

let Round = 0

function setGameStatus(status) {
	GameStatus = status
}
function setFightStatus(status) {
	FightStatus = status
}
function setRoundStatus(status) {
	RoundStatus = status
}
function setFightResult(status) {
	FightResult = status
}
function setRoundPlayer(status) {
	RoundPlayer = status
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

// 战斗结束判断
function isFightEnd() {
  switch (FightResult) {
    case FightResultTypes.NULL:
    case FightResultTypes.WAITING: return false
    case FightResultTypes.WIN:
    case FightResultTypes.FAIL:
    case FightResultTypes.DRAW: return true
    default: return false
  }
}

function fightStatusListener() {
	switch (FightStatus) {
		case FightStatusTypes.NULL: break;
		case FightStatusTypes.WAITING: break;
		case FightStatusTypes.START:
			// 战斗结果转为等待状态
			setFightResult(FightResultTypes.WAITING)
			// 战斗开始前置阶段，回合状态为准备开始状态
			setRoundStatus(RoundStatusTypes.STARTWAITING)
			// 战斗开始状态结算，完成后变为PLAYING状态
			setFightStatus(fightStartSettle())
			break;
		case FightStatusTypes.FIGHTING:
			// 战斗结果已出则战斗结束
			if (isFightEnd()) setFightStatus(FightStatusTypes.END)
			setFightStatus(fightingSettle())
			break;
		case FightStatusTypes.END:
			// 战斗结束，清空回合状态
			setRoundStatus(RoundStatusTypes.NULL)
			// 战斗结束结算，完成后变为WAITING状态
			setFightStatus(fightEndSettle())
			// 战斗结束后，清空战斗结果
			setFightResult(FightResultTypes.NULL)
			break;
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
		case RoundStatusTypes.PLAYING:
			setRoundStatus(roundPlayingSettle())
			break;
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