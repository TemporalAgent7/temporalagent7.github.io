import fs from 'fs';

function formatAsHtml(input) {
	input = input.replace(/<color=#([0-9A-F]{6})>/gi, '<span style="color:#$1">');
	input = input.replace(/<\/color>/g, '</span>');
	return input;
}

function loadJson(name) {
    return JSON.parse(fs.readFileSync(new URL(`./data/${name}.json`, import.meta.url)));
}

const loc = loadJson('localization');

function L(key) {
	const entry = loc.find((entry) => entry.key === key);
	if (!entry) {
		console.warn(`No localization entry '${key}`);
		return '';
	} else {
		return entry.value;
	}
}

export { formatAsHtml, loadJson, L };