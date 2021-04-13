import Head from 'next/head';
import React, { useState } from 'react';
import { Header, Image, Segment, List } from 'semantic-ui-react';
import { Stage, Text, Layer, Arrow, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

import FixedMenuLayout from '../components/FixedMenuLayout';

import { getMissionsStaticProps } from '../utils/ssr';

const NODE_IMAGE_SIZE = 48;

const formatRewardList = (rewards) => {
	let result = [];
	for (let name in rewards) {
		result.push(`${name} x${rewards[name]}`);
	}

	return result.join(', ');
};

const MapNodeImage = ({ x, y, onClicked, selected }) => {
	const [image] = useImage(`/assets/MapNode.png`);
	const [imageSelected] = useImage(`/assets/MapNode_Complete.png`);
	return (
		<KonvaImage
			x={x}
			y={y}
			width={NODE_IMAGE_SIZE}
			height={NODE_IMAGE_SIZE}
			image={selected ? imageSelected : image}
			onClick={() => onClicked()}
		/>
	);
};

const ISSERVER = typeof window === 'undefined';

class ConnectingNode {
	id: string;
	index: number;
}

class NodePosition {
	x: number;
	y: number;
	nextNodeIds: ConnectingNode[];
}

const MissionCanvasDisplay = ({ nodes, onNodeSelected }) => {
	if (ISSERVER) {
		return <span />;
	}

	const sortedX = nodes.map((n) => n.position.x).sort((a, b) => b - a);
	const sortedY = nodes.map((n) => n.position.y).sort((a, b) => b - a);

	let minX = sortedX[sortedX.length - 1];
	let maxX = sortedX[0];

	let minY = sortedY[sortedY.length - 1];
	let maxY = sortedY[0];

	let origX = maxX - minX;
	let origY = maxY - minY;

	let curX = window.innerWidth / 2;
	let curY = 400;

	let translateX = (x: number) => curX * 0.05 + ((x - minX) * curX) / (origX * 1.3);
	let translateY = (y: number) => curY * 0.05 + ((y - minY) * curY) / (origY * 1.3);

	let nodePositions = new Map<string, NodePosition>();
	nodes.forEach((node) => {
		let entry = { x: translateX(node.position.x), y: translateY(node.position.y), nextNodeIds: [] };
		node.NextNodeIds.forEach((nn) => {
			let hasExploration = false;
			node.exploration.forEach((e) => {
				if (e.branchingNodeId == nn) {
					entry.nextNodeIds.push({
						id: nn,
						index: e.index
					});
					hasExploration = true;
				}
			});

			if (!hasExploration) {
				entry.nextNodeIds.push({
					id: nn,
					index: 0
				});
			}
		});
		nodePositions.set(node.NodeId, entry);
	});

	const [selected, setSelected] = useState(nodes[0].NodeId);

	return (
		<Stage width={window.innerWidth / 2} height={400}>
			<Layer>
				{Array.from(nodePositions.keys()).map((node) => (
					<>
						<MapNodeImage
							selected={selected == node}
							key={node}
							x={nodePositions.get(node).x}
							y={nodePositions.get(node).y}
							onClicked={() => {
								setSelected(node);
								onNodeSelected(node);
							}}
						/>
						{nodePositions.get(node).nextNodeIds.map((nextNode) => (
							<>
								<Arrow
									closed
									stroke={selected == node ? 'green' : 'black'}
									strokeWidth={4}
									key={nextNode.id}
									x={nodePositions.get(node).x}
									y={nodePositions.get(node).y}
									points={[
										NODE_IMAGE_SIZE / 2,
										NODE_IMAGE_SIZE / 2,
										nodePositions.get(nextNode.id).x + NODE_IMAGE_SIZE / 2 - nodePositions.get(node).x,
										nodePositions.get(nextNode.id).y + NODE_IMAGE_SIZE / 2 - nodePositions.get(node).y
									]}
								/>
								{selected == node && nextNode.index != 0 && (
									<Text
										x={nodePositions.get(node).x + (nodePositions.get(nextNode.id).x - nodePositions.get(node).x) / nextNode.index}
										y={nodePositions.get(node).y + (nodePositions.get(nextNode.id).y - nodePositions.get(node).y) / nextNode.index}
										text={nextNode.index.toString()}
									/>
								)}
							</>
						))}
					</>
				))}
			</Layer>
		</Stage>
	);
};

const MissionNodeDisplay = ({ node }) => {
	return (
		<Segment raised>
			<Header as='h5'>
				{node.NodeId} ({node.Type})
			</Header>
			{node.first_reward.Easy && (
				<>
					<Header as='h5'>Rewards</Header>
					<ul>
						{Object.keys(node.first_reward).map((dif) => (
							<li key={dif}>
								<b>{dif}</b>: {node.first_reward[dif]}
							</li>
						))}
					</ul>
					<Header as='h5'>Replay rewards</Header>
					<ul>
						{Object.keys(node.replay_reward).map((dif) => (
							<li key={dif}>
								<b>{dif}</b>: {node.replay_reward[dif]}
							</li>
						))}
					</ul>
				</>
			)}

			<List divided relaxed>
				{node.exploration.map((exp) => (
					<List.Item key={exp.difficulty + exp.index}>
						<Image avatar src={`/assets/${exp.iconName}.png`} style={{ filter: 'invert(1)' }} />
						<List.Content>
							<List.Header>
								Path {exp.index} ({exp.locHeaderLoc})
							</List.Header>
							<List.Description>
								{exp.requiredProficiencyValue.Easy > 0 ? (
									<ul>
										{Object.keys(exp.requiredProficiencyValue).map((dif) => (
											<li key={dif}>
												<b>{dif}</b>: requires {exp.requiredProficiencyValue[dif]} {exp.requiredProficiency[dif]}
											</li>
										))}
									</ul>
								) : (
									<span>No required proficiency</span>
								)}
								<p dangerouslySetInnerHTML={{ __html: exp.locReactionDialogueId }} />
								{exp.locResultHeaderLoc} <p dangerouslySetInnerHTML={{ __html: exp.locResultDescLoc }} />
								{exp.bonusEffectId && (
									<p>
										Bonus effect: <b>{exp.bonusEffectId}</b>
									</p>
								)}
								<Header as='h5'>Rewards</Header>
								<ul>
									{Object.keys(exp.first_reward).map((dif) => (
										<li key={dif}>
											<b>{dif}</b>: {exp.first_reward[dif]}
										</li>
									))}
								</ul>
								<Header as='h5'>Replay rewards</Header>
								<ul>
									{Object.keys(exp.replay_reward).map((dif) => (
										<li key={dif}>
											<b>{dif}</b>: {exp.replay_reward[dif]}
										</li>
									))}
								</ul>
							</List.Description>
						</List.Content>
					</List.Item>
				))}
			</List>
			{node.encounter && (
				<div>
					<Image size='tiny' src={`/assets/${node.encounter.previewImage}.png`} />
					<p dangerouslySetInnerHTML={{ __html: node.encounter.locDescription }} />
				</div>
			)}
			{node.cutSceneDialogue.map((dialogue) => (
				<p key={dialogue.dialogueBody}>
					<b>{dialogue.locDialogueHeader}</b> ({dialogue.dialoguePosition}):{' '}
					<span dangerouslySetInnerHTML={{ __html: dialogue.locDialogueBody }} />
				</p>
			))}
			<br />
		</Segment>
	);
};

const MissionDisplay = ({ mission }) => {
	const [selected, setSelected] = useState<string>(Object.keys(mission.nodes)[0]);

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

			{mission.rewards.map((reward) => (
				<div key={reward.id}>
					<Header as='h5'>{reward.id} rewards</Header>
					<ul>
						{Object.keys(reward.rewards).map((dif) => (
							<li key={dif}>
								<b>{dif}</b>: {reward.xp[dif]} player XP and {reward.rewards[dif]}
							</li>
						))}
					</ul>
				</div>
			))}

			<Header as='h4'>Nodes</Header>

			<Segment raised>
				<MissionCanvasDisplay nodes={Object.values(mission.nodes)} onNodeSelected={(node) => setSelected(node)} />
			</Segment>

			<MissionNodeDisplay node={mission.nodes[selected]} />
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
