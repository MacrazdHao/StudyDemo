const PlayerId = getRandomKey()
const EnemyPlayerId = getRandomKey()

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
  tempCards: {}, // 临时卡组，通过某些卡牌效果等获得的卡组
  fightCardsTimes: {}, // 战斗卡池中的卡牌使用剩余次数
  gameCardsTimes: {}, // 本局游戏中的卡牌使用剩余次数
  fightCards: [], // 当前战斗卡池
  handCards: [], // 手牌
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
  return _player.cards[cardId] || _player.tempCards[cardId] || null
}
// 初始化玩家卡组
function initPlayerCards(isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  _player.cards = generateCardsGroup(_player.id, InitCards)
}
// 获取当前卡牌是否能够加入战斗卡池判断结果
function jurdgeCardCanPushFightCards({ id, owner }) {
  const isMine = owner === PlayerId
  const { handCards, gameCardsTimes, fightCardsTimes } = isMine ? Player : EnemyPlayer
  const gTimes = gameCardsTimes[id] || null
  const fTimes = fightCardsTimes[id] || null
  // 存在于手牌的卡牌不加入卡池
  if (handCards.includes(id)) return false
  // 未曾加入卡组或卡池，表示为新卡牌，未曾使用，则可加入卡池
  if (gTimes === null || fTimes === null) return true
  // 优先判断当局游戏剩余使用次数
  if (gTimes > 0) {
    return fTimes > 0
  }
  return false
}
// 初始化玩家战斗卡池
function initFightCards(isMine = true, extraCards = {}) {
  const fightCards = []
  const _player = isMine ? Player : EnemyPlayer
  // 将额外卡组放入玩家卡组(均为一次性加入)
  for (let cId in extraCards) {
    _player.cards[cId] = extraCards[cId]
  }
  // 将临时卡组放入玩家战斗卡池
  for (let cId in _player.tempCards) {
    if (jurdgeCardCanPushFightCards(_player.tempCards[cId])) {
      fightCards.push(cId)
    }
  }
  // 将卡组的乱序卡牌id放入玩家战斗卡池
  for (let cId in _player.cards) {
    if (jurdgeCardCanPushFightCards(_player.cards[cId])) {
      fightCards.push(cId)
    }
  }
  // 初始化卡牌使用次数
  fightCards.forEach((cId) => {
    const { fightUseTimes, gameUseTimes } = getCardInfo(cId, isMine)
    _player.fightCardsTimes[cId] = _player.fightCardsTimes[cId] || fightUseTimes
    _player.gameCardsTimes[cId] = _player.gameCardsTimes[cId] || gameUseTimes
  })
  _player.fightCards = randomArray(fightCards)
}
// 玩家从战斗卡池抽取手牌
function getHandCards(isMine = true, num) {
  // 战斗卡池为空或不足抽牌数，则重置卡池
  if (fightCards.length === 0) initFightCards(isMine)
  const _player = isMine ? Player : EnemyPlayer
  const { fightCards, roundGetCardNum } = _player
  // 卡池少于应抽卡数，以卡池剩余卡牌数量为准
  let cardNum = Math.min(fightCards.length, num || roundGetCardNum)
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
  const card = getCardInfo(_cardId, isMine)
  // 出牌行为使体力扣减
  _player.vit--
  // 卡牌使用次数减少
  _player.gameCardsTimes[_cardId]--
  _player.fightCardsTimes[_cardId]--
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
  console.log(_player)
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
// 将某卡牌插入战斗卡池中
function addCardToFightCards(card, loc) {
  const { id: cardId, owner } = card
  const isMine = PlayerId === owner
  const _player = isMine ? Player : EnemyPlayer
  let rIndex = 0
  switch (loc) {
    case CardLocType.DOWN:
      rIndex = _player.fightCards.length
      break
    case CardLocType.MIDDLE:
      rIndex = Math.floor(_player.fightCards.length / 2)
      break
    case CardLocType.MIDDLERANDOM:
      rIndex = getExcludeRandom(fightCards.length, 0, [_player.fightCards.length, 0])
      break
    case CardLocType.RANDOM:
      rIndex = getIntRandom(fightCards.length, 0)
      break
    case CardLocType.UP:
      rIndex = 0
      break
  }
  _player.fightCards.splice(rIndex, 0, cardId)
}
// 获得临时卡组 - cardLocations: {[CardId]: CardLocType}
function addTempCards(cards = {}, cardLocations = {}) {
  for (let cId in cards) {
    const { owner } = cards[cId]
    const isMine = PlayerId === owner
    const _player = isMine ? Player : EnemyPlayer
    _player.tempCards[cId] = cards[cId]
    addCardToFightCards(cId, cardLocations[cId])
  }
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
// 战斗开始结算
function fightStartSettle() {
  // 初始化玩家战斗信息
  initPlayer()
  initPlayer(false)
  // 获取先手方
  getUpperHandPlayer()
  // 初始化玩家卡组
  initPlayerCards()
  initPlayerCards(false)
  // 初始化战斗卡池
  initFightCards(true)
  initFightCards(false)
  // 获取战斗初始手牌
  getHandCards(true, Player.maxHandCardsNum)
  getHandCards(false, EnemyPlayer.maxHandCardsNum)
  return FightStatusTypes.FIGHTING
}
// 玩家回合结束前置结算
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
  return RoundStatusTypes.END
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

  return RoundStatusTypes.STARTWAITING
}
// 玩家回合起始等待结算
function roundStartWaitingSettle() {
  if (UpperHandPlayerId === CurrentRoundPlayerId) Round++
  return RoundStatusTypes.START
}
// 玩家回合起始结算
function roundStartSettle() {
  // buff结算
  // 单数为先，双数为后
  const isMine = Round % 2 === 1 && UpperHandPlayerId === PlayerId
  CurrentRoundPlayerId = isMine ? PlayerId : EnemyPlayerId
  const _player = isMine ? Player : EnemyPlayer
  CardEventPlayerId = _player.id
  CardEventStatus = CardEventStatusTypes.PLAY
  // 重置体力
  _player.vit = _player.maxVit
  // 抽牌
  getHandCards(true, _player.roundGetCardNum)
  return RoundStatusTypes.PLAYWAITING
}
// 玩家回合中前置结算
function roundPlayWaitingSettle() {
  return RoundStatusTypes.START
}

// 敌对APC自动回合
function enemyAutoPlay() {

}
