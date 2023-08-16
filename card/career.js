const CareerType = {
	HUMAN: 0
}

const CareerInitInfo = {
	[CareerType.HUMAN]: {
		careerNam: '人类',
		hp: 8,
		shd: 0,
		mp: 0,
		maxVit: 2,
		maxHandCardsNum: 3,
		roundGetCardNum: 2
	}
}

function getCareerInitInfo(careerType) {
	return CareerInitInfo[careerType]
}