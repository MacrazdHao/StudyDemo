const GameStatusTypes = {
	WAITING: 0,
	START: 1,
	OVER: 2,
}
const RoundStatusTypes = {
	NULL: -1,
	START: 0,
	PLAYING: 1,
	END: 2,
	STARTWAITING: 3,
	PLAYINGWAITING: 4,
	ENDWAITING: 5,
}

let GameStatus = GameStatusTypes.WAITING
let Round = 0
let RoundStatus = RoundStatusTypes.NULL

function setGameStatus(status) {
	GameStatus = status
}
function setRoundStatus(status) {
	RoundStatus = status
}

function roundStart() {
	Round++
	setRoundStatus(roundStartSettle())
}
function roundEndWaiting() {
	setRoundStatus(roundEndWaitingSettle())
}
function roundEnd() {
	setRoundStatus(roundEndSettle())
}

function roundListener() {
	switch (RoundStatus) {
		case RoundStatusTypes.NULL: break;
		case RoundStatusTypes.START: roundStart(); break;
		case RoundStatusTypes.PLAYING: break;
		case RoundStatusTypes.END: roundEnd(); break;
		case RoundStatusTypes.STARTWAITING: break;
		case RoundStatusTypes.PLAYINGWAITING: break;
		case RoundStatusTypes.ENDWAITING: roundEndWaiting(); break;
	}
}

function startFight() {
	initPlayer()
	initPlayer(false)
	initPlayerCards()
	initPlayerCards(false)
	initFightCards()
	initFightCards(false)
	getHandCards(true, Player.maxHandCardsNum)
	getHandCards(false, EnemyPlayer.maxHandCardsNum)
	setGameStatus(GameStatusTypes.START)
	getUpperHandPlayer()
	setRoundStatus(RoundStatusTypes.START)
	setTimeout(() => {
		setRoundStatus(RoundStatusTypes.ENDWAITING)
	}, 100)
}