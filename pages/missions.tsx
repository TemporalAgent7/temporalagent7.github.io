import Head from 'next/head';
import React from 'react';
import { Header, Image, Table } from 'semantic-ui-react';

import FixedMenuLayout from '../components/FixedMenuLayout';

import { getMissionsStaticProps } from '../utils/ssr';

const formatRewardList = (rewards) => {
	let result = [];
	for (let name in rewards) {
		result.push(`${name} x${rewards[name]}`);
	}

	return result.join(', ');
};

const MissionNodeDisplay = ({ node }) => {
	return (
		<div>
			<Header as='h5'>
				{node.NodeId} ({node.Type})
			</Header>
			{!node.StartNode && (
				<p>
					<b>Previous node: </b>
					{node.PreviousNodeId}
				</p>
			)}
			{!node.EndNode && (
				<p>
					<b>Next node(s): </b>
					{node.NextNodeIds.join(', ')}
				</p>
			)}
			{node.encounter && (
				<div>
					<Image size='tiny' src={`/assets/${node.encounter.previewImage}.png`} />
					<p dangerouslySetInnerHTML={{ __html: node.encounter.locDescription }} />
				</div>
			)}
			{node.cutSceneDialogue.map((dialogue) => <p key={dialogue.dialogueBody}>
				<b>{dialogue.locDialogueHeader}</b> ({dialogue.dialoguePosition}): <span dangerouslySetInnerHTML={{ __html: dialogue.locDialogueBody }} />

			</p>)}
			<br />
		</div>
	);
};

const MissionDisplay = ({ mission }) => {
	return (
		<div>
			<Header as='h3'>{mission.locName}</Header>
			<p dangerouslySetInnerHTML={{ __html: mission.locObjective }} />
			<p dangerouslySetInnerHTML={{ __html: mission.locDescription }} />
			<p>
				<b>Suggested power: </b>
				{mission.suggestedPower}
			</p>

			<Header as='h4'>Rewards</Header>

			<Table sortable celled striped collapsing unstackable compact='very'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell width={1}>Type</Table.HeaderCell>
						<Table.HeaderCell width={1}>Difficulty</Table.HeaderCell>
						<Table.HeaderCell width={1}>Xp</Table.HeaderCell>
						<Table.HeaderCell width={2}>Rewards</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{mission.rewards.map((reward) => (
						<Table.Row key={reward.id}>
							<Table.Cell>{reward.id}</Table.Cell>
							<Table.Cell>{reward.difficulty}</Table.Cell>
							<Table.Cell>{reward.xp}</Table.Cell>
							<Table.Cell>{formatRewardList(reward.rewards)}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>

			<Header as='h4'>Nodes</Header>

			{Object.values(mission.nodes).map((node: any) => (
				<MissionNodeDisplay key={node.NodeId} node={node} />
			))}
			<br />
		</div>
	);
};

const EpisodeDisplay = ({ episode }) => {
	let missions = episode.missions.filter((m) => m.difficulty == 'Easy');
	return (
		<div>
			<Header as='h2'>
				{episode.locIdentifier} - {episode.locName}
			</Header>
			<Image size='medium' src={`/assets/${episode.backgroundImage}.png`} />
			{missions.map((mission) => (
				<MissionDisplay mission={mission} key={mission.id} />
			))}
		</div>
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
