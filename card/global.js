const WhiteBoardDom = document.getElementById('WhiteBoard')
const Context = WhiteBoardDom.getContext('2d')
let WindowWdith = document.body.offsetWidth
let WindowHeight = document.body.offsetHeight

WhiteBoardDom.width = WindowWdith
WhiteBoardDom.height = WindowHeight

const WhiteBoardWidth = WhiteBoardDom.width
const WhiteBoardHeight = WhiteBoardDom.height

window.onresize = () => {
  WindowWdith = document.body.offsetWidth
  WindowHeight = document.body.offsetHeight
  WhiteBoardDom.width = WindowWdith
  WhiteBoardDom.height = WindowHeight
}

let MousePos = { x: 0, y: 0, color: getRandomColor() }

// 获取鼠标坐标
function getMousePos(e) {
  MousePos = windowToCanvas(e.x, e.y, { ...MousePos, color: getRandomColor() })
}
// 鼠标点击事件汇集
function mouseClick(e) {
  if (MouseHandCard && CardEventPlayerId === PlayerId) {
    if (CardEventStatus === CardEventStatusTypes.PLAY) playCard()
    if (CardEventStatus === CardEventStatusTypes.DROP) dropCard()
  }
}