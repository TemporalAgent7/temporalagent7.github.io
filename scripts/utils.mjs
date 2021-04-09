import fs from 'fs';

function formatAsHtml(input) {
	input = input.replace(/<color=#([0-9A-F]{6})>/gi, '<span style="color:#$1">');
	input = input.replace(/<\/color>/g, '</span>');
	return input;
}

function loadJson(name) {
    return JSON.parse(fs.readFileSync(new URL(`./data/${name}.json`, import.meta.url)));
}

const loc = loadJson('lang_en_us');

function L(key) {
	const entry = loc.List.find((entry) => entry.key === key);
	if (!entry) {
		console.warn(`No localization entry '${key}`);
		return '';
	} else {
		return entry.value;
	}
}

function mapDifficulty(difficulty) {
	if (difficulty.toLowerCase() == 'doom') {
		return 'UI_Common_Difficulty_Expert';
	} else if (difficulty.toLowerCase() == 'hard') {
		return 'UI_Common_Difficulty_Advanced';
	} else if (difficulty.toLowerCase() == 'easy') {
		return 'UI_Common_Difficulty_Normal';
	} else {
		console.warn(`Unknown difficulty '${difficulty}'`);
		return 'UI_Common_Difficulty_Normal';
	}
}

function formatRewardList(rewards) {
    let result = [];
    for (let name in rewards) {
        result.push(`${name} x${rewards[name]}`);
    }

    return result.join(', ');
}

export { formatAsHtml, loadJson, L, mapDifficulty, formatRewardList };