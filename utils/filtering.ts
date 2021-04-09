export function characterMatchesSearchFilter(character: any, filters: any[], filterType: string) {
	if (filters.length == 0)
		return true;

	const filterTypes = {
		'Exact': (input: string, searchString: string) => input.toLowerCase() == searchString.toLowerCase(),
		'Whole word': (input: string, searchString: string) => new RegExp('\\b' + searchString + '\\b', 'i').test(input),
		'Any match': (input: string, searchString: string) => input.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
	};
	const matchesFilter = filterTypes[filterType];
	let meetsAnyCondition = false;

	for (let filter of filters) {
		let meetsAllConditions = true;
		if (filter.conditionArray.length === 0) {
			// text search only
			for (let segment of filter.textSegments) {
				let segmentResult =
					matchesFilter(character.locName, segment.text) ||
					character.tags.some(t => matchesFilter(t, segment.text)) ||
					character.bridgeStations.some(t => matchesFilter(t, segment.text));
				meetsAllConditions = meetsAllConditions && (segment.negated ? !segmentResult : segmentResult);
			}
		} else {
			let rarities = [];
			for (let condition of filter.conditionArray) {
				let conditionResult = true;
				if (condition.keyword === 'name') {
					conditionResult = matchesFilter(character.locName, condition.value);
				} else if (condition.keyword === 'tag') {
					conditionResult = character.tags.some(t => matchesFilter(t, condition.value));
				} else if (condition.keyword === 'rarity') {
					if (!condition.negated) {
						rarities.push(Number.parseInt(condition.value));
						continue;
					}

					conditionResult = character.computed_rarity === Number.parseInt(condition.value);
				}
				meetsAllConditions = meetsAllConditions && (condition.negated ? !conditionResult : conditionResult);
			}

			if (rarities.length > 0) {
				meetsAllConditions = meetsAllConditions && rarities.includes(character.computed_rarity);
			}

			for (let segment of filter.textSegments) {
				let segmentResult =
					matchesFilter(character.locName, segment.text) ||
					character.tags.some(t => matchesFilter(t, segment.text));
				meetsAllConditions = meetsAllConditions && (segment.negated ? !segmentResult : segmentResult);
			}
		}
		if (meetsAllConditions) {
			meetsAnyCondition = true;
			break;
		}
	}

	return meetsAnyCondition;
}

// TODO: smarter?
export function itemMatchesSearchFilter(character: any, filters: any[], filterType: string) {
	if (filters.length == 0)
		return true;

	const filterTypes = {
		'Exact': (input: string, searchString: string) => input.toLowerCase() == searchString.toLowerCase(),
		'Whole word': (input: string, searchString: string) => new RegExp('\\b' + searchString + '\\b', 'i').test(input),
		'Any match': (input: string, searchString: string) => input.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
	};
	const matchesFilter = filterTypes[filterType];
	let meetsAnyCondition = false;

	for (let filter of filters) {
		let meetsAllConditions = true;
		if (filter.conditionArray.length === 0) {
			// text search only
			for (let segment of filter.textSegments) {
				let segmentResult =
					matchesFilter(character.locName, segment.text) || matchesFilter(character.locDescription, segment.text);
				meetsAllConditions = meetsAllConditions && (segment.negated ? !segmentResult : segmentResult);
			}
		} else {
			let rarities = [];
			for (let condition of filter.conditionArray) {
				let conditionResult = true;
				if (condition.keyword === 'name') {
					conditionResult = matchesFilter(character.locName, condition.value);
				} else if (condition.keyword === 'rarity') {
					if (!condition.negated) {
						rarities.push(Number.parseInt(condition.value));
						continue;
					}

					conditionResult = character.computed_rarity === Number.parseInt(condition.value);
				}
				meetsAllConditions = meetsAllConditions && (condition.negated ? !conditionResult : conditionResult);
			}

			if (rarities.length > 0) {
				meetsAllConditions = meetsAllConditions && rarities.includes(character.computed_rarity);
			}

			for (let segment of filter.textSegments) {
				let segmentResult =
					matchesFilter(character.locName, segment.text) || matchesFilter(character.locDescription, segment.text);
				meetsAllConditions = meetsAllConditions && (segment.negated ? !segmentResult : segmentResult);
			}
		}
		if (meetsAllConditions) {
			meetsAnyCondition = true;
			break;
		}
	}

	return meetsAnyCondition;
}
