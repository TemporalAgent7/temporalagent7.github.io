import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';

import FixedMenuLayout from '../components/FixedMenuLayout';

import { getAllPosts } from '../utils/wiki';
import { getGearIcons, getCharactersStaticProps, getLevels } from '../utils/ssr';

import { PlayerDataDisplay } from '../components/PlayerDataDisplay';

const ViewPage = ({ allPosts, gearIcons, levels, allCharacters }) => {
	const [playerData, setPlayerData] = useState(undefined);
	const [errorState, setErrorState] = useState(undefined);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);

		fetch(`https://apilegends.datacore.app/get_profile?id=${params.get('id')}`)
			.then((response) => {
				return response.json();
			})
			.then((playerData) => {
				setPlayerData(playerData);
			})
			.catch((err) => {
				setErrorState(err);
			});
	}, []);

	return (
		<div>
			<Head>
				<title>Star Trek: Legends - Profile viewer</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<FixedMenuLayout allPosts={allPosts}>
				<Header as='h1'>Star Trek: Legends Profile - {playerData ? playerData.captainName : ''}</Header>
				<p>
					This is a work in progress, check <a href='https://github.com/TemporalAgent7/LegendsDataCore'>GitHub</a> for updates!
				</p>
				{!playerData && <p>Loading...</p>}

				{errorState && <p style={{ color: 'red' }}>ERROR: {errorState}</p>}

				{playerData && (
					<>
						<p>
							Do you want to share your own profile here? If you have a macOS computer, you can do it <a href='/tools'>here</a>.
						</p>
						<PlayerDataDisplay levels={levels} playerData={playerData} gearIcons={gearIcons} allCharacters={allCharacters} />
					</>
				)}
			</FixedMenuLayout>
		</div>
	);
};

export default ViewPage;

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
