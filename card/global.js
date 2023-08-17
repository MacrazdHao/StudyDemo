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
const EndRoundButton = document.getElementById('EndRoundButton')
const GameStatusDom = document.getElementById('GameStatus')
const FightStatusDom = document.getElementById('FightStatus')
const RoundStatusDom = document.getElementById('RoundStatus')

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
// 回合结束按钮点击事件
function roundEndFunc(e) {
  endRound()
  EndRoundButton.style.display = 'none'
}