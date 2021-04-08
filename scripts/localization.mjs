import { writeFileSync } from 'fs';
import { formatAsHtml, loadJson } from './utils.mjs';

function generateLocalizationJson() {
	const loc = loadJson('lang_en_us');

    let parsedLoc = {};
    loc.List.forEach(entry => {
        if (entry.key) {
            parsedLoc[entry.key] = formatAsHtml(entry.value);
        }
    });

    writeFileSync(new URL(`../data/lang_en_us.json`, import.meta.url), JSON.stringify(parsedLoc));
}

export { generateLocalizationJson };