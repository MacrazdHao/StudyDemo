const InitCards = {
	NormalAttack1: 2,
	Zhexuefuti: 1,
	NormalDefense1: 2,
	NormalAttack2: 2,
	NormalAttack3: 1,
}

const CareerInitInfo = {
	[CareerTypes.HUMAN]: {
		careerNam: '人类',
		[BaseValueAttributeKeys.MAXHP]: 100,
		[BaseValueAttributeKeys.MAXSHIELD]: 100,
		[BaseValueAttributeKeys.MAXMP]: 3,
		[BaseValueAttributeKeys.MAXVITALITY]: 5,
		[BaseValueAttributeKeys.HP]: 100,
		[BaseValueAttributeKeys.SHIELD]: 10,
		[BaseValueAttributeKeys.MP]: 0,
		[BaseValueAttributeKeys.VITALITY]: 2,
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
			Shandianwulianbian: 1,
			Haoziweizhi: 1,
			Damahoudefennu: 1,
			Lvshihan: 1,
			Shutouyabo: 1,
			Jinitaimei: 1,
			JinitaimeiKuang: 1,
			Biaomeideshengyin: 1,
			Shuizainaxiangwa: 1,
			Yebulo: 1,
		}
	}
}

function getCareerInitInfo(careerType) {
	if (CareerInitInfo[careerType][BaseValueAttributeKeys.HP] > CareerInitInfo[careerType][BaseValueAttributeKeys.MAXHP]) {
		CareerInitInfo[careerType][BaseValueAttributeKeys.HP] = CareerInitInfo[careerType][BaseValueAttributeKeys.MAXHP]
	}
	if (CareerInitInfo[careerType][BaseValueAttributeKeys.SHIELD] > CareerInitInfo[careerType][BaseValueAttributeKeys.MAXSHIELD]) {
		CareerInitInfo[careerType][BaseValueAttributeKeys.SHIELD] = CareerInitInfo[careerType][BaseValueAttributeKeys.MAXSHIELD]
	}
	if (CareerInitInfo[careerType][BaseValueAttributeKeys.MP] > CareerInitInfo[careerType][BaseValueAttributeKeys.MAXMP]) {
		CareerInitInfo[careerType][BaseValueAttributeKeys.MP] = CareerInitInfo[careerType][BaseValueAttributeKeys.MAXMP]
	}
	if (CareerInitInfo[careerType][BaseValueAttributeKeys.VITALITY] > CareerInitInfo[careerType][BaseValueAttributeKeys.MAXVITALITY]) {
		CareerInitInfo[careerType][BaseValueAttributeKeys.VITALITY] = CareerInitInfo[careerType][BaseValueAttributeKeys.MAXVITALITY]
	}
	return CareerInitInfo[careerType]
}