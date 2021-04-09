import { generateCharactersJson } from './gencharacters.mjs';
import { generateEpisodesJson } from './genepisodes.mjs';
import { generateLocalizationJson } from './localization.mjs';
import { generatePvPMarkdown } from './mdpvp.mjs';
import { generateStatModMarkdown } from './mdstatmod.mjs';

if (process.argv.length !== 3) {
	console.error('Requires one argument (markdown or json)!');
	process.exit(1);
}

if (process.argv[2] == "markdown") {
	generatePvPMarkdown();
	generateStatModMarkdown();
} else if (process.argv[2] == "json") {
	generateCharactersJson();
	generateEpisodesJson();
	generateLocalizationJson();
} else {
	console.error('Requires one argument (markdown or json)!');
	process.exit(1);
}