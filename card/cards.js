// 组合类属性
function blendCardTypeProto(mainCardType = CardTypes.COMMON, type = '', values = []) {
	const proto = {}
	for (let pKey in CardBaseProto[type]) {
		const { defaultValue } = CardBaseProto[type][pKey]
		// 以下数组、对象不能直接使用默认值，而需要直接重置，因为会存在内存空间冲突问题，所以需要重新分配
		switch (pKey) {
			case 'statusTypes': proto[pKey] = values[pKey] || CardTypesProto[mainCardType][pKey] || []; break;
			case 'playerInfo': proto[pKey] = values[pKey] || CardTypesProto[mainCardType][pKey] || {}; break;
			case 'buffs': proto[pKey] = values[pKey] || CardTypesProto[mainCardType][pKey] || {}; break;
			case 'effects':
				proto[pKey] = values[pKey] || CardTypesProto[mainCardType][pKey] || defaultValue
				const effectsFunc = PresetEffects[proto[pKey]]
				proto[pKey] = function () {
					PresetEffects.BaseAttrEffect(this, this.playerInfo)
					PresetEffects.BaseAttackEffect(this)
					if (effectsFunc) effectsFunc(this)
				}
				break
			case 'conditions':
				proto[pKey] = values[pKey] || CardTypesProto[mainCardType][pKey] || defaultValue
				const conditionsFunc = PresetConditions[proto[pKey]]
				proto[pKey] = function () {
					let res = true
					res = res && PresetConditions.BaseCondition(this)
					if (conditionsFunc) res = res && conditionsFunc(this)
					return res
				}
				break
			default:
				proto[pKey] = !values[pKey] && values[pKey] !== 0 ? CardTypesProto[mainCardType][pKey] || defaultValue : values[pKey]
				break
		}
	}
	return proto
}
// 创建卡牌对象
function createCardObject(cardKey = '', extraAttr = {}) {
	const { types, values } = Cards[cardKey]
	let card = { types: [...types, CardTypes.COMMON] }
	const mType = card.types[0]
	for (let vType in values) {
		const typeAttrs = values[vType]
		card = {
			...card,
			...blendCardTypeProto(mType, vType, typeAttrs),
			...extraAttr
		}
	}
	return {
		id: getRandomKey(), key: cardKey, ...card,
		// conditions: PresetConditions[conditions],
		// effects: PresetEffects[effects],
	}
}
// 生成卡组
function generateCardsGroup(playerId, cardsMap = {}) {
	const cards = {}
	for (let cKey in cardsMap) {
		const num = cardsMap[cKey]
		for (let i = 0; i < num; i++) {
			const card = createCardObject(cKey)
			cards[card.id] = { ...card, owner: playerId }
		}
	}
	return cards
}
