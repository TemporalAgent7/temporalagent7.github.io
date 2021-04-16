import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Header, Image, Grid, List, Segment } from 'semantic-ui-react';

import FixedMenuLayout from '../components/FixedMenuLayout';

import { getMissionsStaticProps } from '../utils/ssr';

const EpisodeDisplay = ({ episode }) => {
	const router = useRouter();
	return (
		<Segment>
			<Grid columns='equal' divided>
				<Grid.Column width={5}>
					<Header as='h2'>
						{episode.locIdentifier} - {episode.locName}
					</Header>
					<Image size='medium' src={`/assets/${episode.backgroundImage}.png`} />
				</Grid.Column>
				<Grid.Column width={11}>
					<List divided relaxed>
						{episode.missions.map((mission) => (
							<List.Item key={mission.id}>
								<List.Content>
									<List.Header as='a' onClick={() => router.push(`/mission/${mission.nodesAsset}`)}>{mission.locName}</List.Header>
									<List.Description><span dangerouslySetInnerHTML={{ __html: mission.locDescription }} /></List.Description>
								</List.Content>
							</List.Item>
						))}
					</List>
				</Grid.Column>
			</Grid>
		</Segment>
	);
};

const MissionPage = ({ episodes, allPosts }) => {
	return (
		<div>
			<Head>
				<title>Star Trek: Legends - Missions</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<FixedMenuLayout allPosts={allPosts}>
				<Header as='h1'>Star Trek: Legends Episodes and Missions</Header>
				<p>
					This is a work in progress, check <a href='https://github.com/TemporalAgent7/LegendsDataCore'>GitHub</a> for updates!
				</p>

				{episodes.map((episode) => (
					<EpisodeDisplay episode={episode} key={episode.id} />
				))}
			</FixedMenuLayout>
		</div>
	);
};

export default MissionPage;

export async function getStaticProps() {
	return { props: await getMissionsStaticProps() };
}
