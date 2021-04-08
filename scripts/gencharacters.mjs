import { writeFileSync, existsSync } from 'fs';
import { formatAsHtml, loadJson, L } from './utils.mjs';

// ======== Skills
const skills = loadJson('GSSkill');

function getSkill(id) {
	let found = [];
	for (const entry of Object.values(skills)) {
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
const rankModifiers = loadJson('GSRank');

function getRankModifiers(rarity, rank) {
	for (const entry of Object.values(rankModifiers)) {
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
const levelModifiers = loadJson('GSLevel');

function getLevelModifiers(rarity, level) {
	for (const entry of Object.values(levelModifiers)) {
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

// ======== Stat calculations
const baseStat = loadJson('GSBaseStat');
const EPSILON = Math.pow(2, -52);

function clamp01(value) {
	return value < 0 ? 0 : value > 1 ? 1 : value;
}

function lerpUnclamped(a, b, t) {
	if (t < 0 || t > 1) {
		return a + Math.abs(b - a) * t;
	}

	return (b - a) * clamp01(t) + a;
}

function getStatValue(type, value, modifier, gearStatChange = 0, accessoryStatChange = 0) {
	let baseStatValue = baseStat[type];
	if (!baseStatValue) {
		return 1;
	}

	let baseValue = lerpUnclamped(baseStatValue.MinValue, baseStatValue.MaxValue, value) * modifier;

	let finalValue = baseValue + gearStatChange + accessoryStatChange;
	finalValue = Math.max(finalValue, type == 'MaxHealth' ? 1 : 0);

	let num = baseStatValue.MaxValue - baseStatValue.MinValue;
	if (Math.abs(num) < Number.EPSILON) {
		return 1;
	}

	let finalPowerValue = ((finalValue - baseStatValue.MinValue) / num) * baseStatValue.PowerWeight;

	baseValue = Math.floor(baseValue * 100) / 100;
	finalPowerValue = Math.floor(finalPowerValue);

	return { baseValue, finalValue, finalPowerValue };
}

// ======== Characters
function generateCharactersJson() {
	const characters = loadJson('GSCharacter');

	let allcrew = [];
	for (const cr in characters) {
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
				Health: getStatValue('MaxHealth', characters[cr].Health, 1).baseValue,
				Defense: getStatValue('Defense', characters[cr].Defense, 1).baseValue,
				Attack: getStatValue('Attack', characters[cr].Attack, 1).baseValue,
				Tech: getStatValue('Tech', characters[cr].Tech, 1).baseValue,
				Speed: getStatValue('Speed', characters[cr].Speed, 1).baseValue,
				GlancingChance: getStatValue('GlancingChance', characters[cr].GlancingChance, 1).baseValue,
				GlancingDamage: getStatValue('GlancingDamage', characters[cr].GlancingDamage, 1).baseValue,
				CritChance: getStatValue('CritChance', characters[cr].CritChance, 1).baseValue,
				CritDamage: getStatValue('CritDamage', characters[cr].CritDamage, 1).baseValue,
				Resolve: getStatValue('Resolve', characters[cr].Resolve, 1).baseValue,

				// Maxed Stats
				MaxHealth: getStatValue(
					'MaxHealth',
					characters[cr].Health,
					getRankModifiers(characters[cr].Rarity, 9).HealthModifier * getLevelModifiers(characters[cr].Rarity, 99).HealthModifier
				).baseValue,
				MaxDefense: getStatValue(
					'Defense',
					characters[cr].Defense,
					getRankModifiers(characters[cr].Rarity, 9).DefenseModifier * getLevelModifiers(characters[cr].Rarity, 99).DefenseModifier
				).baseValue,
				MaxAttack: getStatValue(
					'Attack',
					characters[cr].Attack,
					getRankModifiers(characters[cr].Rarity, 9).AttackModifier * getLevelModifiers(characters[cr].Rarity, 99).AttackModifier
				).baseValue,
				MaxTech: getStatValue(
					'Tech',
					characters[cr].Tech,
					getRankModifiers(characters[cr].Rarity, 9).TechModifier * getLevelModifiers(characters[cr].Rarity, 99).TechModifier
				).baseValue,
				MaxSpeed: getStatValue(
					'Speed',
					characters[cr].Speed,
					getRankModifiers(characters[cr].Rarity, 9).SpeedModifier * getLevelModifiers(characters[cr].Rarity, 99).SpeedModifier
				).baseValue,
				MaxTotalPower:
					getStatValue('GlancingChance', characters[cr].GlancingChance, 1).finalPowerValue +
					getStatValue('GlancingDamage', characters[cr].GlancingDamage, 1).finalPowerValue +
					getStatValue('CritChance', characters[cr].CritChance, 1).finalPowerValue +
					getStatValue('CritDamage', characters[cr].CritDamage, 1).finalPowerValue +
					getStatValue('Resolve', characters[cr].Resolve, 1).finalPowerValue +
					getStatValue(
						'MaxHealth',
						characters[cr].Health,
						getRankModifiers(characters[cr].Rarity, 9).HealthModifier * getLevelModifiers(characters[cr].Rarity, 99).HealthModifier
					).finalPowerValue +
					getStatValue(
						'Defense',
						characters[cr].Defense,
						getRankModifiers(characters[cr].Rarity, 9).DefenseModifier * getLevelModifiers(characters[cr].Rarity, 99).DefenseModifier
					).finalPowerValue +
					getStatValue(
						'Attack',
						characters[cr].Attack,
						getRankModifiers(characters[cr].Rarity, 9).AttackModifier * getLevelModifiers(characters[cr].Rarity, 99).AttackModifier
					).finalPowerValue +
					getStatValue(
						'Tech',
						characters[cr].Tech,
						getRankModifiers(characters[cr].Rarity, 9).TechModifier * getLevelModifiers(characters[cr].Rarity, 99).TechModifier
					).finalPowerValue +
					getStatValue(
						'Speed',
						characters[cr].Speed,
						getRankModifiers(characters[cr].Rarity, 9).SpeedModifier * getLevelModifiers(characters[cr].Rarity, 99).SpeedModifier
					).finalPowerValue
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
						if (!existsSync(new URL(`../public/assets/${skillEntry.img}.png`, import.meta.url))) {
							console.warn(`Missing icon for skill '${skillEntry.img}' ('${crew.name}')`);
						}
					}
				}
			}

			allcrew.push(crew);

			if (!existsSync(new URL(`../public/assets/${crew.icon}.png`, import.meta.url))) {
				console.warn(`Missing icon for '${crew.name}'`);
			}
		}
	}

	writeFileSync(new URL(`../data/characters.json`, import.meta.url), JSON.stringify(allcrew));
}

export { generateCharactersJson };
