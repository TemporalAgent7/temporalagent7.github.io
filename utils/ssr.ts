// Code in this file is intended to run during the SSR build phase, not on the client!

import { promises as fs } from 'fs';
import path from 'path';

// TODO: used for the menu, should be in _app probably
import { getAllPosts } from './wiki';

async function getTranslationTable(lang: string) {
	const dataDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, `lang_${lang}.json`), 'utf8');
	return JSON.parse(fileContents);
}

export async function getCharacterIds() {
	const dataDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'characters.json'), 'utf8');
	let characters = JSON.parse(fileContents);

	return characters.map(c => c.id);
}

export async function getCharactersStaticProps() {
	const dataDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'characters.json'), 'utf8');

	let characters = JSON.parse(fileContents);

	// TODO: i18n integration (once next export supports it)
	const translationTable = await getTranslationTable("en_us");

	characters.forEach((character: any) => {
		character.locName = translationTable[character.name];
	});

	return { characters, allPosts: getAllPosts(['title', 'slug']) };
}

export async function getCharacterStaticProps(id: string) {
	const dataDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'characters.json'), 'utf8');

	let characters = JSON.parse(fileContents);

	let character = characters.find(c => c.id == id);

	// TODO: i18n integration (once next export supports it)
	const translationTable = await getTranslationTable("en_us");

	// Localize strings
	const localizeSkills = (skillArrays) => {
		for (let skills of skillArrays) {
			for (let skill of skills) {
				skill.locName = translationTable[skill.name];
				skill.locDescription = translationTable[skill.description];
			}
		}
	};

	character.locName = translationTable[character.name];
	character.locDescription = translationTable[character.description];
	character.locRarity = translationTable[`Common_Rarity_${character.rarity}`];

	character.quips.forEach(quip => {
		quip.locText = translationTable[quip.text];
	});

	localizeSkills(Object.values(character.skills));
	if (character.bridgeSkill) {
		localizeSkills(Object.values(character.bridgeSkill));
	}

	return { character, allPosts: getAllPosts(['title', 'slug']) };
}

export async function getMissionsStaticProps() {
	const dataDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'episodes.json'), 'utf8');

	let episodes = JSON.parse(fileContents);

	// TODO: i18n integration (once next export supports it)
	const translationTable = await getTranslationTable("en_us");

	// Localize strings
	episodes.forEach((episode: any) => {
		episode.locName = translationTable[episode.name];
		episode.locIdentifier = translationTable[episode.identifier];

		episode.missions.forEach((mission: any) => {
			mission.locName = translationTable[mission.name];
			mission.locDescription = translationTable[mission.description];
			mission.locObjective = translationTable[mission.objective];

			for (const nodeId in mission.nodes) {
				if (mission.nodes[nodeId].encounter) {
					mission.nodes[nodeId].encounter.locDescription = translationTable[mission.nodes[nodeId].encounter.description];
				}

				mission.nodes[nodeId].cutSceneDialogue.forEach((cutSceneDialogue: any) => {
					cutSceneDialogue.locDialogueBody = translationTable[cutSceneDialogue.dialogueBody];
					// null explicitly because undefined cannot be JSON serialized
					cutSceneDialogue.locDialogueHeader = cutSceneDialogue.dialogueHeader ? translationTable[cutSceneDialogue.dialogueHeader] : null;
				});

				mission.nodes[nodeId].exploration.forEach((exploration: any) => {
					exploration.locObjectNameLoc = translationTable[exploration.objectNameLoc];
					// TODO: multiple entries per exploration node?
					exploration.locReactionDialogueId = exploration.reactionDialogueId ? translationTable[`Data_GSCutSceneDialogue_${exploration.reactionDialogueId}_01`] : "";
					// null explicitly because undefined cannot be JSON serialized
					exploration.locHeaderLoc = exploration.headerLoc ? translationTable[exploration.headerLoc] : "";

					exploration.locResultHeaderLoc = exploration.resultHeaderLoc ? translationTable[exploration.resultHeaderLoc] : "";
					exploration.locResultDescLoc = exploration.resultDescLoc ? translationTable[exploration.resultDescLoc] : "";
				});
			}
		});
	});

	return { episodes, allPosts: getAllPosts(['title', 'slug']) };
}

export async function getItemsStaticProps() {
	const dataDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'items.json'), 'utf8');

	let items = JSON.parse(fileContents);

	// TODO: i18n integration (once next export supports it)
	const translationTable = await getTranslationTable("en_us");

	// Localize strings
	items.forEach((item: any) => {
		item.locName = translationTable[item.name];
		item.locDescription = translationTable[item.description];

		// TODO: generic localization with parameters?
		if (item.category == "BiomimeticGel") {
			item.locDescription = item.locDescription.replace('{0}', item.DataBiomimeticGel.Xp);
		}
	});

	// Do a simple initial sort
	items = items.sort((a, b) => a.locName.localeCompare(b.locName));

	return { items, allPosts: getAllPosts(['title', 'slug']) };
}

export async function getGearIcons() {
	const dataDirectory = path.join(process.cwd(), 'scripts', 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'GSGear.json'), 'utf8');
	return JSON.parse(fileContents);
}

export async function getLevels() {
	const dataDirectory = path.join(process.cwd(), 'scripts', 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'GSLevel.json'), 'utf8');
	let levels = JSON.parse(fileContents);

	let allLevels = {};
	for (const levelId in levels) {
		allLevels[levels[levelId].Level] = levels[levelId].Experience;
	}

	return allLevels;
}