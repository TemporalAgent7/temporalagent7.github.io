import Head from 'next/head';
import React, { useState } from 'react';
import { Header, Input } from 'semantic-ui-react';
import { FileDrop } from 'react-file-drop';

import FixedMenuLayout from '../components/FixedMenuLayout';

import { getAllPosts } from '../utils/wiki';
import { getGearIcons, getCharactersStaticProps, getLevels } from '../utils/ssr';
import { parse } from '../utils/parser';

import { PlayerDataDisplay } from '../components/PlayerDataDisplay';

const ToolsPage = ({ allPosts, gearIcons, levels, allCharacters }) => {
	const [playerData, setPlayerData] = useState(undefined);
	const [sharedId, setSharedId] = useState(undefined);
	const [captainName, setCaptainName] = useState('Captain');

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

	const shareProfile = () => {
		// Clean up the data for sharing
		let dataToShare = {
			captainName,
			accessories: playerData.accessories,
			gears: playerData.gears,
			units: playerData.units,
			last_level_rewarded: playerData.last_level_rewarded,
			missions: playerData.missions,
			cloudSaveId: playerData.cloudSaveId
		};

		fetch(`https://apilegends.datacore.app/post_profile`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dataToShare)
		}).then(() => {
			setSharedId(dataToShare.cloudSaveId);
		});
	};

	return (
		<div>
			<Head>
				<title>Star Trek: Legends - Player Tools</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<FixedMenuLayout allPosts={allPosts}>
				<Header as='h1'>Star Trek: Legends Player Tools</Header>
				<p>
					This is a work in progress, check <a href='https://github.com/TemporalAgent7/LegendsDataCore'>GitHub</a> for updates!
				</p>
				{!playerData && (
					<p>
						This lets you export your current game status (character list, etc.) to a human readable format for analysis. It only works on
						macOS computers; to use it drop your saved game below. The saved game path is usually{' '}
						<b>/Users/[you]]/Library/Containers/com.tiltingpoint.startrek/Data/Library/Preferences/com.tiltingpoint.startrek.plist</b> on
						your mac computer.
					</p>
				)}

				{playerData && (
					<>
						{!sharedId && (
							<>
								<p>Your saved game was succesfully loaded! If you want to share your profile online, click below (the shared profile will include only your characters, particles, gear and mission status):</p>
								<Input
									action={{
										color: 'teal',
										labelPosition: 'right',
										icon: 'share',
										content: 'Share',
										onClick: () => shareProfile()
									}}
									defaultValue={captainName}
									onChange={(ev, data) => setCaptainName(data.value)}
								/>
								<br />
							</>
						)}
						{sharedId && (
							<p>
								Your profile was succesfully uploaded: share <a href={`/view?id=${sharedId}`}>this link</a> to get recommendations or just
								to brag.
							</p>
						)}
					</>
				)}

				{!playerData && (
					<div style={{ border: '1px solid black', width: 600, color: 'black', padding: 20 }}>
						<FileDrop onDrop={(files) => parseFile(files)}>Drop the save-game here!</FileDrop>
					</div>
				)}

				{playerData && <PlayerDataDisplay levels={levels} playerData={playerData} gearIcons={gearIcons} allCharacters={allCharacters} />}
			</FixedMenuLayout>
		</div>
	);
};

export default ToolsPage;

export async function getStaticProps() {
	return {
		props: {
			allPosts: getAllPosts(['title', 'slug']),
			levels: await getLevels(),
			gearIcons: await getGearIcons(),
			allCharacters: (await getCharactersStaticProps()).characters
		}
	};
}
