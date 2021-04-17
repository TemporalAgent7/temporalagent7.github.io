import { generateCharactersJson } from './gencharacters.mjs';
import { generateEpisodesJson } from './genepisodes.mjs';
import { generateLocalizationJson } from './localization.mjs';
import { generateItemsJson } from './genitems.mjs';
import { generateLevelsJson } from './genlevels.mjs';
import { generatePvPMarkdown } from './mdpvp.mjs';
import { generateStatModMarkdown } from './mdstatmod.mjs';
import { generateShuttlesMarkdown } from './mdshuttles.mjs';
import { generateParticlesMarkdown } from './mdparticles.mjs';
import { generateGearsMarkdown } from './mdgears.mjs';
import { generateMiscMarkdown } from './mdmisc.mjs';

if (process.argv.length !== 3) {
	console.error('Requires one argument (markdown or json)!');
	process.exit(1);
}

if (process.argv[2] == "markdown") {
	generatePvPMarkdown();
	generateStatModMarkdown();
	generateShuttlesMarkdown();
	generateParticlesMarkdown();
	generateGearsMarkdown();
	generateMiscMarkdown();
} else if (process.argv[2] == "json") {
	generateCharactersJson();
	generateEpisodesJson();
	generateLocalizationJson();
	generateItemsJson();
	generateLevelsJson();
} else {
	console.error('Requires one argument (markdown or json)!');
	process.exit(1);
}