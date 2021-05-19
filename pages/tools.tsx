import Head from "next/head";
import React, { useState } from "react";
import { Header } from "semantic-ui-react";
import { FileDrop } from "react-file-drop";

import FixedMenuLayout from "../components/FixedMenuLayout";

import { getAllPosts } from "../utils/wiki";
import { getGearIcons, getCharactersStaticProps } from "../utils/ssr";
import { parse } from "../utils/parser";

import { PlayerDataDisplay } from "../components/PlayerDataDisplay";

const ToolsPage = ({ allPosts, gearIcons, allCharacters }) => {
	const [playerData, setPlayerData] = useState(undefined);

	const parseFile = (files: FileList) => {
		files
			.item(0)
			.arrayBuffer()
			.then((arrayData) => {
				let result = parse(arrayData);
				console.log(result);
				setPlayerData(result);
			});
	};

	return (
		<div>
			<Head>
				<title>Star Trek: Legends - Player Tools</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<FixedMenuLayout allPosts={allPosts}>
				<Header as="h1">Star Trek: Legends Player Tools</Header>
				<p>
					This is a work in progress, check <a href="https://github.com/TemporalAgent7/LegendsDataCore">GitHub</a> for
					updates!
				</p>
				{!playerData && (
					<p>
						This lets you export your current game status (character list, etc.) to a human readable format for
						analysis. It only works on macOS computers; to use it drop your saved game below. The saved game path is
						usually{" "}
						<b>
							/Users/[you]]/Library/Containers/com.tiltingpoint.startrek/Data/Library/Preferences/com.tiltingpoint.startrek.plist
						</b>{" "}
						on your mac computer.
					</p>
				)}

				{playerData && <p>Your saved game was succesfully loaded!</p>}

				{!playerData && (
					<div style={{ border: "1px solid black", width: 600, color: "black", padding: 20 }}>
						<FileDrop onDrop={(files) => parseFile(files)}>Drop the save-game here!</FileDrop>
					</div>
				)}

				{playerData && <PlayerDataDisplay playerData={playerData} gearIcons={gearIcons} allCharacters={allCharacters} />}
			</FixedMenuLayout>
		</div>
	);
};

export default ToolsPage;

export async function getStaticProps() {
	return { props: { allPosts: getAllPosts(["title", "slug"]), gearIcons: await getGearIcons(), allCharacters: (await getCharactersStaticProps()).characters } };
}
