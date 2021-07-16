import { writeFileSync } from 'fs';
import { formatAsHtml, L, loadJson } from './utils.mjs';

function generatePvPMarkdown() {
	const pvp = loadJson('GSPvPLeagues');

    let content = `---
title: 'PvP Leagues'
date: '${new Date().toISOString()}'
author: 'AutoGenerated'
---

`;

	Object.values(pvp).forEach(entry => {
		content += `
### ${L(entry.name)}
<img src="/assets/${entry.icon}.png" alt="${L(`Data_Tooltip_PVP_${entry.tooltip}_headerText`)}" height="32" >

${formatAsHtml(L(entry.desc))}

Medal: ${entry.medalValue}

Latinum / XP reward: ${entry.reward.AllItems.Latinum}

Power cells reward: ${entry.rewardPowerCells.join(', ')}
`;
	});

    writeFileSync(new URL(`../_wiki/pvpLeagues.md`, import.meta.url), content);
}

export { generatePvPMarkdown };
