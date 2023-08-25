const PlayerId = getRandomKey()
const EnemyPlayerId = getRandomKey()
const PlayerProto = {
  id: '',
  name: '', // 玩家名字
  [BaseValueAttributeKeys.MAXHP]: 0, // 最大血量
  [BaseValueAttributeKeys.MAXSHIELD]: 0, // 最大护盾
  [BaseValueAttributeKeys.MAXMP]: 0, // 最大灵力
  [BaseValueAttributeKeys.MAXVITALITY]: 0, // 最大体力
  [BaseValueAttributeKeys.HP]: 0, // 血量
  [BaseValueAttributeKeys.SHIELD]: 0, // 护盾
  [BaseValueAttributeKeys.MP]: 0, // 灵力
  [BaseValueAttributeKeys.VITALITY]: 0, // 体力(每回合出牌张数，每回合重置为maxVit)
  [BaseValueAttributeKeys.ATTACK]: 0, // 额外伤害，注意细分两种造成额外伤害的情况(penAtck同)：1-该atk属性的合并伤害；2-来自战斗行为类buff监听到攻击行为而造成的附加伤害；
  [BaseValueAttributeKeys.PENATTACK]: 0, // 额外穿透伤害
  [BaseValueAttributeKeys.MAXHANDCARDSNUM]: 0, // 手牌上限
  [BaseValueAttributeKeys.ROUNDGETCARDNUM]: 0, // 每回合抽取卡牌数
  [BaseValueAttributeKeys.INITIALVITALITY]: 0, // 回合初始体力
  reborns: {}, // 重生对象
  rebornQueue: [], // 重生队列
  buffs: [], // 存活的buff(id)
  usedBuffs: {}, // 玩家buff，key值为随机生成的id
  cards: {}, // 卡组，卡牌对象根据卡牌id从此获取，其余数组仅存id
  tempCards: {}, // 临时卡组，通过某些卡牌效果等获得的卡组
  fightCardsTimes: {}, // 战斗卡池中的卡牌使用剩余次数
  gameCardsTimes: {}, // 本局游戏中的卡牌使用剩余次数
  fightCards: [], // 当前战斗卡池
  handCards: [], // 手牌
  roundUsedCards: [], // 回合已用卡牌
  fightRoundUsedCards: {}, // 本次战斗每回合已用卡牌，[回合序号]:[回合卡牌]
  fightUsedCards: [], // 本次战斗已用卡牌
  gameUsedCards: [], // 本局游戏已用卡牌
  fightActions: {}, // 读取角色战斗行为时使用该值，本局战斗行为 [FightActionTypes]:[FightActionWayTypes]
  fightActionsBuffer: {}, // 改写角色战斗行为时使用该值(setFightActionStatus函数)，本局战斗行为缓冲区，采用Buffer缓冲区的原因见函数settleFightActions中注释
}

let CardEventStatus = CardEventStatusTypes.PLAY
let CardEventPlayerId = null
let CardDropNum = 0
let MouseHandCard = null
let UpperHandPlayerId = null // 先手玩家，某些卡牌效果会变更该回合顺序
let CurrentRoundPlayerId = null // 当前回合玩家
let Player = {}
let EnemyPlayer = {}

// 其他前置函数
// 获取重生实例
function getRebornObject({ playerInfo = {}, conditions = function () { return true }, effects = PresetEffects.None }) {
  const id = getRandomKey()
  const reborn = {
    player: {
      ...playerInfo,
      [BaseValueAttributeKeys.HP]: playerInfo[BaseValueAttributeKeys.HP] || 1 // 复活hp默认为1
    },
    id,
    owner: isMine ? PlayerId : EnemyPlayerId,
    conditions,
    effects
  }
  return reborn
}

// 战斗行为标志信息相关函数
// 重置战斗行为缓冲区
function resetFightActionsBuffer(isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  for (let faKey in FightActionTypes) {
    _player.fightActionsBuffer[FightActionTypes[faKey]] = FightActionWayTypes.WAITING
  }
}
// 设置战斗行为(注意这里是设置Buffer——缓冲区，正式的值由在战斗行为结算函数settleFightActions中正式赋值)
function setFightActionStatus(fightActionType, fightActionWayType = FightActionWayTypes.WAITING, isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  _player.fightActionsBuffer[fightActionType] = fightActionWayType
}

