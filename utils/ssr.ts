import { promises as fs } from 'fs';
import path from 'path';

// TODO: used for the menu, should be in _app probably
import { getAllPosts } from './wiki';

export async function getCharactersStaticProps() {
	const dataDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'characters.json'), 'utf8');

	let characters = JSON.parse(fileContents);
	characters.forEach((character: any) => {
		switch (character.rarity) {
			case "Common":
				character.computed_rarity = 1;
				break;
			case "Rare":
				character.computed_rarity = 2;
				break;
			case "VeryRare":
				character.computed_rarity = 3;
				break;
			case "Epic":
				character.computed_rarity = 4;
				break;
			case "Legendary":
				character.computed_rarity = 5;
				break;
		}
	});

	return { characters, allPosts: getAllPosts(['title', 'slug']) };
}

export async function getMissionsStaticProps() {
	const dataDirectory = path.join(process.cwd(), 'data');
	const fileContents = await fs.readFile(path.join(dataDirectory, 'episodes.json'), 'utf8');

	let episodes = JSON.parse(fileContents);

	return { episodes, allPosts: getAllPosts(['title', 'slug']) };
}