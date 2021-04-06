const fs = require('fs');

// ======== Misc
function formatAsHtml(input) {
	input = input.replace(/<color=#([0-9A-F]{6})>/gi, '<span style="color:#$1">');
	input = input.replace(/<\/color>/g, '</span>');
	return input;
}

// ======== Localization
let loc = JSON.parse(fs.readFileSync(__dirname + '/../data/localization.json'));

function L(key) {
	let entry = loc.find((entry) => entry.key === key);
	if (!entry) {
		console.warn(`No localization entry '${key}`);
		return '';
	} else {
		return entry.value;
	}
}

// ======== Skills
let skills = JSON.parse(fs.readFileSync(__dirname + '/../data/GSSkill.json'));

function getSkill(id) {
	let found = [];
	for (let entry of Object.values(skills)) {
		if (entry.id.id === id) {
			let skillEntry = {
				name: L(entry.name),
				description: formatAsHtml(L(entry.description)),
				level: entry.level,
				hidden: entry.hidden,
				cooldown: entry.cooldown,
				startingCooldown: entry.startingCooldown,
				numTargets: entry.numTargets,
				targetType: entry.targetType,
				targetState: entry.targetState,
				isPassive: entry.isPassive,
				effects: entry.effects,
				casterEffect: entry.casterEffect,
				img: entry.img,
				isSingleTarget: entry.isSingleTarget,
				isMultiRandom: entry.isMultiRandom,
				isAOE: entry.isAOE
			};

			found.push(skillEntry);
		}
	}

	return found;
}

// ======== Rank Modifiers
let rankModifiers = JSON.parse(fs.readFileSync(__dirname + '/../data/GSRank.json'));

function getRankModifiers(rarity, rank) {
	for (let entry of Object.values(rankModifiers)) {
		if (entry.Rarity == rarity && entry.Rank == rank) {
			return entry;
		}
	}

	console.warn(`RankModifier not found for '${rarity}'`);

	return {
		HealthModifier: 1,
		DefenseModifier: 1,
		AttackModifier: 1,
		TechModifier: 1,
		SpeedModifier: 1
	};
}

// ======== Level Modifiers
let levelModifiers = JSON.parse(fs.readFileSync(__dirname + '/../data/GSLevel.json'));

function getLevelModifiers(rarity, level) {
	for (let entry of Object.values(levelModifiers)) {
		if (entry.Rarity == rarity && entry.Level == level) {
			return entry;
		}
	}

	console.warn(`LevelModifier not found for '${rarity}'`);

	return {
		HealthModifier: 1,
		DefenseModifier: 1,
		AttackModifier: 1,
		TechModifier: 1,
		SpeedModifier: 1
	};
}

// ======== Characters
let characters = JSON.parse(fs.readFileSync(__dirname + '/../data/GSCharacter.json'));

let allcrew = [];

for (let cr in characters) {
	if (characters[cr].Type != 'Disabled') {
		let crew = {
			id: characters[cr].id,
			name: L(characters[cr].Name),
			description: formatAsHtml(L(characters[cr].Description)),
			rarity: characters[cr].Rarity,
			role: characters[cr].Role,
			tags: characters[cr].Tags,
			bridgeStations: characters[cr].BridgeStations,
			icon: characters[cr].Icon,

			// Stats
			Health: characters[cr].Health,
			Defense: characters[cr].Defense,
			Attack: characters[cr].Attack,
			Tech: characters[cr].Tech,
			Speed: characters[cr].Speed,
			GlancingChance: characters[cr].GlancingChance,
			GlancingDamage: characters[cr].GlancingDamage,
			CritChance: characters[cr].CritChance,
			CritDamage: characters[cr].CritDamage,
			Resolve: characters[cr].Resolve,

			// Maxed Stats
			MaxHealth:
				characters[cr].Health *
				getRankModifiers(characters[cr].Rarity, 9).HealthModifier *
				getLevelModifiers(characters[cr].Rarity, 99).HealthModifier,
			MaxDefense:
				characters[cr].Defense *
				getRankModifiers(characters[cr].Rarity, 9).DefenseModifier *
				getLevelModifiers(characters[cr].Rarity, 99).DefenseModifier,
			MaxAttack:
				characters[cr].Attack *
				getRankModifiers(characters[cr].Rarity, 9).AttackModifier *
				getLevelModifiers(characters[cr].Rarity, 99).AttackModifier,
			MaxTech:
				characters[cr].Tech *
				getRankModifiers(characters[cr].Rarity, 9).TechModifier *
				getLevelModifiers(characters[cr].Rarity, 99).TechModifier,
			MaxSpeed:
				characters[cr].Speed *
				getRankModifiers(characters[cr].Rarity, 9).SpeedModifier *
				getLevelModifiers(characters[cr].Rarity, 99).SpeedModifier
		};

		// TODO: accessories and gears further boost stats

		if (characters[cr].BridgeSkill) {
			crew.bridgeSkill = {};
			crew.bridgeSkill[characters[cr].BridgeSkill] = getSkill(characters[cr].BridgeSkill);
		} else {
			crew.bridgeSkill = undefined;
		}

		crew.skills = {};
		for (let skillId of characters[cr].SkillIDs) {
			crew.skills[skillId] = getSkill(skillId);
			for (let skillEntry of crew.skills[skillId]) {
				if (skillEntry.img) {
					if (!fs.existsSync(`assets/${skillEntry.img}.png`)) {
						console.warn(`Missing icon for skill '${skillEntry.img}' ('${crew.name}')`);
					}
				}
			}
		}

		allcrew.push(crew);

		if (!fs.existsSync(`assets/${crew.icon}.png`)) {
			console.warn(`Missing icon for '${crew.name}'`);
		}
	}
}

fs.writeFileSync('characters.json', JSON.stringify(allcrew));