// 玩家信息初始化相关函数
// 玩家角色初始化
function initPlayer(isMine = true, name = '', career = CareerTypes.HUMAN) {
  const careerInitInfo = getCareerInitInfo(career)
  let player = {
    ...(JSON.parse(JSON.stringify(PlayerProto))),
    ...careerInitInfo,
    id: isMine ? PlayerId : EnemyPlayerId,
    name: name || (isMine ? PlayerId : EnemyPlayerId),
  }
  for (let faKey in FightActionTypes) {
    player.fightActions[FightActionTypes[faKey]] = FightActionWayTypes.WAITING
    player.fightActionsBuffer[FightActionTypes[faKey]] = FightActionWayTypes.WAITING
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

// 一些属性对象信息相关的获取函数
// 根据卡牌ID获取玩家卡组内卡牌信息
function getCardInfo(cardId, isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  return _player.cards[cardId] || _player.tempCards[cardId] || null
}
// 根据重生ID获取玩家重生信息
function getRebornInfo(rebornId, isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  return _player.reborns[rebornId] || null
}
// 根据重生ID获取玩家Buff信息
function getBuffInfo(buffId) {
  return Player.usedBuffs[buffId] || EnemyPlayer.usedBuffs[buffId] || null
}

// 玩家卡牌信息相关函数
// 初始化玩家卡组
function initPlayerCards(isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  _player.cards = generateCardsGroup(_player.id, _player.initCards)
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
function getHandCards(isMine = true, num, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  const { fightCards, [BaseValueAttributeKeys.ROUNDGETCARDNUM]: roundGetCardNum } = _player
  // 战斗卡池为空或不足抽牌数，则重置卡池
  if (!fightCards.length) initFightCards(isMine)
  // 卡池少于应抽卡数，以卡池剩余卡牌数量为准
  let cardNum = Math.min(_player.fightCards.length, num || roundGetCardNum)
  if (cardNum > 0) {
    setFightActionStatus(FightActionTypes.EXTRACTHANDCARD, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  }
  for (let i = 0; i < cardNum; i++) {
    _player.handCards.push(_player.fightCards.shift())
  }
}
// 从非战斗卡池的自定义额外卡池中获得卡牌
function getHandCardsFromOthers(isMine = true, cardsArr = [], num, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  // 卡池少于应抽卡数，以卡池剩余卡牌数量为准
  let cardNum = Math.min(cardsArr.length, num)
  if (cardNum > 0) {
    setFightActionStatus(FightActionTypes.GETHANDCARD, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  }
  // 打乱额外卡池顺序
  const _cardsArr = randomArray(cardsArr)
  for (let i = 0; i < cardNum; i++) {
    _player.handCards.push(_cardsArr.shift())
  }

}
// 判断手牌是否具有满足出牌条件
function getEnableHandCards(isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  const cardIds = []
  for (let i = 0; i < _player.handCards.length; i++) {
    const cId = _player.handCards[i]
    const card = getCardInfo(cId, isMine)
    if (card.conditions()) cardIds.push(cId)
  }
  return cardIds
}
// 出牌
function playCard(e, isMine = true, cardId, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  const _cardId = isMine ? MouseHandCard : cardId
  const enableHandCards = getEnableHandCards(isMine)
  if (!enableHandCards.includes(_cardId)) {
    alert('当前不符合出牌条件')
    return
  }
  const card = getCardInfo(_cardId, isMine)
  // 以下卡牌所需体力、灵力不足扣减的判断放于卡牌默认条件函数BaseCondition中
  // 出牌行为使体力扣减
  const vitRes = changeVIT(-card[CardItems.NEEDVIT], isMine)
  // if (!vitRes) {
  //   alert('体力不足')
  //   return
  // }
  if (card[CardItems.NEEDMP]) {
    // 出牌行为使体力扣减
    const mpRes = changeMP(-card[CardItems.NEEDMP], isMine)
    // if (!mpRes) {
    //   alert('灵力不足')
    //   return
    // }
  }
  setFightActionStatus(FightActionTypes.PLAYCARD, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
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
  DesktopCards.push(JSON.parse(JSON.stringify(card)))
  if (isMine) {
    // 己方出牌，则清空鼠标悬浮手牌
    MouseHandCard = null
  }
  // 手牌影响
  card.effects()
}
// 丢弃手牌
function dropCard(e, isMine = true, cardId, abandon = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  const _cardId = isMine ? MouseHandCard : cardId
  setFightActionStatus(abandon ? FightActionTypes.ABANDONCARD : FightActionTypes.LOSEHANDCARD, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
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
    case CardLocTypes.DOWN:
      rIndex = _player.fightCards.length
      break
    case CardLocTypes.MIDDLE:
      rIndex = Math.floor(_player.fightCards.length / 2)
      break
    case CardLocTypes.MIDDLERANDOM:
      rIndex = getExcludeRandom(fightCards.length, 0, [_player.fightCards.length, 0])
      break
    case CardLocTypes.RANDOM:
      rIndex = getIntRandom(fightCards.length, 0)
      break
    case CardLocTypes.UP:
      rIndex = 0
      break
  }
  _player.fightCards.splice(rIndex, 0, cardId)
}
// 获得临时卡组 - cardLocations: {[CardId]: CardLocTypes}
function addTempCards(cards = {}, cardLocations = {}) {
  for (let cId in cards) {
    const { owner } = cards[cId]
    const isMine = PlayerId === owner
    const _player = isMine ? Player : EnemyPlayer
    _player.tempCards[cId] = cards[cId]
    addCardToFightCards(cId, cardLocations[cId])
  }
}

// 玩家属性信息相关函数
// 增加额外伤害
function addATK(addNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  _player[BaseValueAttributeKeys.ATTACK] += addNum
  setFightActionStatus(FightActionTypes.ADDATK, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  return true
}
// 增加额外穿透伤害.
function addPENATK(addNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  _player[BaseValueAttributeKeys.PENATTACK] += addNum
  setFightActionStatus(FightActionTypes.ADDPENATK, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  return true
}
// 增加血量
function addHP(addNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  // 增加值不超过上限
  const _addNum = Math.min(addNum, _player[BaseValueAttributeKeys.MAXHP] - _player[BaseValueAttributeKeys.HP])
  _player[BaseValueAttributeKeys.HP] += _addNum
  setFightActionStatus(FightActionTypes.ADDHP, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  return true
}
// 增加体力
function addVIT(addNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  // 增加值不超过上限
  const _addNum = Math.min(addNum, _player[BaseValueAttributeKeys.MAXVITALITY] - _player[BaseValueAttributeKeys.VITALITY])
  _player[BaseValueAttributeKeys.VITALITY] += _addNum
  setFightActionStatus(FightActionTypes.ADDVIT, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  return true
}
// 增加灵力
function addMP(addNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  // 增加值不超过上限
  const _addNum = Math.min(addNum, _player[BaseValueAttributeKeys.MAXMP] - _player[BaseValueAttributeKeys.MP])
  _player[BaseValueAttributeKeys.MP] += _addNum
  setFightActionStatus(FightActionTypes.ADDMP, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  return true
}
// 增加护盾
function addSHD(addNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  // 增加值不超过上限
  const _addNum = Math.min(addNum, _player[BaseValueAttributeKeys.MAXSHIELD] - _player[BaseValueAttributeKeys.SHIELD])
  _player.shd += _addNum
  setFightActionStatus(FightActionTypes.ADDSHD, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  return true
}
// 添加重生次数
function addReborn(isMine = true, rebornInfo = {}, isForce = false) {
  // 重生对象基础属性等同于角色属性，重生后将根据playerInfo直接取代原角色属性，其余自行根据conditions所需添加
  const _player = isMine ? Player : EnemyPlayer
  const reborn = getRebornObject(rebornInfo)
  _player.rebornQueue.push(reborn.id)
  _player[reborn.id] = reborn
  setFightActionStatus(FightActionTypes.ADDREBORN, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
}
// 添加buff
function addBuff(isMine = true, buffKey, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  let buff = null
  switch (Buffs[buffKey].type) {
    case BuffTypes.OVERLAY:
      // 叠加Buff，只会叠加生效回合数
      let existBuffId = null
      for (let i = 0; i < _player.buffs.length; i++) {
        const bId = _player.buffs[i]
        if (_player.usedBuffs[bId].key === buffKey) {
          if (_player.usedBuffs[bId].round >= _player.usedBuffs[bId].maxOverlayRound) {
            alert('该buff生效回合已达叠加上限')
            return false
          }
          existBuffId = bId
          break
        }
      }
      // 已存在该buff，叠加回合
      if (existBuffId) {
        // 叠加回合不超过上限
        _player.usedBuffs[existBuffId].round = Math.min(Buffs[buffKey].round + _player.usedBuffs[existBuffId].round, _player.usedBuffs[existBuffId].maxOverlayRound)
        setFightActionStatus(FightActionTypes.ADDBUFF, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
        return true
      }
      // 不存在该buff，push进角色buffs中
      buff = createBuffObject(_player.id, buffKey)
      break
    case BuffTypes.UNIQUE:
      for (let i = 0; i < _player.buffs.length; i++) {
        const bId = _player.buffs[i]
        // 唯一buff不可重复存在
        if (_player.usedBuffs[bId].key === buffKey) {
          if (isMine) alert('已存在相同的唯一buff')
          return false
        }
      }
      // 不存在该buff，push进角色buffs中
      buff = createBuffObject(_player.id, buffKey)
      break
    case BuffTypes.REPEAT:
      // REPEAT类型buff直接push进角色buffs中
      buff = createBuffObject(_player.id, buffKey)
      break
  }
  // 不存在的可OVERLAY类型buff，或符合条件的REPEAT和UNIQUE类型buff都是需要push到角色buffs最后面，并将其放入usedBuffs
  _player.usedBuffs[buff.id] = buff
  _player.buffs.push(buff.id)
  if (buff.immediately) enableABuff(buff.id, isMine)
  setFightActionStatus(FightActionTypes.ADDBUFF, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  return true
}
// 失去血量
function loseHP(loseNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  _player[BaseValueAttributeKeys.HP] -= loseNum
  setFightActionStatus(FightActionTypes.LOSEHP, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  // 任意败北判断
  updateFightResult()
  return true
}
// 失去体力
function loseVIT(loseNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  // if (_player[BaseValueAttributeKeys.VITALITY] === 0) return false
  setFightActionStatus(FightActionTypes.LOSEVIT, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  const lastVIT = _player[BaseValueAttributeKeys.VITALITY] - loseNum
  _player[BaseValueAttributeKeys.VITALITY] = lastVIT > 0 ? lastVIT : 0
  return true
}
// 失去灵力值
function loseMP(loseNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  // if (_player[BaseValueAttributeKeys.MP] === 0) return false
  setFightActionStatus(FightActionTypes.LOSEMP, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  const lastMP = _player[BaseValueAttributeKeys.MP] - loseNum
  _player[BaseValueAttributeKeys.MP] = lastMP > 0 ? lastMP : 0
  return true
}
// 失去护盾
function loseSHD(loseNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  const lastShd = _player.shd - loseNum
  if (_player.shd > 0) setFightActionStatus(FightActionTypes.LOSESHD, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  if (lastShd < 0) {
    // changeHP(lastShd, isMine, isForce)
    _player.shd = 0
    return
  }
  _player.shd = lastShd
  return true
}
// 失去额外伤害
function loseATK(loseNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  setFightActionStatus(FightActionTypes.LOSEATK, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  // 允许为负数
  _player[BaseValueAttributeKeys.ATTACK] -= loseNum
  return true
}
// 失去额外穿透伤害
function losePENATK(loseNum, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  setFightActionStatus(FightActionTypes.LOSEPENATK, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  // 允许为负数
  _player[BaseValueAttributeKeys.PENATTACK] -= loseNum
  return true
}
// 移除buff
function loseBuff(isMine = true, buffId, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  // 触发buff的losed函数
  _player.usedBuffs[buffId].losed()
  // 重置属性影响记录器
  // _player.usedBuffs[buffId].effectRecord = {}
  // 生效回合数归零
  _player.usedBuffs[buffId].round = 0
  // 重置回合影响触发次数
  _player.usedBuffs[buffId].roundEffectTimes = 0
  // 从存活buffs中移除
  _player.buffs = _player.buffs.filter(bId => bId !== buffId)
  setFightActionStatus(FightActionTypes.LOSEBUFF, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
}
// 改变血量
function changeHP(num, isMine = false, isForce = false) {
  if (num > 0) return addHP(num, isMine, isForce)
  if (num < 0) return loseHP(-num, isMine, isForce)
}
// 改变护盾
function changeSHD(num, isMine = false, isForce = false) {
  if (num > 0) return addSHD(num, isMine, isForce)
  if (num < 0) return loseSHD(-num, isMine, isForce)
}
// 改变灵力值
function changeMP(num, isMine = false, isForce = false) {
  if (num > 0) return addMP(num, isMine, isForce)
  if (num < 0) return loseMP(-num, isMine, isForce)
}
// 改变体力
function changeVIT(num, isMine = false, isForce = false) {
  console.log(num)
  if (num > 0) return addVIT(num, isMine, isForce)
  if (num < 0) return loseVIT(-num, isMine, isForce)
}
// 改变伤害
function changeATK(num, isMine = false, isForce = false) {
  if (num > 0) return addATK(num, isMine, isForce)
  if (num < 0) return loseATK(-num, isMine, isForce)
}
// 改变穿透伤害
function changePENATK(num, isMine = false, isForce = false) {
  if (num > 0) return addPENATK(num, isMine, isForce)
  if (num < 0) return losePENATK(-num, isMine, isForce)
}


// 获取可用的属性对象相关函数
// 判断重队列中是否具有满足重生条件
function getEnableReborns(isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  const rebornIds = []
  for (let i = 0; i < _player.rebornQueue.length; i++) {
    const rId = _player.handCards[i]
    const reborn = getRebornInfo(rId, isMine)
    if (reborn.conditions()) rebornIds.push(rId)
  }
  return rebornIds
}
// 获取符合触发条件的战斗行为触发类型的buff
function getEnableFightActionBuffs(isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  const buffIds = []
  _player.buffs.forEach(bId => {
    const { enableTypes, enableFightActions } = getBuffInfo(bId)
    // 过滤出buff效果触发类型包含战斗行为的buff
    if (enableTypes.includes(BuffEnableTypes.FIGHTACTION)) {
      for (let eKey in enableFightActions) {
        // 筛选出符合该角色当前战斗行为的buff
        if (enableFightActions[eKey] === _player.fightActions[eKey]
          || (enableFightActions[eKey] === FightActionWayTypes.ALL
            && (_player.fightActions[eKey] === FightActionWayTypes.FORCE
              || _player.fightActions[eKey] === FightActionWayTypes.INITIACTIVE)
          )
        ) {
          buffIds.push(bId)
          break
        }
      }
    }
  })
  return buffIds
}
// 属性对象效果触发函数
// 触发一个重生
function enableAPlayerReborn(rebornId, isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  const reborn = getRebornInfo(rebornId, isMine)
  // 覆盖角色属性
  for (let key in reborn.playerInfo) {
    _player[key] = reborn.playerInfo[key]
  }
  // 其他处理
  reborn.effects()
  // 从角色的复活队列中移出
  _player.rebornQueue = _player.rebornQueue.filter((rId) => rId !== rebornId)
  setFightActionStatus(FightActionTypes.REBORN, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  setFightActionStatus(FightActionTypes.LOSEREBORN, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
  return true
}
// buff效果触发
function enableABuff(buffId, isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  const { roundEffectTimes, maxRoundEffectTimes } = _player.usedBuffs[buffId]
  if (roundEffectTimes >= maxRoundEffectTimes) return false
  // 总触发次数仍有剩余，则触发buff影响
  _player.usedBuffs[buffId].effects()
  // 本回合触发次数+1
  _player.usedBuffs[buffId].roundEffectTimes++
  return true
}

// 其他一些函数
// 重置所有buff回合触发次数
function updateBuffRoundStatus() {
  const isMine = isMyTurn()
  const _player = isMine ? Player : EnemyPlayer
  const buffs = JSON.parse(JSON.stringify(_player.buffs))
  buffs.forEach(bId => {
    // 剩余回合数-1
    _player.usedBuffs[bId].round--
    // 重置当前回合已触发次数
    _player.usedBuffs[bId].roundEffectTimes = 0
    if (_player.usedBuffs[bId].round <= 0) {
      loseBuff(isMine, bId, false)
      console.log(_player.usedBuffs[bId])
      return false
    }
  })
}
// 造成伤害
function attackPlayer(attackInfo = {}, isForce = false) {
  const {
    owner,
    [BaseValueAttributeKeys.ATTACK]: atk,
    [BaseValueAttributeKeys.PENATTACK]: penAtk,
    [BaseValueAttributeKeys.SHIELD]: shd,
    selfAtk, selfPenAtk, selfShd
  } = attackInfo
  if (!atk && !penAtk && !shd && !selfAtk && !selfPenAtk && !selfShd) return
  // isMine指攻击者是否为自己
  const isMine = PlayerId === owner
  const _player = isMine ? Player : EnemyPlayer
  const _eplayer = isMine ? EnemyPlayer : Player
  const _playerShd = _player[BaseValueAttributeKeys.SHIELD]
  // 盾伤
  if (shd) {
    const _shd = -Math.min(_playerShd, shd)
    changeSHD(_shd, !isMine, true)
  }
  // 敌伤
  if (penAtk || atk) {
    const _penAtk = penAtk ? -Math.max(_player[BaseValueAttributeKeys.PENATTACK] + penAtk, 0) : 0
    const _atk = atk ? -Math.max(_player[BaseValueAttributeKeys.ATTACK] + atk, 0) : 0
    // 额外伤害及额外穿刺伤害均可为负，因此两者伤害应同时设定最低限制为0
    changeHP(_penAtk, !isMine, true)
    if (-_atk > _playerShd) {
      changeSHD(_playerShd, !isMine, true)
      changeHP(_atk + _playerShd, true)
    } else changeSHD(_atk, !isMine, true)
    setFightActionStatus(FightActionTypes.ATTACK, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
    setFightActionStatus(FightActionTypes.BEATTACKED, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, !isMine)
  }
  const myShd = _eplayer[BaseValueAttributeKeys.SHIELD]
  // 自盾伤
  if (selfShd) {
    const _selfShd = -Math.min(myShd, selfShd)
    changeSHD(_selfShd, isMine, false)
  }
  // 自伤
  if (selfAtk || selfPenAtk) {
    const _selfPenAtk = selfPenAtk ? -selfPenAtk : 0
    const _selfAtk = selfAtk ? -selfAtk : 0
    changeHP(_selfPenAtk, isMine, false)
    if (-_selfAtk > myShd) {
      changeSHD(myShd, isMine, false)
      changeHP(_selfAtk + myShd, isMine, false)
    } else changeSHD(_selfAtk, isMine, false)
    setFightActionStatus(FightActionTypes.BEATTACKED, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.FORCE, isMine)
  }
}
// 清空所有重生
function resetPlayerReborn(isMine = true, isForce = false) {
  const _player = isMine ? Player : EnemyPlayer
  _player.rebornQueue = []
  setFightActionStatus(FightActionTypes.LOSEREBORN, isForce ? FightActionWayTypes.FORCE : FightActionWayTypes.INITIACTIVE, isMine)
}
// 增加播报
function addBroadcast(text) {

}

// 角色阵亡相关判断函数
// 是否有角色败北
function isPlayerDead(isMine = true) {
  const _player = isMine ? Player : EnemyPlayer
  if (_player[BaseValueAttributeKeys.HP] > 0) return false
  if (!_player.rebornQueue.length) return true
  const enableReborns = getEnableReborns(isMine)
  if (!enableReborns.length) return true
  const rId = enableReborns[0]
  enableAPlayerReborn(rId, isMine)
  return false
}
// 角色败北判断
function updateFightResult() {
  const enemyDead = isPlayerDead(false)
  const meDead = isPlayerDead()
  if (meDead) setFightActionStatus(FightActionTypes.DEAD, FightActionWayTypes.ALL, true)
  if (enemyDead) setFightActionStatus(FightActionTypes.DEAD, FightActionWayTypes.ALL, false)
  if (enemyDead && meDead) return setFightResult(FightResultTypes.DRAW)
  if (enemyDead) return setFightResult(FightResultTypes.WIN)
  if (meDead) return setFightResult(FightResultTypes.FAIL)
  return setFightResult(FightResultTypes.WAITING)
}

// 回合处理及信息获取相关函数
// 获取是否为己方回合的判断结果
function isMyTurn() {
  return CurrentRoundPlayerId === PlayerId
}
// 交换回合角色
function switchRoundTurn() {
  if (!CurrentRoundPlayerId) {
    CurrentRoundPlayerId = UpperHandPlayerId
    setRoundPlayer(UpperHandPlayerId === PlayerId ? RoundPlayerTypes.PLAYER : RoundPlayerTypes.ENEMY)
  }
  else {
    let myTurn = isMyTurn()
    CurrentRoundPlayerId = myTurn ? EnemyPlayerId : PlayerId
    setRoundPlayer(myTurn ? RoundPlayerTypes.ENEMY : RoundPlayerTypes.PLAYER)
  }
}

// 属性对象及信息相关结算函数
// 战斗行为结算
function settleFightActions() {
  // 采用fightActionsBuffer缓冲区的原因：无法保证在结算战斗行为相关的buff或其他相关结算时，会出现变更fightActions的情况
  // 而读取时，则直接采用fightActions，保证本轮战斗行为不被其他先处理了的战斗行为相关buff结算或其他结算影响
  Player.fightActions = JSON.parse(JSON.stringify(Player.fightActionsBuffer))
  EnemyPlayer.fightActions = JSON.parse(JSON.stringify(EnemyPlayer.fightActionsBuffer))
  // 与战斗行为相关的buff结算
  settleFightActionBuffs()
  // 其他与战斗行为相关的结算
  // TODO...
  resetFightActionsBuffer()
  resetFightActionsBuffer(false)
  return
}
// 回合前buff结算
function settleBeforeRoundBuffs() {
  const isMine = isMyTurn()
  const _player = isMine ? Player : EnemyPlayer
  _player.buffs.forEach(bId => {
    const { enableTypes } = getBuffInfo(bId)
    if (enableTypes.includes(BuffEnableTypes.BEFOREROUND)) enableABuff(bId, isMine)
  })
}
// 回合后buff结算
function settleAfterRoundBuffs() {
  const isMine = isMyTurn()
  const _player = isMine ? Player : EnemyPlayer
  _player.buffs.forEach(bId => {
    const { enableTypes } = getBuffInfo(bId)
    if (enableTypes.includes(BuffEnableTypes.AFTERROUND)) enableABuff(bId, isMine)
  })
}
// 战斗行为触发类型的buff结算
function settleFightActionBuffs() {
  const myFightActionBuffs = getEnableFightActionBuffs()
  if (myFightActionBuffs.length) console.log(myFightActionBuffs)
  const enemyFightActionBuffs = getEnableFightActionBuffs(false)
  myFightActionBuffs.forEach(bId => {
    enableABuff(bId)
  })
  enemyFightActionBuffs.forEach(bId => {
    enableABuff(bId, false)
  })
}

// 战斗周期相关结算函数
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
  getHandCards(true, Player[BaseValueAttributeKeys.MAXHANDCARDSNUM])
  getHandCards(false, EnemyPlayer[BaseValueAttributeKeys.MAXHANDCARDSNUM])
  // 回合重置为1
  Round = 1
  console.log(Player, EnemyPlayer)
  FightResultDom.style.display = 'none'
  PlayerBoxDom.style.display = 'block'
  return FightStatusTypes.FIGHTING
}
// 战斗中结算
function fightingSettle() {
  settleFightActions()
  return FightStatusTypes.FIGHTING
}
// 战斗结束结算
function fightEndSettle() {
  // 与战斗相关的参数初始化
  Round = 0
  EndRoundButton.style.display = 'none'
  PlayerBoxDom.style.display = 'none'
  UpperHandPlayerId = null
  CurrentRoundPlayerId = null
  RoundPlayer = RoundPlayerTypes.NULL
  Player = {}
  EnemyPlayer = {}
  DesktopCards = []
  CardEventStatus = CardEventStatusTypes.PLAY
  CardEventPlayerId = null
  CardDropNum = 0

  RetryButton.style.display = 'inline'
  FightResultDom.style.display = 'inline'
  FightResultDom.innerHTML = FightResultTexts[FightResult]

  return FightStatusTypes.WAITING
}

// 回合周期结算相关函数
// 玩家回合起始等待结算
function roundStartWaitingSettle() {
  // 交换当前回合角色
  switchRoundTurn()
  const isMine = isMyTurn()
  const _player = isMine ? Player : EnemyPlayer
  CardEventPlayerId = _player.id
  EndRoundButton.style.display = isMine ? 'inline' : 'none'
  WhoseRoundDom.style.color = RoundPlayerColors[RoundPlayer]
  WhoseRoundDom.innerHTML = RoundPlayerTexts[RoundPlayer]
  // console.log(Player, EnemyPlayer)
  return RoundStatusTypes.START
}
// 玩家回合起始结算
function roundStartSettle() {
  // 单数为先，双数为后
  const isMine = isMyTurn()
  const _player = isMine ? Player : EnemyPlayer
  CardEventStatus = CardEventStatusTypes.PLAY
  // 重置体力
  _player[BaseValueAttributeKeys.VITALITY] = _player[BaseValueAttributeKeys.INITIALVITALITY]
  // 前置buff结算
  settleBeforeRoundBuffs()
  // 抽牌
  getHandCards(isMine, _player[BaseValueAttributeKeys.ROUNDGETCARDNUM])
  return RoundStatusTypes.PLAYWAITING
}
// 玩家回合中前置结算
function roundPlayWaitingSettle() {
  return RoundStatusTypes.PLAYING
}
// 玩家回合结算
function roundPlayingSettle() {
  const isMine = isMyTurn()
  if (!isMine) {
    enemyAutoPlayCard()
    return RoundStatusTypes.ENDWAITING
  }
  return RoundStatusTypes.PLAYING
}
// 玩家回合结束前置结算
function roundEndWaitingSettle() {
  const isMine = isMyTurn()
  const _player = isMine ? Player : EnemyPlayer
  // 判断是否丢弃手牌
  const cardDropNum = _player.handCards.length - _player[BaseValueAttributeKeys.MAXHANDCARDSNUM]
  if (cardDropNum <= 0) {
    CardEventPlayerId = _player.id
    CardEventStatus = CardEventStatusTypes.PLAY
    return RoundStatusTypes.END
  }
  CardEventPlayerId = _player.id
  CardEventStatus = CardEventStatusTypes.DROP
  if (!isMine) enemyAutoDropCard()
  return RoundStatusTypes.ENDWAITING
}
// 玩家回合结束结算
function roundEndSettle() {
  const isMine = isMyTurn()
  const _player = isMine ? Player : EnemyPlayer
  // 记录本回合卡牌记录
  _player.fightRoundUsedCards[Round] = [..._player.roundUsedCards]
  // 清空回合卡牌记录
  _player.roundUsedCards = []
  // 回合后置buff结算
  settleAfterRoundBuffs()
  if (UpperHandPlayerId === CurrentRoundPlayerId) {
    Round++
    updateBuffRoundStatus()
  }
  return RoundStatusTypes.STARTWAITING
}

// 敌对APC相关自动函数
// 敌对APC自动出牌
function enemyAutoPlayCard() {
  const enableHandCards = getEnableHandCards(false)
  // 没有可使用的手牌
  if (!enableHandCards.length) return
  const { [BaseValueAttributeKeys.VITALITY]: cNum } = EnemyPlayer
  for (let i = 0; i < cNum; i++) {
    if (EnemyPlayer.handCards.length === 0) return
    const cIndex = getIntRandom(EnemyPlayer.handCards.length - 1)
    const cId = EnemyPlayer.handCards[cIndex]
    // console.log('敌方出牌', cId)
    playCard(null, false, cId)
  }
}
// 敌对APC自动弃牌
function enemyAutoDropCard() {
  const cardDropNum = EnemyPlayer.handCards.length - EnemyPlayer[BaseValueAttributeKeys.MAXHANDCARDSNUM]
  if (cardDropNum <= 0) return
  for (let i = 0; i < cardDropNum; i++) {
    if (EnemyPlayer.handCards.length === 0) return
    const cIndex = getIntRandom(EnemyPlayer.handCards.length - 1)
    const cId = EnemyPlayer.handCards[cIndex]
    // console.log('敌方弃牌', cId)
    dropCard(null, false, cId)
  }
}
