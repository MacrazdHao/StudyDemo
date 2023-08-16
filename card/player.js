// 初始卡组
const InitCards = {
  NormalAttack1: 3,
  NormalDefense1: 3,
}

const PlayerId = getRandomKey()
const EnemyPlayerId = getRandomKey()

const CardEventStatusTypes = {
  DROP: 0,
  PLAY: 1
}
let CardEventStatus = CardEventStatusTypes.PLAY
let CardEventPlayerId = null
let CardDropNum = 0

let MouseHandCard = null
const PlayerProto = {
  id: '',
  name: '', // 玩家名字
  hp: 0, // 血量
  shd: 0, // 护盾
  mp: 0, // 灵力
  vit: 0, // 体力(每回合出牌张数，每回合重置为maxVit)
  maxVit: 0, // 体力上限
  maxHandCardsNum: 0, // 手牌上限
  roundGetCardNum: 0, // 每回合抽取卡牌数
  buffs: {}, // 玩家buff，key值为随机生成的id
  cards: {}, // 卡组，卡牌对象根据卡牌id从此获取，其余数组仅存id
  handCards: [], // 手牌
  fightCards: [], // 当前战斗卡池
  roundUsedCards: [], // 回合已用卡牌
  fightRoundUsedCards: {}, // 本次对战每回合已用卡牌，[回合序号]:[回合卡牌]
  fightUsedCards: [], // 本次对战已用卡牌
  gameUsedCards: [], // 本局游戏已用卡牌
}
let UpperHandPlayerId = null // 先手玩家，某些卡牌效果会变更该回合顺序
let CurrentRoundPlayerId = null // 当前回合玩家
let Player = {}
let EnemyPlayer = {}
// 玩家角色初始化
function initPlayer(isMine = true, name = '', career = CareerType.HUMAN) {
  const careerInitInfo = getCareerInitInfo(career)
  let player = {
    ...(JSON.parse(JSON.stringify(PlayerProto))),
    ...careerInitInfo,
    id: isMine ? PlayerId : EnemyPlayerId,
    name: name || (isMine ? PlayerId : EnemyPlayerId),
  }
  for (let key in player) {
    const _player = isMine ? Player : EnemyPlayer
    _player[key] = player[key]
  }
}
// 获取回合优先玩家
function getUpperHandPlayer() {
  return UpperHandPlayerId = PlayerId
  const rand = getIntRandom()
  if (rand === 0) return UpperHandPlayerId = PlayerId
  if (rand === 1) return UpperHandPlayerId = EnemyPlayerId
}
// 根据卡牌ID获取玩家卡组内卡牌信息
function getCardInfo(cardId, isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  return _player.cards[cardId] || null
}
// 初始化玩家卡组
function initPlayerCards(isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  _player.cards = generateCardsGroup(_player.id, InitCards)
  console.log(_player)
}
// 初始化玩家战斗卡池
function initFightCards(isMine = true, extraCards = {}) {
  const fightCards = []
  const _player = isMine ? Player : EnemyPlayer
  // 将额外卡组放入玩家卡组
  for (let cId in extraCards) {
    _player.cards[cId] = extraCards[cId]
  }
  // 将卡组的乱序卡牌id放入玩家战斗卡池
  fightCards.push(...randomArray(Object.keys(_player.cards)))
  _player.fightCards = fightCards
}
// 玩家从战斗卡池抽取手牌
function getHandCards(isMine = true, num) {
  const _player = isMine ? Player : EnemyPlayer
  const { roundGetCardNum } = _player
  let cardNum = num || roundGetCardNum
  for (let i = 0; i < cardNum; i++) {
    _player.handCards.push(_player.fightCards.shift())
  }
}
// 出牌
function playCard(e, isMine = true, cardId) {
  const _player = isMine ? Player : EnemyPlayer
  if (_player.vit <= 0) {
    alert('体力不足')
    return
  }
  const _cardId = isMine ? MouseHandCard : cardId
  const card = _player.cards[_cardId]
  // 出牌行为使体力扣减
  _player.vit--
  // 移出手牌
  _player.handCards = _player.handCards.filter(cId => cId !== _cardId)
  // 卡牌记录更新
  _player.roundUsedCards.push(_cardId)
  _player.fightUsedCards.push(_cardId)
  _player.gameUsedCards.push(_cardId)
  // 更新桌面展示牌
  DesktopCard = card
  if (isMine) {
    // 己方出牌，则清空鼠标悬浮手牌
    MouseHandCard = null
  }
  // 手牌影响
  card.effects()
  // console.log(card, _player)
}
// 丢弃手牌
function dropCard(e, isMine = true, cardId) {
  const _player = isMine ? Player : EnemyPlayer
  const _cardId = isMine ? MouseHandCard : cardId
  // 移出手牌
  _player.handCards = _player.handCards.filter(cId => cId !== _cardId)
  // 卡牌记录更新
  _player.roundUsedCards.push(_cardId)
  _player.fightUsedCards.push(_cardId)
  _player.gameUsedCards.push(_cardId)
}
// 造成伤害
function attackPlayer({ owner, atk = 0, penAtk = 0, selfAtk = 0, selfPenAtk = 0 }) {
  const isMine = PlayerId === owner
  const attacker = isMine ? Player : EnemyPlayer
  const sufferer = isMine ? EnemyPlayer : Player
  // 敌伤
  if (atk || penAtk) {
    const { hp, shd } = sufferer
    const lastShd = shd - atk
    const canDef = lastShd >= 0
    const lastAtk = canDef ? 0 : -lastShd
    sufferer.shd = canDef ? lastShd : 0
    sufferer.hp = hp - lastAtk - penAtk
  }
  // 自伤
  if (selfAtk || selfPenAtk) {
    const { hp, shd } = attacker
    const lastShd = shd - selfAtk
    const canDef = lastShd >= 0
    const lastAtk = canDef ? 0 : -lastShd
    attacker.shd = canDef ? lastShd : 0
    attacker.hp = hp - lastAtk - selfPenAtk
  }
  console.log(Player, EnemyPlayer)
}
// 增加护盾
function addShield({ owner, shd = 0 }) {
  const isMine = PlayerId === owner
  const _player = isMine ? Player : EnemyPlayer
  _player.shd += shd
  console.log(Player, EnemyPlayer)
}
// 播报
function broadcast(text) {

}
// buff结算
function settleBuffs({ owner, effects }) {

}
// 完结回合结算等待
function roundEndWaitingSettle() {
  const isMine = CurrentRoundPlayerId === PlayerId
  const _player = isMine ? Player : EnemyPlayer
  // 判断是否丢弃手牌
  CardDropNum = _player.handCards.length - _player.maxHandCardsNum
  if (CardDropNum <= 0) {
    CardEventPlayerId = _player.id
    CardEventStatus = CardEventStatusTypes.PLAY
    return RoundStatusTypes.END
  }
  CardEventPlayerId = _player.id
  CardEventStatus = CardEventStatusTypes.DROP
  return RoundStatusTypes.ENDWAITING
}
// 玩家回合结束结算
function roundEndSettle() {
  const isMine = CurrentRoundPlayerId === PlayerId
  const _player = isMine ? Player : EnemyPlayer
  // 记录本回合卡牌记录
  _player.fightRoundUsedCards[Round] = [..._player.roundUsedCards]
  // 清空回合卡牌记录
  _player.roundUsedCards = []
  // buff结算

  return RoundStatusTypes.START
}
// 玩家回合起始结算
function roundStartSettle() {
  // buff结算
  // 战斗卡池为空或不足抽牌数，则重置卡池
  // 注意消耗牌将不会重置入卡池
  // 注意手牌不重置入卡池
  // 抽牌
  // 单数为先，双数为后
  const isMine = Round % 2 === 1 && UpperHandPlayerId === PlayerId
  CurrentRoundPlayerId = isMine ? PlayerId : EnemyPlayerId
  const _player = isMine ? Player : EnemyPlayer
  CardEventPlayerId = _player.id
  CardEventStatus = CardEventStatusTypes.PLAY
  _player.vit = _player.maxVit
  getHandCards(true, _player.roundGetCardNum)
  return RoundStatusTypes.PLAYING
}

// 敌对APC自动回合
function enemyAutoPlay() {
  
}