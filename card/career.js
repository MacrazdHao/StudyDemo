const InitCards = {
	NormalAttack1: 2,
	NormalDefense1: 2,
	NormalAttack2: 2,
}

const CareerInitInfo = {
	[CareerTypes.HUMAN]: {
		careerNam: '人类',
		[BaseValueAttributeKeys.MAXHP]: 5,
		[BaseValueAttributeKeys.MAXSHIELD]: 10,
		[BaseValueAttributeKeys.MAXMP]: 2,
		[BaseValueAttributeKeys.MAXVITALITY]: 5,
		[BaseValueAttributeKeys.HP]: 3,
		[BaseValueAttributeKeys.SHIELD]: 0,
		[BaseValueAttributeKeys.MP]: 0,
		[BaseValueAttributeKeys.MAXHANDCARDSNUM]: 3,
		[BaseValueAttributeKeys.ROUNDGETCARDNUM]: 2,
		[BaseValueAttributeKeys.INITIALVITALITY]: 2,
		initCards: {
			...InitCards
			// Test1: 1,
			// Test2: 1,
			// Test3: 1,
			// Test4: 1,
			// Test5: 1,
		}
	}
}

function getCareerInitInfo(careerType) {
	return CareerInitInfo[careerType]
}