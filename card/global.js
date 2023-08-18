const GameWindow = document.getElementById('WhiteBoard')
const Context = GameWindow.getContext('2d')
let WindowWdith = document.body.offsetWidth
let WindowHeight = document.body.offsetHeight

GameWindow.width = WindowWdith
GameWindow.height = WindowHeight

const WhiteBoardWidth = GameWindow.width
const WhiteBoardHeight = GameWindow.height

const StartButton = document.getElementById('StartButton')
const FightButton = document.getElementById('FightButton')
const RetryButton = document.getElementById('RetryButton')
const FightResultDom = document.getElementById('FightResult')
const EndRoundButton = document.getElementById('EndRoundButton')
const WhoseRoundDom = document.getElementById('WhoseRound')
const GameStatusDom = document.getElementById('GameStatus')
const FightStatusDom = document.getElementById('FightStatus')
const RoundStatusDom = document.getElementById('RoundStatus')

const BroadcaseListDom = document.getElementById('BroadcaseList')

const PlayerBoxDom = document.getElementById('PlayerBox')
const EnemyNameDom = document.getElementById('EnemyName')
const EnemySHDDom = document.getElementById('EnemySHD')
const EnemyHPDom = document.getElementById('EnemyHP')
const EnemyMPDom = document.getElementById('EnemyMP')
const EnemyVITDom = document.getElementById('EnemyVIT')
const EnemyFightCardsDom = document.getElementById('EnemyFightCards')
const EnemyFightUsedCardsDom = document.getElementById('EnemyFightUsedCards')
const MyNameDom = document.getElementById('MyName')
const MySHDDom = document.getElementById('MySHD')
const MyHPDom = document.getElementById('MyHP')
const MyMPDom = document.getElementById('MyMP')
const MyVITDom = document.getElementById('MyVIT')
const MyFightCardsDom = document.getElementById('MyFightCards')
const MyFightUsedCardsDom = document.getElementById('MyFightUsedCards')

window.onresize = () => {
  WindowWdith = document.body.offsetWidth
  WindowHeight = document.body.offsetHeight
  GameWindow.width = WindowWdith
  GameWindow.height = WindowHeight
}

let MousePos = { x: 0, y: 0, color: getRandomColor() }

// 获取鼠标坐标
function getMousePos(e) {
  MousePos = windowToCanvas(e.x, e.y, { ...MousePos, color: getRandomColor() })
}
// 鼠标点击事件汇集
function mouseClick(e) {
  // console.log(CardEventPlayerId, PlayerId)
  if (MouseHandCard && CardEventPlayerId === PlayerId) {
    if (CardEventStatus === CardEventStatusTypes.PLAY) playCard()
    if (CardEventStatus === CardEventStatusTypes.DROP) dropCard()
  }
}
// 开始按钮点击事件
function gameStartFunc(e) {
  startGame()
  StartButton.style.display = 'none'
  FightButton.style.display = 'inline'
}
// 战斗按钮点击事件
function fightStartFunc(e) {
  startFight()
  FightButton.style.display = 'none'
}
// 再次尝试按钮点击事件
function retryFunc(e) {
  startFight()
  RetryButton.style.display = 'none'
}
// 回合结束按钮点击事件
function roundEndFunc(e) {
  endRound()
}