const InitCards = {
	NormalAttack1: 2,
	Zhexuefuti: 2,
	// NormalDefense1: 2,
	// NormalAttack2: 2,
	// NormalAttack3: 1,
}

const CareerInitInfo = {
	[CareerTypes.HUMAN]: {
		careerNam: '人类',
		[BaseValueAttributeKeys.MAXHP]: 10,
		[BaseValueAttributeKeys.MAXSHIELD]: 10,
		[BaseValueAttributeKeys.MAXMP]: 2,
		[BaseValueAttributeKeys.MAXVITALITY]: 5,
		[BaseValueAttributeKeys.HP]: 100,
		[BaseValueAttributeKeys.SHIELD]: 100,
		[BaseValueAttributeKeys.MP]: 0,
		[BaseValueAttributeKeys.MAXHANDCARDSNUM]: 3,
		[BaseValueAttributeKeys.ROUNDGETCARDNUM]: 2,
		[BaseValueAttributeKeys.INITIALVITALITY]: 2,
		initCards: {
			...InitCards,
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