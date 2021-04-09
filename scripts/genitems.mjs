import { writeFileSync, existsSync } from 'fs';
import { loadJson } from './utils.mjs';

function computeRarity(rarity) {
	switch (rarity) {
		case "Common":
			return 1;
		case "Rare":
			return 2;
		case "VeryRare":
			return 3;
		case "Epic":
			return 4;
		case "Legendary":
			return 5;
	}

	return 0;
}

function generateItemsJson() {
	const items = loadJson('GSItem');

	let allItems = [];
	for (const itemId in items) {
		if (items[itemId].category != "PlayerAvatar") {
			let item = {
				name: items[itemId].name,
				icon: items[itemId].icon,
				category: items[itemId].category,
				currencyType: items[itemId].currencyType,
				description: items[itemId].description,
				rarity: items[itemId].rarity,
				computed_rarity: computeRarity(items[itemId].rarity),
				id: items[itemId].id,

				// For BiomimeticGel category items only
				DataBiomimeticGel: items[itemId].DataBiomimeticGel,
			};

			allItems.push(item);

			if (!existsSync(new URL(`../public/assets/${item.icon}.png`, import.meta.url))) {
				console.warn(`Missing icon '${item.icon}' for '${item.name}'`);
			}
		}
	}

	writeFileSync(new URL(`../data/items.json`, import.meta.url), JSON.stringify(allItems));
}

export { generateItemsJson };
