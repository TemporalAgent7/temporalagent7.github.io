import { writeFileSync } from 'fs';
import { loadJson } from './utils.mjs';

function generateLevelsJson() {
	const levels = loadJson('GSLevel');

	let allLevels = {};
	for (const levelId in levels) {
		allLevels[levels[levelId].Level] = levels[levelId].Experience;
	}

	writeFileSync(new URL(`../data/levels.json`, import.meta.url), JSON.stringify(allLevels));
}

export { generateLevelsJson };
