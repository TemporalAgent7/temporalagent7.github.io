import Head from 'next/head';
import React from 'react';
import { Header, Image } from 'semantic-ui-react';

import FixedMenuLayout from '../components/FixedMenuLayout';

import { getMissionsStaticProps } from '../utils/ssr';

const EpisodeDisplay = ({ episode }) => {
	let missions = episode.missions.filter(m => m.difficulty == 'Easy');
	return <div>
		<Header as="h2">{episode.identifier} - {episode.name}</Header>
		<Image size='medium' src={`/assets/${episode.backgroundImage}.png`} />
		{missions.map(mission => <div key={mission.id}>
			<Header as="h3">{mission.name}</Header>
			<p>{mission.objective}</p>
			<p dangerouslySetInnerHTML={{ __html: mission.description }} />
		</div>)}
	</div>;
}

const MissionPage = ({ episodes, allPosts }) => {
	return (
		<div>
			<Head>
				<title>Star Trek: Legends - Missions</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<FixedMenuLayout allPosts={allPosts}>
				<Header as='h1'>Star Trek: Legends Episodes and Missions</Header>
				<p>This is a work in progress, check <a href="https://github.com/TemporalAgent7/LegendsDataCore">GitHub</a> for updates!</p>

				{episodes.map(episode => <EpisodeDisplay episode={episode} key={episode.id} />)}
			</FixedMenuLayout>
		</div>);
}

export default MissionPage;

export async function getStaticProps() {
	return { props: await getMissionsStaticProps() };
}