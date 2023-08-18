const CareerInitInfo = {
	[CareerTypes.HUMAN]: {
		careerNam: '人类',
		maxHp: 5, // 最大血量
		maxMp: 2, // 最大灵力
		maxShd: 10, // 最大护盾
		maxVit: 5, // 最大体力
		hp: 3,
		shd: 0,
		mp: 0,
		initVit: 2,
		maxHandCardsNum: 3,
		roundGetCardNum: 2
	}
}

function getCareerInitInfo(careerType) {
	return CareerInitInfo[careerType]
}